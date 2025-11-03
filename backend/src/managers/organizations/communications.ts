import { BadRequestError, Message, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";
import { generateId } from "../../shared/idutilities";
//import * as logger from "firebase-functions/logger";

export class CommunicationsManager {
    async sendMessage(requestContext: RequestContext, message: Message) {
        try {
            await this.validateMessage(requestContext, message);
            message.id = generateId();
            message.sendingOrganization = requestContext.getCurrentOrganizationID()!;
            message.timestamp = new Date();
            await organizationDAO.saveMessage(message);
        } catch (error: any) {
            throw new BadRequestError("Failed to send message: " + error.message);
        }
    }

    private async validateMessage(requestContext: RequestContext, message: Message) {
        if (!message) {
            throw new BadRequestError("Message entity is not provided");
        }

        const organizationID = requestContext.getCurrentOrganizationID();
        if (!organizationID) {
            throw new BadRequestError("User is not associated with any organization");
        }

        if (!message.content) {
            throw new BadRequestError("Message content is empty");
        }

        if (!message.receivingOrganization || !(await organizationDAO.getOrganization(message.receivingOrganization))) {
            throw new BadRequestError("Receiving organization is not specified or does not exist");
        }
    }

    async getMessagesWithOrganization(requestContext: RequestContext, otherOrganizationID: string) {
        const organizationID = requestContext.getCurrentOrganizationID();
        if (!organizationID) {
            throw new BadRequestError("User is not associated with any organization");
        }

        try {
            const messages = [...(await organizationDAO.getMessagesBetweenOrganizations(organizationID, otherOrganizationID)),
                ...(await organizationDAO.getMessagesBetweenOrganizations(otherOrganizationID, organizationID))];
            messages.sort((a, b) => (a.timestamp!.getTime() - b.timestamp!.getTime()));
            return messages;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve messages: " + error.message);
        }
        
    }
}