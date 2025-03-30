import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { CharityLocation } from "../shared/kinds";
import { charityDAO, charityLocationDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";

export class CharityLocationRouter extends BaseRouter {
  async getRandomCharity() {
    const charities = await charityDAO.getAllCharities();
    const randomIdx = Math.floor(Math.random() * charities.length);
    return charities[randomIdx];
  }

  async addSampleLocation(req: Request, res: Response) {
    try {
      let location = new CharityLocation();
      location.charityID = (await this.getRandomCharity()).id;
      location.id = "27";
      location.state = "Georgia";
      location.city = "Alpharetta";
      location.streetName = "Milton Avenue";
      location.streetNumber = 123;

      location = await charityLocationDAO.saveLocation(location);
      logger.log("A new sample location added successfully! id=" + location.id);
      this.sendSuccessfulResponse(res, location);
    } catch (error: any) {
      logger.log("Failed to add a new sample location", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async saveLocation(req: Request, res: Response) {
    const charityLocation = req.body as CharityLocation;
    try {
      if (!charityLocation) {
        logger.log("Charity location entity is not provided");
        res.status(404).json({ success: false, message: "Charity location entity is not provided" });
        return;
      }
      if (charityLocation.id) {
        const existingCharityLocation = await charityLocationDAO.getCharityLocation(charityLocation.id);
        if (!existingCharityLocation) {
          res.status(404).json({ success: false, message: "No charity location with id " + charityLocation.id + " was found" });
          return;
        }
      }
      const id = await charityLocationDAO.saveLocation(charityLocation);
      logger.log("Charity location added successfully! id=" + id);
      this.sendSuccessfulResponse(res, charityLocation);
    } catch (error: any) {
      logger.log("Failed to add a charity location", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllLocations(req: Request, res: Response) {
    try {
      const locations = await charityLocationDAO.getAllLocations();
      logger.log("Successfully retrieved all charity locations!");
      this.sendSuccessfulResponse(res, locations);
    } catch (error: any) {
      logger.log("Failed to retrieve charity locations")
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getLocation(req: Request, res: Response) {
    try {
      const locationID = req.params.locationID as string;
      if (!locationID) {
        res.status(400).json({ success: false, message: "Missing location ID" });
        return;
      }
      const location = await charityLocationDAO.getCharityLocation(locationID);
      if (!location) {
        res.status(404).json({ success: false, message: "Location not found " + locationID });
        return;
      }
      this.sendSuccessfulResponse(res, location);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter() {
    const locationRouter = new CharityLocationRouter();
    return express.Router()
      .get('/add-sample-location', authenticator, locationRouter.addSampleLocation.bind(locationRouter))
      .post('/location', authenticator, locationRouter.saveLocation.bind(locationRouter))
      .get('/all', authenticator, locationRouter.getAllLocations.bind(locationRouter))
      .get('/location/:locationID', authenticator, locationRouter.getLocation.bind(locationRouter));
  }
}