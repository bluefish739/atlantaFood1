import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { StoreLocation } from "../shared/kinds";
import { StoreLocationDAO } from "./location-dao";
import { StoreDAO } from "../stores/store-dao";

const locationDAO = new StoreLocationDAO();
const storeDAO = new StoreDAO();
export const locationRouter = express.Router();

async function getRandomStore() {
  const stores = await storeDAO.getAllStores();
  const randomIdx = Math.floor(Math.random() * stores.length);
  return stores[randomIdx];
}

locationRouter.get('/add-sample-location', authenticator, async (req: Request, res: Response) => {
  try {
    let location = new StoreLocation();
    location.storeID = (await getRandomStore()).id;
    location.id = "27";
    location.state = "Georgia";
    location.city = "Alpharetta";
    location.streetName = "Milton Avenue";
    location.streetNumber = 123;

    location = await locationDAO.addLocation(location);
    logger.log("A new sample location added successfully! id=" + location.id);
    res.status(200).json(location);
  } catch (error: any) {
    logger.log("Failed to add a new sample location", error);
    res.status(500).json({ success: false, message: error.message });
  }
});