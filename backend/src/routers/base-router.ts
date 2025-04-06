import { Response } from "express";

export class BaseRouter {
    sendResponse(res: Response, resObj: any, statusCode: number) {
        res.status(statusCode).json(resObj);
    }

    sendSuccessfulResponse(res: Response, resObj: any) {
        this.sendResponse(res, resObj, 200);
    }

    sendServerErrorResponse(res: Response, resObj: any) {
        this.sendResponse(res, resObj, 500);
    }

    sendClientErrorResponse(res: Response, resObj: any, statusCode: number) {
        this.sendResponse(res, resObj, statusCode);
    }
}