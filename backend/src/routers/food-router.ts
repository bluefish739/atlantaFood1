import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { BaseRouter } from "./base-router";
import { BadRequestError, DetailedFood, GeneralConfirmationResponse, InventoryQuery, RequestContext } from "../../../shared/src/kinds";
import { getInventoryManager, foodActionManager, getCategorySummariesManager } from "../managers/manager-factory";
import { getAllFoodCategories } from "../shared/utilities";


export class FoodRouter extends BaseRouter {
  async getFoodCategories(req: Request, res: Response) {
    try {
      const foodCategories = getAllFoodCategories();
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
    }
  }

  async getCategorySummaries(req: Request, res: Response) {
    try {
      const categorySummaries = await getCategorySummariesManager.getCategorySummaries(new RequestContext(req));
      this.sendNormalResponse(res, categorySummaries);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter() {
    const foodRouter = new FoodRouter();
    return express.Router()
      .get('/get-food-categories', foodRouter.getFoodCategories.bind(foodRouter))
      .post('/post-food', authenticator([]), foodRouter.saveFood.bind(foodRouter))
      .post('/get-inventory/:organizationID', foodRouter.getInventory.bind(foodRouter))
      .get('/get-detailed-food/:foodID', authenticator([]), foodRouter.getDetailedFoodByID.bind(foodRouter))
      .delete('/delete-food/:foodID', authenticator([]), foodRouter.deleteFood.bind(foodRouter))
      .get('/get-inventory-summary/:organizationID', foodRouter.getInventorySummary.bind(foodRouter))
      .get('/get-category-summaries', foodRouter.getCategorySummaries.bind(foodRouter));
  }
}