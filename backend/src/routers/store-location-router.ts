import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { StoreLocation } from "../shared/kinds";
import { storeDAO, storeLocationDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";

export class StoreLocationRouter extends BaseRouter {
  async getRandomStore() {
    const stores = await storeDAO.getAllStores();
    const randomIdx = Math.floor(Math.random() * stores.length);
    return stores[randomIdx];
  }

  async addSampleLocation(req: Request, res: Response) {
    try {
      let location = new StoreLocation();
      location.storeID = (await this.getRandomStore()).id;
      location.id = "27";
      location.state = "Georgia";
      location.city = "Alpharetta";
      location.streetName = "Milton Avenue";
      location.streetNumber = 123;

      location = await storeLocationDAO.saveLocation(location);
      logger.log("A new sample location added successfully! id=" + location.id);
      this.sendSuccessfulResponse(res, location);
    } catch (error: any) {
      logger.log("Failed to add a new sample location", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async saveLocation(req: Request, res: Response) {
    const storeLocation = req.body as StoreLocation;
    try {
      if (!storeLocation) {
        logger.log("Store location entity is not provided");
        this.sendClientErrorResponse(res, { success: false, message: "Store location entity is not provided" }, 404);
        return;
      }
      if (storeLocation.id) {
        const existingStoreLocation = await storeLocationDAO.getStoreLocation(storeLocation.id);
        if (!existingStoreLocation) {
          this.sendClientErrorResponse(res, { success: false, message: "No store location with id " + storeLocation.id + " was found" }, 404);
          return;
        }
      }
      const id = await storeLocationDAO.saveLocation(storeLocation);
      logger.log("Store location added successfully! id=" + id);
      this.sendSuccessfulResponse(res, storeLocation);
    } catch (error: any) {
      logger.log("Failed to add a store location", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllLocations(req: Request, res: Response) {
    try {
      const locations = await storeLocationDAO.getAllLocations();
      logger.log("Successfully retrieved all store locations!");
      this.sendSuccessfulResponse(res, locations);
    } catch (error: any) {
      logger.log("Failed to retrieve store locations")
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getLocation(req: Request, res: Response) {
    try {
      const locationID = req.params.locationID as string;
      if (!locationID) {
        this.sendClientErrorResponse(res, { success: false, message: "Missing location ID" }, 400);
        return;
      }
      const location = await storeLocationDAO.getStoreLocation(locationID);
      if (!location) {
        this.sendClientErrorResponse(res, { success: false, message: "Location not found " + locationID }, 404);
        return;
      }
      this.sendSuccessfulResponse(res, location);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter() {
    const locationRouter = new StoreLocationRouter();
    return express.Router()
      .get('/add-sample-location', authenticator, locationRouter.addSampleLocation.bind(locationRouter))
      .post('/location', authenticator, locationRouter.saveLocation.bind(locationRouter))
      .get('/all', authenticator, locationRouter.getAllLocations.bind(locationRouter))
      .get('/location/:locationID', authenticator, locationRouter.getLocation.bind(locationRouter));
  }
}