import { Request, Response, NextFunction } from "express";
import { userDAO } from "../daos/dao-factory";
import { User } from "../../../shared/src/kinds";
//import * as logger from "firebase-functions/logger";
import { employeeHelpers } from "./employee-helpers";

export function preprocessor() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authentication = req.headers.authentication as string;
        const user = await userDAO.getUserBySessionID(authentication) as User;
        if (!user) {
            next();
        } else {
            const organizationID = await employeeHelpers.getOrganizationOfUser(user.userType!, user.userID!);
            (req as any).user = user;
            (req as any).organizationID = organizationID;
            next();
        }
    }
}