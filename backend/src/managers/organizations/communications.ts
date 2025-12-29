import { BadRequestError, ChatSummary, Message, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";
import { generateId } from "../../shared/idutilities";
import { getIdentifier } from "../../utility-functions";

export class CommunicationsManager {
    async sendMessage(requestContext: RequestContext, message: Message) {
        try {
            await this.validateMessage(requestContext, message);
            message.id = generateId();
            message.sendingOrganization = requestContext.getCurrentOrganizationID()!;
            message.chatIdentifier = getIdentifier(message.sendingOrganization, message.receivingOrganization!);
            message.timestamp = new Date();
            await organizationDAO.saveMessage(message);
            await this.updateChatSummary(message);
        } catch (error: any) {
            throw new BadRequestError("Failed to send message: " + error.message);
        }
    }

    async getLatestMessageTimestamp(requestContext: RequestContext, otherOrganizationID: string) {
        const organizationID = requestContext.getCurrentOrganizationID()!;
        try {
            const chatIdentifier = getIdentifier(organizationID, otherOrganizationID);
            const data = await organizationDAO.getChatSummary(chatIdentifier);
            return data == null ? null : data.lastMessageTimestamp!;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve latest message timestamp: " + error.message);
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

    private async updateChatSummary(message: Message) {
        const chatIdentifier = getIdentifier(message.sendingOrganization!, message.receivingOrganization!);
        const data = await organizationDAO.getChatSummary(chatIdentifier);
        let chatSummary = data || new ChatSummary();
        if (data != null) {
            data.lastMessageTimestamp = message.timestamp!;
        } else {
            chatSummary.chatIdentifier = [message.sendingOrganization, message.receivingOrganization].sort().join("|");
            chatSummary.lastMessageTimestamp = message.timestamp;
        }
        await organizationDAO.saveChatSummary(chatSummary);
    }
}