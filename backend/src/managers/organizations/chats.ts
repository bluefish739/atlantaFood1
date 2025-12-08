import { BadRequestError, OrganizationChatStatuses, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";
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
                const messages = await organizationDAO.getMessagesBetweenOrganizations(organizationID, org.id!);
                if (messages.length > 0) {
                    organizationsChatStatuses.organizationsWithActiveChats.push(org);
                    const latestTimestamp = new Date(Math.max(...messages.map(msg => msg.timestamp ? msg.timestamp.getTime() : 0)));
                    timestampMap.set(org.id!, latestTimestamp);
                } else {
                    organizationsChatStatuses.organizationsToSearch.push(org);
                }
            }

            timestampMap.forEach((timestamp, orgID) => {
                logger.log(`timestampMap, orgID: ${orgID}, timestamp: ${timestamp.toISOString()}`);
            });
            organizationsChatStatuses.organizationsWithActiveChats.sort((a, b) => timestampMap.get(b.id!)!.getTime() - timestampMap.get(a.id!)!.getTime());
            organizationsChatStatuses.organizationsToSearch.sort((a, b) => a.name!.localeCompare(b.name!));

            return organizationsChatStatuses;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve organizations with active chats: " + error.message);
        }
    }
}