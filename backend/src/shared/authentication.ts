
import { Request, Response, NextFunction } from "express";
import admin from 'firebase-admin';
import { roleDAO, userDAO } from "../daos/dao-factory";
import { ADMIN_ROLE_NAME, User } from "../../../shared/src/kinds";
import { permissions } from "../../../shared/src/permissions";
import { sendResponse } from "../utility-functions";
import * as logger from "firebase-functions/logger";
import { employeeHelpers } from "./employee-helpers";

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
        const userRoles = await roleDAO.getUserRoles(user.userID!);
        for (let userRole of userRoles) {
            const role = await roleDAO.getRole(userRole.roleID!);
            if (role.name == ADMIN_ROLE_NAME) {
                userPermissions = new Set(permissions.map(permission => permission.name));
                // Admin role has all permissions, no point to continue
                break;
            }
            role.permissions.forEach(permission => {
                userPermissions.add(permission)
            });
        }

        requiredPermissionsList.forEach(permission => {
            if (!userPermissions.has(permission)) {
                sendResponse(res, { success: false, message: "Lacks permission" }, 401);
                return;
            }
        });

        const organizationID = await employeeHelpers.getOrganizationOfUser(user.userType!, user.userID!)
        logger.log("authenticator: made it to update req", user);
        logger.log("authenticator: made it to add organizationID", organizationID);
        (req as any).user = user;
        (req as any).organizationID = organizationID;
        next();
    }
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