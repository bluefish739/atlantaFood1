import express, { Request, Response } from "express";
import { authenticator } from "../shared/authentication";
import { BaseRouter } from "./base-router";
import { BadRequestError, Message, MessagePollRequest, RequestContext } from "../../../shared/src/kinds";
import { GeneralConfirmationResponse } from "../../../shared/src/kinds";
import { chatManager, communicationsManager } from "../managers/manager-factory";

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
            const messages = await chatManager.getMessagesWithOrganization(new RequestContext(req), otherOrganizationID);
            this.sendNormalResponse(res, messages);            
        } catch (error: any) {
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
    }

    async getOrganizationsWithActiveChats(req: Request, res: Response) {
        try {
          const organizationChatStatuses = await chatManager.getOrganizationsWithActiveChats(new RequestContext(req));
          this.sendNormalResponse(res, organizationChatStatuses);
        } catch (error: any) {
          if (error instanceof BadRequestError) {
            this.sendBadRequestResponse(res, { success: false, message: error.message });
          } else {
            this.sendServerErrorResponse(res, { success: false, message: error.message });
          }
        }
      }

      async getNewMessagesWithOrganization(req: Request, res: Response) {
        const messagePollRequest = req.body as MessagePollRequest;
        const otherOrganizationID = messagePollRequest.otherOrganizationID!;
        const lastMessageTimestamp = new Date(messagePollRequest.lastMessageTimestamp!);
        try {
            const newMessages = await chatManager.getNewMessagesWithOrganization(new RequestContext(req), otherOrganizationID, lastMessageTimestamp);
            this.sendNormalResponse(res, newMessages);            
        } catch (error: any) {
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
      }

    static buildRouter() {
        const communicationsRouter = new CommunicationsRouter();
        return express.Router()
            .post('/send-message-to-organization', authenticator([]), communicationsRouter.sendMessage.bind(communicationsRouter))
            .get('/get-messages-with-organization/:otherOrganizationID', authenticator([]), communicationsRouter.getMessagesWithOrganization.bind(communicationsRouter))
            .get("/get-chat-statuses", authenticator([]), communicationsRouter.getOrganizationsWithActiveChats.bind(communicationsRouter))
            .post("/get-new-messages-with-organization", authenticator([]), communicationsRouter.getNewMessagesWithOrganization.bind(communicationsRouter));
    }
}