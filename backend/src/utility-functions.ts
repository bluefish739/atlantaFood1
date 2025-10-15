
import { Response } from "express";
import { userDAO } from "./daos/dao-factory";

export function sendResponse(res: Response, resObj: any, statusCode: number) {
    res.status(statusCode).json(resObj);
}

export async function checkDuplicatedUsername(username: string) {
    return await userDAO.usernameTaken(username);
}