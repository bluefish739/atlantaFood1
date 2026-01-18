
import { Response } from "express";
import { userDAO } from "./daos/dao-factory";

export function sendResponse(res: Response, resObj: any, statusCode: number) {
    res.status(statusCode).json(resObj);
}

export async function checkDuplicatedUsername(username: string) {
    return await userDAO.usernameTaken(username);
}

export function getIdentifier(id1: string, id2: string) {
    return [id1, id2].sort().join("|");
}

export function alphabeticalCompare(str1: string, str2: string): boolean {
    return str1 < str2;
}