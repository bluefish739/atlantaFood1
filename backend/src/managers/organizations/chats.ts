import { BadRequestError, OrganizationChatStatuses, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";

export class ChatManager {
    // async getChatStatuses(requestContext: RequestContext) {
    //     const organizationID = requestContext.getCurrentOrganizationID();
    //     if (!organizationID) {
    //         throw new BadRequestError("User is not associated with any organization");
    //     }

    //     try {
    //         const organizations = await organizationDAO.getAllOrganizations();
    //         const chatStatuses = await Promise.all(organizations
    //             .filter(org => org.id !== organizationID && org.name && org.name.trim() !== "")
    //             .map(async org => {
    //                 if (!org.name) return;
    //                 const messages = await organizationDAO.getMessagesBetweenOrganizations(organizationID, org.id!);
    //                 logger.log("getChatStatuses: messages with " + org.name + ": ", messages);
    //                 const chatStatus = new ChatStatus();
    //                 chatStatus.organizationName = org.name;
    //                 chatStatus.chatStarted = messages.length > 0;
                    
    //                 const latestTimestamp = Math.max(...messages.map(msg => msg.timestamp ? msg.timestamp.getTime() : 0));
    //                 chatStatus.lastUpdateTimestamp = latestTimestamp ? new Date(latestTimestamp) : undefined;
    //                 return chatStatus;
    //             }));
    //         logger.log(chatStatuses);
    //         return chatStatuses;
    //     } catch (error: any) {
    //         throw new ServerError("Failed to retrieve chat statuses: " + error.message);
    //     }
    // }

    async getOrganizationsWithActiveChats(requestContext: RequestContext) {
        const organizationID = requestContext.getCurrentOrganizationID();
        if (!organizationID) {
            throw new BadRequestError("User is not associated with any organization");
        }

        try {
            const organizationsAvailableToChat = (await organizationDAO.getAllOrganizations())
                .filter(org => org.id !== organizationID && org.name && org.name.trim() !== "");
            const organizationsChatStatuses = new OrganizationChatStatuses();
            for (const org of organizationsAvailableToChat) {
                const messages = await organizationDAO.getMessagesBetweenOrganizations(organizationID, org.id!);
                if (messages.length > 0) {
                    organizationsChatStatuses.organizationsWithActiveChats.push(org);
                } else {
                    organizationsChatStatuses.organizationsToSearch.push(org);
                }
            }

            return organizationsChatStatuses;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve organizations with active chats: " + error.message);
        }
    }
}