
import { Request, Response, NextFunction } from "express";
import admin from 'firebase-admin';
import { charityDAO, roleDAO, userDAO } from "../daos/dao-factory";
import { User } from "./kinds";
import { sendResponse } from "../utility-functions";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
export function authenticator(requiredPermissionsList: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        logger.log("authenticator: made it to authentication", req.headers);
        const authentication = req.headers.authentication as string;
        const user = await userDAO.getUserBySessionID(authentication) as User;
        if (!user) {
            sendResponse(res, { success: false, message: "Invalid session" }, 401);
            return;
        }

        let userPermissions = new Set();
        user.roles.forEach(async roleID => {
            const role = await roleDAO.getRole(roleID);
            role.permissions.forEach(permission => {
                userPermissions.add(permission)
            });
        });

        requiredPermissionsList.forEach(permission => {
            if (!userPermissions.has(permission)) {
                sendResponse(res, { success: false, message: "Lacks permission" }, 401);
                return;
            }
        });

        let organizationID: string | undefined;
        if (user.userType == "Store") {
            organizationID = await getOrganizationIDofStoreUser(user.userID!);
        } else if (user.userType == "Pantry") {
            organizationID = await getOrganizationIDofPantryUser(user.userID!);
        } else if (user.userType == "Volunteer") {
            organizationID = await getOrganizationIDofVolunteer(user.userID!);
        } else if (user.userType == "Admin") {
            organizationID = await getOrganizationIDofAdmin(user.userID!);
        } else {
            logger.log("User type is unknown:", user.userType);
            sendResponse(res, { success: false, message: "Lacks permission" }, 401);
            return;
        }

        logger.log("authenticator: made it to update req", user);
        logger.log("authenticator: made it to add organizationID", organizationID);
        (req as any).user = user;
        (req as any).organizationID = organizationID;
        next();
    }
}

async function getOrganizationIDofStoreUser(userID: string): Promise<string | undefined> {
    throw new Error("Function not implemented.");
}

async function getOrganizationIDofPantryUser(userID: string): Promise<string | undefined> {
    const employeeRecord = await charityDAO.getEmployeeRecordByUserID(userID);
    logger.log("getOrganizationIDofPantryUser: query user ID = " + userID, employeeRecord);
    return employeeRecord?.organizationID;
}

async function getOrganizationIDofVolunteer(userID: string): Promise<string | undefined> {
    throw new Error("Function not implemented.");
}

async function getOrganizationIDofAdmin(userID: string): Promise<string | undefined> {
    throw new Error("Function not implemented.");
}

/*
export const authenticator = async (req: Request, res: Response, next: NextFunction) => {
    logger.log("Verifying authentication token...");
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        logger.log('verifyIdToken faield: no authorization available');
        //res.status(401).json({ sucess: false, message: 'You are not authorized' });
        //return;
    } else {
        const idToken = authorization.split('Bearer ')[1];
        try {
            const decodedIdToken = await admin.auth().verifyIdToken(idToken);
            (req as any).user = decodedIdToken;
            logger.log('verifyIdToken succeeded', decodedIdToken);
        } catch (e: any) {
            logger.log('verifyIdToken faield', e);
            //res.status(401).json({ sucess: false, message: 'You are not authorized' });
            //return;
        }
    }

    next();
};
*/