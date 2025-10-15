import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { BaseRouter } from "./base-router";
import { BadRequestError, DetailedFood, GeneralConfirmationResponse, InventoryQuery, RequestContext } from "../../../shared/src/kinds";
import { getInventoryManager, foodActionManager } from "../managers/manager-factory";
import { preprocessor } from "../shared/preprocessing";


export class FoodRouter extends BaseRouter {
  async getFoodCategories(req: Request, res: Response) {
    try {
      const foodCategories = await getInventoryManager.getAllFoodCategories(new RequestContext(req));
      this.sendNormalResponse(res, foodCategories);
    } catch (error: any) {
      logger.log("getStoreInventory: failed", error)
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async saveFood(req: Request, res: Response) {
    const detailedFood = req.body as DetailedFood;
    try {
      const generalConfirmationResponse = await foodActionManager.saveFood(new RequestContext(req), detailedFood);
      this.sendNormalResponse(res, generalConfirmationResponse);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
        logger.log("saveFood: bad request error", error);
      } else {
        this.sendServerErrorResponse(res, { success: false, message: error.message });
        logger.log("saveFood: server error", error);
      }
    }
  }

  async getInventory(req: Request, res: Response) {
    try {
      const organizationID = req.params.organizationID as string;
      const inventoryQuery: InventoryQuery = req.body || new InventoryQuery();
      const detailedFoodList = await getInventoryManager.getInventory(new RequestContext(req), inventoryQuery, organizationID);
      this.sendNormalResponse(res, detailedFoodList);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getDetailedFoodByID(req: Request, res: Response) {
    try {
      const foodID = req.params.foodID as string;
      const detailedFood = await getInventoryManager.getDetailedFoodByID(new RequestContext(req), foodID);
      this.sendNormalResponse(res, detailedFood);
    } catch (error: any) {
      logger.log("getFoodByID: failed", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async deleteFood(req: Request, res: Response) {
    const foodID = req.params.foodID as string;
    try {
      foodActionManager.deleteFood(new RequestContext(req), foodID);
      const generalConfirmationResponse = new GeneralConfirmationResponse();
      generalConfirmationResponse.success = true;
      generalConfirmationResponse.message = "Food deleted successfully!";
      this.sendNormalResponse(res, generalConfirmationResponse);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
      } else {
        this.sendServerErrorResponse(res, { success: false, message: error.message });
      }
    }
  }

  async getInventorySummary(req: Request, res: Response) {
    try {
      const organizationID = req.params.organizationID as string;
      const inventorySummaryData = await getInventoryManager.getInventorySummary(new RequestContext(req), organizationID);
      this.sendNormalResponse(res, inventorySummaryData);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
      logger.log("saveFood: server error", error);
    }
  }

  static buildRouter() {
    const foodRouter = new FoodRouter();
    return express.Router()
      .get('/get-food-categories', preprocessor(), authenticator([]), foodRouter.getFoodCategories.bind(foodRouter))
      .post('/post-food', preprocessor(), authenticator([]), foodRouter.saveFood.bind(foodRouter))
      .post('/get-inventory/:organizationID', preprocessor(), foodRouter.getInventory.bind(foodRouter))
      .get('/get-detailed-food/:foodID', preprocessor(), authenticator([]), foodRouter.getDetailedFoodByID.bind(foodRouter))
      .delete('/delete-food/:foodID', preprocessor(), authenticator([]), foodRouter.deleteFood.bind(foodRouter))
      .get('/get-inventory-summary/:organizationID', preprocessor(), foodRouter.getInventorySummary.bind(foodRouter));
  }
}