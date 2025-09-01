
import { Response } from "express";

export function sendResponse(res: Response, resObj: any, statusCode: number) {
    res.status(statusCode).json(resObj);
}