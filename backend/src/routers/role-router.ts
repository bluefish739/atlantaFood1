import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Role } from "../../../shared/src/kinds";
import { roleDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";
import { preprocessor } from "../shared/preprocessing";

export class RoleRouter extends BaseRouter {
    async saveRole(req: Request, res: Response) {
        const role = req.body as Role;
        try {
            if (!role) {
                logger.log("Role entity is not provided");
                this.sendClientErrorResponse(res, { success: false, message: "Role entity is not provided" }, 404);
                return;
            }
            if (role.id) {
                const existingRole = await roleDAO.getRole(role.id);
                if (!existingRole) {
                    this.sendClientErrorResponse(res, { success: false, message: "No role with id " + role.id + " was found" }, 404);
                    return;
                }
            }
            role.organizationID = this.getCurrentOrganizationID(req);
            const id = await roleDAO.saveRole(role);
            logger.log("saveRole: role=", role)
            logger.log("Role saved successfully! id=" + id);
            this.sendNormalResponse(res, role);
        } catch (error: any) {
            logger.log("Failed to save a role", error);
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
    }

    async getRole(req: Request, res: Response) {
        try {
            const roleID = req.params.roleID as string;
            if (!roleID) {
                this.sendClientErrorResponse(res, { success: false, message: "Missing role ID" }, 400);
                return;
            }
            const role = await roleDAO.getRole(roleID);
            if (!role) {
                this.sendClientErrorResponse(res, { success: false, message: "Role not found " + roleID }, 404);
                return;
            }
            this.sendNormalResponse(res, role);
        } catch (error: any) {
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
    }

    async getAllUserRolesOfCurrentOrg(req: Request, res: Response) {
        try {
            const organizationID = this.getCurrentOrganizationID(req)!;
            const roles = await roleDAO.getUserRolesByOrgID(organizationID);
            this.sendNormalResponse(res, roles);
        } catch (error: any) {
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
    }

    static buildRouter() {
        const roleRouter = new RoleRouter();
        return express.Router()
            .post('/role', preprocessor(), authenticator([]), roleRouter.saveRole.bind(roleRouter))
            .get('/role/:roleID', preprocessor(), authenticator([]), roleRouter.getRole.bind(roleRouter))
            .get('/list-roles', preprocessor(), authenticator([]), roleRouter.getAllUserRolesOfCurrentOrg.bind(roleRouter));
    }
}