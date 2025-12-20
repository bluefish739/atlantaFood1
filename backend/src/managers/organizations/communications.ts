import { BadRequestError, ChatSummary, Message, RequestContext, ServerError } from "../../../../shared/src/kinds";
import { organizationDAO } from "../../daos/dao-factory";
import { generateId } from "../../shared/idutilities";

export class CommunicationsManager {
    async sendMessage(requestContext: RequestContext, message: Message) {
        try {
            await this.validateMessage(requestContext, message);
            message.id = generateId();
            message.sendingOrganization = requestContext.getCurrentOrganizationID()!;
            message.chatIdentifier = [message.sendingOrganization, message.receivingOrganization].sort().join("|");
            message.timestamp = new Date();
            // setTimeout(async () => {
            //     await organizationDAO.saveMessage(message);
            //     await this.updateChatSummary(message);
            // }, 30000);
            await organizationDAO.saveMessage(message);
            await this.updateChatSummary(message);
        } catch (error: any) {
            throw new BadRequestError("Failed to send message: " + error.message);
        }
    }

    async getLatestMessageTimestamp(requestContext: RequestContext, otherOrganizationID: string) {
        const organizationID = requestContext.getCurrentOrganizationID()!;
        try {
            const data = await organizationDAO.getChatSummary(organizationID, otherOrganizationID);
            if (this.chatSummaryFound(data)) {
                return data.lastMessageTimestamp!;
            }
            return null;
        } catch (error: any) {
            throw new ServerError("Failed to retrieve latest message timestamp: " + error.message);
        }
    }

    private chatSummaryFound(data: any): data is ChatSummary {
        if (!data || typeof data !== "object") {
            return false;
        }
        const hasChatIdentifier = typeof data.chatIdentifier === "string";
        const hasLastMessageTimestamp = data.lastMessageTimestamp instanceof Date;
        const hasRequiredProperties = hasChatIdentifier && hasLastMessageTimestamp;
        return hasRequiredProperties;
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
        const data = await organizationDAO.getChatSummary(message.receivingOrganization!, message.sendingOrganization!);
        if (this.chatSummaryFound(data)) {
            const chatSummary = data as ChatSummary;
            chatSummary.lastMessageTimestamp = message.timestamp!;
            await organizationDAO.saveChatSummary(chatSummary);
            return;
        }
        const chatSummary = new ChatSummary();
        chatSummary.chatIdentifier = [message.sendingOrganization, message.receivingOrganization].sort().join("|");
        chatSummary.lastMessageTimestamp = message.timestamp;
        await organizationDAO.saveChatSummary(chatSummary);
    }
}