import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Charity } from "../shared/kinds";
import { charityDAO, charityLocationDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";

export class CharityRouter extends BaseRouter {
  async addSampleCharity(req: Request, res: Response) {
    try {
      let charity = new Charity();
      charity.name = "Atlanta Community Food Bank";
      charity.id = "50";
      charity.contact = "444-555-6666";

      charity = await charityDAO.saveCharity(charity);
      logger.log(`A new sample charity has successfully been added! id: ${charity.id}`);
      BaseRouter.sendSuccessfulResponse(res, charity);
    } catch (error: any) {
      logger.log(`Error: Sample charity couldn't be added! ${error}`);
      BaseRouter.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllCharities(req: Request, res: Response) {
    try {
      const charities = await charityDAO.getAllCharities();
      const locations = await charityLocationDAO.getAllLocations();
      for (let charity of charities) {
        charity.locations = locations.filter((location) => location.charityID == charity.id);
      }
      logger.log("Charities successfully fetched!");
      BaseRouter.sendSuccessfulResponse(res, charities);
    } catch (error: any) {
      logger.log(`Error: charities could not be fetched! ${error}`);
      BaseRouter.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getCharity(req: Request, res: Response) {
    try {
      const charityID = req.params.charityID as string;
      if (!charityID) {
        logger.log("No charity ID provided");
        BaseRouter.sendClientErrorResponse(res, { success: false, message: "No charity ID provided" });
        return;
      }
      const charity = await charityDAO.getCharity(charityID);
      if (!charity) {
        logger.log("No charity with id: " + charityID);
        BaseRouter.sendClientErrorResponse(res, { success: false, message: "No charity found with id: " + charityID });
      }
      BaseRouter.sendSuccessfulResponse(res, charity);
    } catch (error: any) {
      BaseRouter.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async saveCharity(req: Request, res: Response) {
    const charity = req.body as Charity;
    try {
      if (!charity) {
        logger.log("Charity entity is not provided");
        res.status(404).json({ success: false, message: "Charity entity is not provided" });
        return;
      }
      if (charity.id) {
        const existingCharity = await charityDAO.getCharity(charity.id);
        if (!existingCharity) {
          res.status(404).json({ success: false, message: "No charity with id " + charity.id + " was found" });
          return;
        }
      }
      const id = await charityDAO.saveCharity(charity);
      logger.log("Charity saved successfully! id=" + id);
      BaseRouter.sendSuccessfulResponse(res, charity);
    } catch (error: any) {
      logger.log("Failed to save a charity", error);
      BaseRouter.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter() {
    const charityRouter = new CharityRouter();
    return express.Router()
      .get("/add-sample-charity", authenticator, charityRouter.addSampleCharity.bind(charityRouter))
      .get("/all", authenticator, charityRouter.getAllCharities.bind(charityRouter))
      .get("/charity/:charityID", authenticator, charityRouter.getCharity.bind(charityRouter))
      .post('/charity', authenticator, charityRouter.saveCharity.bind(charityRouter));
  }
}