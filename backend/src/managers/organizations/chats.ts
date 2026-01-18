import { BadRequestError, ChatSummary, Message, OrganizationChatStatuses, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";
import { communicationsManager } from "../manager-factory";
import { alphabeticalCompare, getIdentifier } from "../../utility-functions";
import * as logger from "firebase-functions/logger";

export class ChatManager {
    async getOrganizationsWithActiveChats(requestContext: RequestContext) {
        const organizationID = requestContext.getCurrentOrganizationID();
        if (!organizationID) {
            throw new BadRequestError("User is not associated with any organization");
        }

        try {
            const organizationsAvailableToChat = (await organizationDAO.getAllOrganizations())
                .filter(org => org.id !== organizationID && org.name && org.name.trim() !== "");
            const organizationsChatStatuses = new OrganizationChatStatuses();
            const timestampMap = new Map<string, Date>();
            for (const org of organizationsAvailableToChat) {
                const latestMessageTimestamp = await communicationsManager.getLatestMessageTimestamp(requestContext, org.id!);
                if (latestMessageTimestamp !== null) { // There is an active chat
                    const chatSummary = await organizationDAO.getChatSummary(getIdentifier(organizationID, org.id!));
                    const lastReadTimestamp = alphabeticalCompare(organizationID, org.id!) ? chatSummary?.lastReadByOrg1 : chatSummary?.lastReadByOrg2;

                    if (lastReadTimestamp == null || latestMessageTimestamp > lastReadTimestamp) {
                        organizationsChatStatuses.organizationsWithNewMessages.push(org); // New messages to be read
                    } else {
                        organizationsChatStatuses.organizationsWithActiveChats.push(org);
                        timestampMap.set(org.id!, latestMessageTimestamp); // Store timestamp for sorting
                    }
                } else {
                    organizationsChatStatuses.organizationsToSearch.push(org); // No active chat
                }
            }
           
            organizationsChatStatuses.organizationsToSearch.sort((a, b) => a.name!.localeCompare(b.name!)); // Sort organizations without active chats alphabetically
            organizationsChatStatuses.organizationsWithActiveChats.sort((a, b) => 
                timestampMap.get(b.id!)!.getTime() - timestampMap.get(a.id!)!.getTime() // Currently only contains organizations with no new messages, but active chat
            );
            organizationsChatStatuses.organizationsWithActiveChats = 
                [...organizationsChatStatuses.organizationsWithNewMessages, ...organizationsChatStatuses.organizationsWithActiveChats]; // Now append organizations with new messages at top
            
            return organizationsChatStatuses;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve organizations with active chats: " + error.message);
        }
    }

    async getNewMessagesWithOrganization(requestContext: RequestContext, otherOrganizationID: string, lastMessageTimestamp: Date) {
        logger.log("Starting to poll for new messages...");
        try {
            const organizationID = requestContext.getCurrentOrganizationID()!;
            const chatIdentifier = getIdentifier(organizationID, otherOrganizationID);

            return new Promise<Message[]>((resolve, reject) => {
                let pollingTimeout: NodeJS.Timeout;
                let pollCount = 0;
    
                const shortPoll = async () => {
                    logger.log(`Polling attempt ${pollCount} for chatIdentifier: ${chatIdentifier}`);
                    try {
                        const messages = await organizationDAO.getMessagesBetweenOrganizations(chatIdentifier);
                        logger.log("Messages retrieved:", messages);
    
                        const newMessages = messages.filter(message => message.timestamp! > lastMessageTimestamp);
                        logger.log("New messages:", newMessages);
    
                        await this.updateChatSummary(organizationID, otherOrganizationID);
    
                        if (newMessages.length !== 0 || pollCount > 60) {
                            clearTimeout(pollingTimeout);
                            newMessages.sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
                            resolve(newMessages);
                            return;
                        }
    
                        pollCount++;
                        pollingTimeout = setTimeout(shortPoll, 1000);
                    } catch (error) {
                        logger.error("Error during polling:", error);
                        reject(error);
                    }
                };
    
                shortPoll();
            });
        } catch (error: any) {
            throw new ServerError("Failed to retrieve new messages: " + error.message);
        }
    }

    async updateChatSummary(organizationID: string, otherOrganizationID: string) {
        const chatSummary: ChatSummary = await organizationDAO.getChatSummary(getIdentifier(organizationID, otherOrganizationID));
        if (!chatSummary) {
            return;
        }
        if (organizationID < otherOrganizationID) {
            chatSummary.lastReadByOrg1 = new Date();
        } else {
            chatSummary.lastReadByOrg2 = new Date();
        }
        await organizationDAO.saveChatSummary(chatSummary);
    }
}