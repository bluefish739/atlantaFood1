import { BadRequestError, ChatSummary, OrganizationChatStatuses, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";
import { communicationsManager } from "../manager-factory";

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
                if (latestMessageTimestamp !== null) {
                    organizationsChatStatuses.organizationsWithActiveChats.push(org);
                    timestampMap.set(org.id!, latestMessageTimestamp);
                } else {
                    organizationsChatStatuses.organizationsToSearch.push(org);
                }
            }

            organizationsChatStatuses.organizationsWithActiveChats.sort((a, b) => timestampMap.get(b.id!)!.getTime() - timestampMap.get(a.id!)!.getTime());
            organizationsChatStatuses.organizationsToSearch.sort((a, b) => a.name!.localeCompare(b.name!));

            return organizationsChatStatuses;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve organizations with active chats: " + error.message);
        }
    }

    async getNewMessagesWithOrganization(requestContext: RequestContext, otherOrganizationID: string, lastMessageTimestamp: Date) {
        try {
            const organizationID = requestContext.getCurrentOrganizationID()!;
            const messages = await organizationDAO.getMessagesBetweenOrganizations(organizationID, otherOrganizationID);
            messages.sort((a, b) => (a.timestamp!.getTime() - b.timestamp!.getTime()));
            const newMessages = messages.filter(message => message.timestamp! > lastMessageTimestamp);

            await this.updateChatSummary(organizationID, otherOrganizationID);
            return newMessages;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve new messages: " + error.message);
        }
    }

    async updateChatSummary(organizationID: string, otherOrganizationID: string) {
        let chatSummary: ChatSummary = await organizationDAO.getChatSummary(organizationID, otherOrganizationID);
        if (chatSummary == null) {
            chatSummary = new ChatSummary();
        } else {
            if (organizationID < otherOrganizationID) {
                chatSummary.lastReadByOrg1 = new Date();
            } else {
                chatSummary.lastReadByOrg2 = new Date();
            }
        }
        await organizationDAO.saveChatSummary(chatSummary);
    }
}