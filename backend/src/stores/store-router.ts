import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Store } from "../shared/kinds";
import { StoreDAO } from "./store-dao";
import { StoreLocationDAO } from "../locations/location-dao";

const storeDAO = new StoreDAO();
const locationDAO = new StoreLocationDAO();

export const storeRouter = express.Router();

storeRouter.get('/add-sample-store', authenticator, async (req: Request, res: Response) => {
  try {
    let store = new Store();
    store.name = "Kroger";
    store.id = "27";
    store.contact = "123-456-8888";

    store = await storeDAO.saveStore(store);
    logger.log("A new sample store added successfully! id=" + store.id);
    res.status(200).json(store);
  } catch (error: any) {
    logger.log("Failed to add a new sample store", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

storeRouter.get('/all', authenticator, async (req: Request, res: Response) => {
  try {
    const stores = await storeDAO.getAllStores();
    const locations = await locationDAO.getAllLocations();
    for (let store of stores) {
      store.locations = locations.filter((location) => location.storeID == store.id);
    }
    res.status(200).json(stores);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});