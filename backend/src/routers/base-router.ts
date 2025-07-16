import { Request, Response } from "express";
import { userDAO } from "../daos/dao-factory";
import { sendResponse } from "../utility-functions";

export class BaseRouter {
    async verifySession(req: Request, res: Response) {
        const authentication = req.headers.authentication as string;
        const user = await userDAO.getUserBySessionID(authentication);
        if (!user) {
            this.sendSessionErrorResponse(res, { success: false, message: "Invalid session" });
            return;
        }
    }

    sendSuccessfulResponse(res: Response, resObj: any) {
        sendResponse(res, resObj, 200);
    }

    sendServerErrorResponse(res: Response, resObj: any) {
        sendResponse(res, resObj, 500);
    }

    sendSessionErrorResponse(res: Response, resObj: any) {
        sendResponse(res, resObj, 401);
    }

    sendClientErrorResponse(res: Response, resObj: any, statusCode: number) {
        sendResponse(res, resObj, statusCode);
    }
}