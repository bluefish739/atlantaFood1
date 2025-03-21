import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { StoreLocation } from "../shared/kinds";
import { storeDAO, storeLocationDAO } from "../daos/dao-factory";

async function getRandomStore() {
  const stores = await storeDAO.getAllStores();
  const randomIdx = Math.floor(Math.random() * stores.length);
  return stores[randomIdx];
}

async function addSampleLocation(req: Request, res: Response) {
  try {
    let location = new StoreLocation();
    location.storeID = (await getRandomStore()).id;
    location.id = "27";
    location.state = "Georgia";
    location.city = "Alpharetta";
    location.streetName = "Milton Avenue";
    location.streetNumber = 123;

    location = await storeLocationDAO.saveLocation(location);
    logger.log("A new sample location added successfully! id=" + location.id);
    res.status(200).json(location);
  } catch (error: any) {
    logger.log("Failed to add a new sample location", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function saveLocation(req: Request, res: Response) {
  const storeLocation = req.body as StoreLocation;
  try {
    if (!storeLocation) {
      logger.log("Store location entity is not provided");
      res.status(404).json({ success: false, message: "Store location entity is not provided" });
      return;
    }
    if (storeLocation.id) {
      const existingStoreLocation = await storeLocationDAO.getStoreLocation(storeLocation.id);
      if (!existingStoreLocation) {
        res.status(404).json({ success: false, message: "No store location with id " + storeLocation.id + " was found" });
        return;
      }
    }
    const id = await storeLocationDAO.saveLocation(storeLocation);
    logger.log("Store location added successfully! id=" + id);
    res.status(200).json(storeLocation);
  } catch (error: any) {
    logger.log("Failed to add a store location", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getAllLocations(req: Request, res: Response) {
  try {
    const locations = await storeLocationDAO.getAllLocations();
    logger.log("Successfully retrieved all store locations!");
    res.status(200).json(locations);
  } catch (error: any) {
    logger.log("Failed to retrieve store locations")
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getLocation(req: Request, res: Response) {
  try {
    const locationID = req.params.locationID as string;
    if (!locationID) {
      res.status(400).json({ success: false, message: "Missing location ID" });
      return;
    }
    const location = await storeLocationDAO.getStoreLocation(locationID);
    if (!location) {
      res.status(404).json({ success: false, message: "Location not found " + locationID });
      return;
    }
    res.status(200).json(location);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const locationRouter = express.Router();
locationRouter.get('/add-sample-location', authenticator, addSampleLocation);
locationRouter.post('/location', authenticator, saveLocation);
locationRouter.get('/all', authenticator, getAllLocations);
locationRouter.get('/location/:locationID', authenticator, getLocation);