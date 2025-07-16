
import { Request, Response, NextFunction } from "express";
import * as logger from "firebase-functions/logger";
import admin from 'firebase-admin';
import { roleDAO, userDAO } from "../daos/dao-factory";
import { User } from "./kinds";
import { sendResponse } from "../utility-functions";

admin.initializeApp();
export function securityCheckpoint(requiredPermissionsList: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
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
        const userData = JSON.stringify(user);
        req.params['user'] = userData;
        next();
    }
}
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