import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { foodDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";
import { BadRequestError, DetailedFood, GeneralConfirmationResponse, InventoryQuery, RequestContext } from "../../../shared/src/kinds";
import { deleteFoodManager, getInventoryManager, saveFoodManager } from "../managers/manager-factory";


export class FoodRouter extends BaseRouter {
  async getFoodCategories(req: Request, res: Response) {
    try {
      const foodCategories = await foodDAO.getAllFoodCategories();
      this.sendNormalResponse(res, foodCategories);
    } catch (error: any) {
      logger.log("getStoreInventory: failed", error)
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async saveFood(req: Request, res: Response) {
    const detailedFood = req.body as DetailedFood;
    try {
      await saveFoodManager.saveFood(new RequestContext(req), detailedFood);
      logger.log("saveFood: save food manager complete");
      const generalConfirmationResponse = new GeneralConfirmationResponse();
      generalConfirmationResponse.success = true;
      generalConfirmationResponse.message = "Food added successfully!";
      this.sendNormalResponse(res, generalConfirmationResponse);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
        logger.log("saveFood: bad request error", error);
      } else {
        this.sendServerErrorResponse(res, {success: false, message: error.message});
        logger.log("saveFood: server error", error);
      }
    }
  }

  private async getCategoriesByFoodID(foodID: string) {
    const categories = await Promise.all(
      (await foodDAO.getFoodCategoryAssociationsByFoodID(foodID))
        .map(async foodCategoryAssociation => { return foodCategoryAssociation.foodCategoryID! })
    );
    return categories;
  }

  async getInventory(req: Request, res: Response) {
    try {
      const inventoryQuery: InventoryQuery = req.body || new InventoryQuery();
      const detailedFoodList = await getInventoryManager.getInventory(new RequestContext(req), inventoryQuery);
      this.sendNormalResponse(res, detailedFoodList);
    } catch (error: any) {
      this.sendServerErrorResponse(res, {success: false, message: error.message});
    }
  }

  async getDetailedFoodByID(req: Request, res: Response) {
    try {
      const foodID = req.params.foodID as string;
      const detailedFood = new DetailedFood();
      detailedFood.food = await foodDAO.getFoodByID(foodID);
      detailedFood.categoryIDs = await this.getCategoriesByFoodID(foodID);
      this.sendNormalResponse(res, detailedFood);
    } catch (error: any) {
      logger.log("getFoodByID: failed", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async deleteFood(req: Request, res: Response) {
    const foodID = req.params.foodID as string;
    try {
      deleteFoodManager.deleteFood(new RequestContext(req), foodID);
      const generalConfirmationResponse = new GeneralConfirmationResponse();
      generalConfirmationResponse.success = true;
      generalConfirmationResponse.message = "Food deleted successfully!";
      this.sendNormalResponse(res, generalConfirmationResponse);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        this.sendBadRequestResponse(res, { success: false, message: error.message });
      } else {
        this.sendServerErrorResponse(res, {success: false, message: error.message});
      }
    }
  }

  static buildRouter() {
    const foodRouter = new FoodRouter();
    return express.Router()
      .get('/get-food-categories', authenticator([]), foodRouter.getFoodCategories.bind(foodRouter))
      .post('/post-food', authenticator([]), foodRouter.saveFood.bind(foodRouter))
      .post('/get-inventory', authenticator([]), foodRouter.getInventory.bind(foodRouter))
      .get('/get-detailed-food/:foodID', authenticator([]), foodRouter.getDetailedFoodByID.bind(foodRouter))
      .delete('/delete-food/:foodID', authenticator([]), foodRouter.deleteFood.bind(foodRouter));
  }
}