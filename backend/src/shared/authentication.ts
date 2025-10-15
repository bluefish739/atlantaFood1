
import { Request, Response, NextFunction } from "express";
import admin from 'firebase-admin';
import { roleDAO } from "../daos/dao-factory";
import { ADMIN_ROLE_NAME, User } from "../../../shared/src/kinds";
import { permissions } from "../../../shared/src/permissions";
import { sendResponse } from "../utility-functions";
//import * as logger from "firebase-functions/logger";

admin.initializeApp();
export function authenticator(requiredPermissionsList: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as User;
        let userPermissions = new Set();
        const userRoles = await roleDAO.getUserRolesByUserID(user.userID!);
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
        
        next();
    }
}