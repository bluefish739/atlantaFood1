import express, { Request, Response } from "express";
import { authenticator } from "../shared/authentication";
import { BaseRouter } from "./base-router";
import { Message, RequestContext } from "../../../shared/src/kinds";
import { GeneralConfirmationResponse } from "../../../shared/src/kinds";
import { communicationsManager } from "../managers/manager-factory";

export class CommunicationsRouter extends BaseRouter {
    async sendMessage(req: Request, res: Response) {
        const message = req.body as Message;
        try {
            await communicationsManager.sendMessage(new RequestContext(req), message);

            const generalConfirmationResponse = new GeneralConfirmationResponse();
            generalConfirmationResponse.success = true;
            generalConfirmationResponse.message = "Message sent successfully";
            this.sendNormalResponse(res, generalConfirmationResponse);
        } catch (error: any) {
            this.sendBadRequestResponse(res, { success: false, message: error.message });
        }
    }

    async getMessagesWithOrganization(req: Request, res: Response) {
        const otherOrganizationID = req.params.otherOrganizationID as string;
        try {
            const messages = await communicationsManager.getMessagesWithOrganization(new RequestContext(req), otherOrganizationID);
            this.sendNormalResponse(res, messages);            
        } catch (error: any) {
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
    }

    async getChatStatuses(req: Request, res: Response) {
        try {
            const chatStatuses = await communicationsManager.getChatStatuses(new RequestContext(req));
            this.sendNormalResponse(res, chatStatuses);            
        } catch (error: any) {
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
    }

    static buildRouter() {
        const communicationsRouter = new CommunicationsRouter();
        return express.Router()
            .post('/send-message-to-organization', authenticator([]), communicationsRouter.sendMessage.bind(communicationsRouter))
            .get('/get-messages-with-organization/:otherOrganizationID', authenticator([]), communicationsRouter.getMessagesWithOrganization.bind(communicationsRouter))
            .get('/get-chat-statuses', authenticator([]), communicationsRouter.getChatStatuses.bind(communicationsRouter));
    }
}