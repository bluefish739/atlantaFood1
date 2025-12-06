import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { BadRequestError, Organization, RequestContext } from "../../../shared/src/kinds";
import { organizationDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";
import { organizationInfoManager } from "../managers/manager-factory";

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

  async getOrganizationDetails(req: Request, res: Response) {
    try {
      const organization = await organizationInfoManager.getOrganizationDetails(new RequestContext(req));
      this.sendNormalResponse(res, organization);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
      } else {
        this.sendServerErrorResponse(res, { success: false, message: error.message });
      }
    }
  }

  async saveOrganization(req: Request, res: Response) {
    const organization = req.body as Organization;
    try {
      const savedOrganization = await organizationInfoManager.saveOrganization(new RequestContext(req), organization);
      this.sendNormalResponse(res, savedOrganization);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
      } else {
        this.sendServerErrorResponse(res, { success: false, message: error.message });
      }
    }
  }

  async getCurrentOrganization(req: Request, res: Response) {
    try {
      const currentOrganizationID = await organizationInfoManager.getCurrentOrganizationID(new RequestContext(req));
      this.sendNormalResponse(res, currentOrganizationID);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
      } else {
        this.sendServerErrorResponse(res, { success: false, message: error.message });
      }
    }
  }

  async searchSitesByCategories(req: Request, res: Response) {
    try {
      const organizations = await organizationInfoManager.searchSitesByCategories(new RequestContext(req), req.body);
      this.sendNormalResponse(res, organizations);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
      } else {
        this.sendServerErrorResponse(res, { success: false, message: error.message });
      }
    }
  }

  static buildRouter() {
    const organizationRouter = new OrganizationRouter();
    return express.Router()
      .get("/add-sample-organization", authenticator([]), organizationRouter.addSampleOrganization.bind(organizationRouter))
      .get("/all", organizationRouter.getAllOrganizations.bind(organizationRouter))
      .get("/organization-details", authenticator([]), organizationRouter.getOrganizationDetails.bind(organizationRouter))
      .post('/organization', authenticator([]), organizationRouter.saveOrganization.bind(organizationRouter))
      .get("/get-current-organization-id", authenticator([]), organizationRouter.getCurrentOrganization.bind(organizationRouter))
      .post("/search-sites-by-categories", organizationRouter.searchSitesByCategories.bind(organizationRouter));
  }
}