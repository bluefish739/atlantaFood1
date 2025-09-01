
import { Response } from "express";

export function sendResponse(res: Response, resObj: any, statusCode: number) {
    res.status(statusCode).json(resObj);
}

export function toDate(dateString: string | Date | undefined) {
    if (!dateString) {
        return undefined;
    }
    if (dateString instanceof Date) {
        return dateString;
    }
    return new Date(dateString);
}