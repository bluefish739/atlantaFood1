import { Response } from "express";
//import * as logger from "firebase-functions/logger";

export class BaseRouter {
    static sendResponse(res: Response, resObj: any, statusCode: number) {
        res.status(statusCode).json(resObj);
    }

    static sendSuccessfulResponse(res: Response, resObj: any) {
        BaseRouter.sendResponse(res, resObj, 200);
    }

    static sendServerErrorResponse(res: Response, resObj: any) {
        BaseRouter.sendResponse(res, resObj, 500);
    }

    static sendClientErrorResponse(res: Response, resObj: any) {
        BaseRouter.sendResponse(res, resObj, 400);
    }
}