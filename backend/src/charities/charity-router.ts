import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Charity } from "../shared/kinds";
import { CharityLocationDAO } from "../locations/location-dao";
import { CharityDAO, datastore } from "./charity-dao";

const charityDAO = new CharityDAO();
const locationDAO = new CharityLocationDAO();

export const charityRouter = express.Router();

charityRouter.get("/add-sample-charity", authenticator, async (req: Request, res, Response) => {
    try {
        let charity = new Charity();
        charity.name = "Atlanta Community Food Bank";
        charity.id = "50";
        charity.contact = "444-555-6666";
        
        charity = await charityDAO.saveCharity(charity);
        logger.log(`A new sample charity has successfully been added! id: ${charity.id}`);
        res.status(200).json(charity);
    } catch (error: any) {
        logger.log(`Error: Sample charity couldn't be added! ${error}`);
        res.status(500).json({ success: false, message: error.message });
    }
});

charityRouter.get("/all", authenticator, async (req: Request, res: Response) => {
    try {
        const charities = await charityDAO.getAllCharities();
        const locations = await locationDAO.getAllLocations();
        for (let charity of charities) {
            charity.locations = locations.filter((location) => location.charityID == charity.id);
        }
        logger.log("Charities successfully fetched!");
        res.status(200).json(charities);
    } catch (error: any) {
        logger.log(`Error: charities could not be fetched! ${error}`);
        res.status(500).json({ success: false, message: error.message });
    }
});

charityRouter.get("/charity/:charityID", authenticator, async (req: Request, res: Response) => {
    try {
        const charityID = req.params.charityID as string;
        if (!charityID) {
            logger.log("No charity ID provided");
            res.status(400).json({ success: false, message: "No charity ID provided" });
            return;
        }
        const charity = await charityDAO.getCharity(charityID);
        if (!charity) {
            logger.log("No charity with id: " + charityID);
            res.status(400).json({ success: false, message: "No charity found with id: " + charityID });
        }
        res.status(200).json(charity);
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

charityRouter.post('/charity', authenticator, async (req: Request, res: Response) => {
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
    logger.log("Charity added successfully! id=" + id);
    res.status(200).json(charity);
  } catch (error: any) {
    logger.log("Failed to add a charity", error);
    res.status(500).json({ success: false, message: error.message });
  }
});