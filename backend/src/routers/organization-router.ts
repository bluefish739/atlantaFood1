import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Organization } from "../../../shared/src/kinds";
import { organizationDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";
import { preprocessor } from "../shared/preprocessing";

export class OrganizationRouter extends BaseRouter {
  async addSampleOrganization(req: Request, res: Response) {
    try {
      let organization = new Organization();
      organization.name = "Atlanta Community Food Bank";
      organization.id = "50";
      organization.contact = "444-555-6666";

      organization = await organizationDAO.saveOrganization(organization);
      logger.log(`A new sample organization has successfully been added! id: ${organization.id}`);
      this.sendNormalResponse(res, organization);
    } catch (error: any) {
      logger.log(`Error: Sample organization couldn't be added! ${error}`);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllOrganizations(req: Request, res: Response) {
    try {
      const organizations = await organizationDAO.getAllOrganizations();
      this.sendNormalResponse(res, organizations);
    } catch (error: any) {
      logger.log(`Error: organizations could not be fetched! ${error}`);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getOrganization(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      if (!id) {
        this.sendClientErrorResponse(res, { success: false, message: "No ID provided" }, 400);
        return;
      }
      const organization = await organizationDAO.getOrganization(id);
      if (!organization) {
        logger.log("No organization with id: " + id);
        this.sendClientErrorResponse(res, { success: false, message: "No organization found with id: " + id }, 400);
      }
      this.sendNormalResponse(res, organization);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async saveOrganization(req: Request, res: Response) {
    const organization = req.body as Organization;
    try {
      if (!organization) {
        logger.log("Organization entity is not provided");
        this.sendClientErrorResponse(res, { success: false, message: "Organization entity is not provided" }, 404);
        return;
      }
      if (organization.id) {
        const existingOrganization = await organizationDAO.getOrganization(organization.id);
        if (!existingOrganization) {
          this.sendClientErrorResponse(res, { success: false, message: "No organization with id " + organization.id + " was found" }, 404);
          return;
        }
      }
      const id = await organizationDAO.saveOrganization(organization);
      logger.log("Organization saved successfully! id=" + id);
      this.sendNormalResponse(res, organization);
    } catch (error: any) {
      logger.log("Failed to save a organization", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter() {
    const organizationRouter = new OrganizationRouter();
    return express.Router()
      .get("/add-sample-organization", preprocessor(), authenticator([]), organizationRouter.addSampleOrganization.bind(organizationRouter))
      .get("/all", preprocessor(), organizationRouter.getAllOrganizations.bind(organizationRouter))
      .get("/organization/:id", preprocessor(), authenticator([]), organizationRouter.getOrganization.bind(organizationRouter))
      .post('/organization', preprocessor(), authenticator([]), organizationRouter.saveOrganization.bind(organizationRouter));
  }
}