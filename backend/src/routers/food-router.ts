import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { foodDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";
import { DetailedFood, Food, FoodCategoryAssociation, GeneralConfirmationResponse } from "../../../shared/src/kinds";
import { generateId } from "../shared/idutilities";
import { datastore } from "../daos/data-store-factory";
import { FoodDAO } from "../daos/food-dao";

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
    const organizationID = this.getCurrentOrganizationID(req)!;
    let foodBeingSaved: Food;
    try {
      const existingFood = await this.validateSaveFoodRequest(organizationID, detailedFood);
      foodBeingSaved = existingFood ? existingFood : new Food();
    } catch (error: any) {
      logger.log("saveFood: failed to validate detailedFood object ", detailedFood);
      this.sendBadRequestResponse(res, { success: false, message: error });
      return;
    }

    const food = detailedFood.food!;
    foodBeingSaved.name = food.name;
    // TODO: remove temporary fix for expirationDate type
    foodBeingSaved.expirationDate = new Date();
    if (!foodBeingSaved.entryDate) {
      foodBeingSaved.entryDate = new Date();
    }
    foodBeingSaved.initialQuantity = food.initialQuantity;
    foodBeingSaved.currentQuantity = food.currentQuantity;
    foodBeingSaved.organizationID = organizationID;
    if (!foodBeingSaved.foodID) {
      foodBeingSaved.foodID = generateId();
    }

    try {
      const oldFoodCategoryIDs = (await foodDAO.getFoodCategoryAssociationsByFoodID(foodBeingSaved.foodID!))
        .map(foodCategoryAssociation => foodCategoryAssociation.foodCategoryID!);
      const idsOfFoodCategoryAssociationsToDelete = oldFoodCategoryIDs.filter(foodCategoryID => !detailedFood.categoryIDs.includes(foodCategoryID!));
      const idsOfFoodCategoryAssociationsToSave = detailedFood.categoryIDs.filter(foodCategoryID => !oldFoodCategoryIDs.includes(foodCategoryID));
      this.saveFoodToDatabase(foodBeingSaved, idsOfFoodCategoryAssociationsToSave, idsOfFoodCategoryAssociationsToDelete);

      const generalConfirmationResponse = new GeneralConfirmationResponse();
      generalConfirmationResponse.success = true;
      generalConfirmationResponse.message = "Food added successfully!";
      this.sendNormalResponse(res, generalConfirmationResponse);
    } catch (error: any) {
      logger.log("Failed to add a food", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  private async validateSaveFoodRequest(organizationID: string, detailedFood: any) {
    const food: Food | undefined = detailedFood.food;
    if (!food) {
      logger.log("Food entity is not provided");
      throw "Food entity is not provided";
    }
    
    for (let newFoodCategoryID of detailedFood.categoryIDs) {
      const newFoodCategory = await foodDAO.getFoodCategoryByID(newFoodCategoryID);
      if (!newFoodCategory) {
        logger.log("validateSaveFoodRequest: newFoodCategory does not exist, newFoodCategoryID=" + newFoodCategoryID);
        throw "Attempting to assign nonexistent category";
      }
    }
 
    if (food.foodID) {
      const existingFood = await foodDAO.getFoodByID(food.foodID);
      if (!existingFood) {
        throw "No food with id " + food.foodID + " was found";
      }
      
      if (food.organizationID != organizationID) {
        throw "Attempting to modify food not on organization";
      }
      return existingFood;
    }

    return null;
  }

  private async saveFoodToDatabase(food: Food, idsOfFoodCategoriestoSave: string[], idsOfFoodCategoriestoDelete: string[]) {
    const foodID = food.foodID!;
    const transaction = datastore.transaction();
    try {
      const foodKey = datastore.key([FoodDAO.FOOD_KIND, foodID]);
      const foodEntity = {
        key: foodKey,
        data: food
      };
      //logger.log("saveFoodToDatabase: foodEntity=", foodEntity);

      transaction.save(foodEntity);

      const foodCategoryEntities = idsOfFoodCategoriestoSave.map(foodCategoryID => {
        const foodCategoryAssociation = new FoodCategoryAssociation();
        foodCategoryAssociation.foodCategoryID = foodCategoryID;
        foodCategoryAssociation.foodID = food.foodID;
        const foodCategoryKey = datastore.key([FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND, food.foodID + "|" + foodCategoryID]);
        const foodCategoryAssociationEntity = {
          key: foodCategoryKey,
          data: foodCategoryAssociation
        };
        return foodCategoryAssociationEntity;
      });
      transaction.save(foodCategoryEntities);

      const keysOfFoodCategoryAssociationToDelete = idsOfFoodCategoriestoDelete
        .map(foodCategoryID => datastore.key([FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND, food.foodID + "|" + foodCategoryID]));
      await transaction.run();
      transaction.delete(keysOfFoodCategoryAssociationToDelete);
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.log('saveFood: Transaction failed ', error);
      return false;
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
      const organizationID = this.getCurrentOrganizationID(req)!;
      const foodData = await foodDAO.getFoodByOrganizationID(organizationID);
      const foodValueObjects = await Promise.all(foodData.map(async food => {
        const detailedFood = new DetailedFood();
        detailedFood.food = new Food();
        detailedFood.food.foodID = food.foodID;
        detailedFood.food.name = food.name;
        detailedFood.food.currentQuantity = food.currentQuantity;
        detailedFood.food.entryDate = food.entryDate;
        detailedFood.categoryIDs = await this.getCategoriesByFoodID(detailedFood.food.foodID!);
      
        return detailedFood;
      }));
      this.sendNormalResponse(res, foodValueObjects);
    } catch (error: any) {
      logger.log("getStoreInventory: failed", error)
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter() {
    const foodRouter = new FoodRouter();
    return express.Router()
      .get('/get-food-categories', authenticator([]), foodRouter.getFoodCategories.bind(foodRouter))
      .post('/post-food', authenticator([]), foodRouter.saveFood.bind(foodRouter))
      .get('/get-inventory', authenticator([]), foodRouter.getInventory.bind(foodRouter));
  }
}