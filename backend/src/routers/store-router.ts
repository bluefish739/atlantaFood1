import express, { Request, Response, Router } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { InventoryEntry, Store } from "../../../shared/src/kinds";
import { storeLocationDAO, storeDAO, foodDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";

export class StoreRouter extends BaseRouter {
  async addSampleStore(req: Request, res: Response) {
    try {
      let store = new Store();
      store.name = "Kroger";
      store.id = "27";
      store.contact = "123-456-8888";

      store = await storeDAO.saveStore(store);
      logger.log("A new sample store added successfully! id=" + store.id);
      this.sendNormalResponse(res, store);
    } catch (error: any) {
      logger.log("Failed to add a new sample store", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllStores(req: Request, res: Response) {
    try {
      const stores = await storeDAO.getAllStores();
      const locations = await storeLocationDAO.getAllLocations();
      for (let store of stores) {
        store.locations = locations.filter((location) => location.storeID == store.id);
      }
      this.sendNormalResponse(res, stores);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getStore(req: Request, res: Response) {
    try {
      const storeId = req.params.storeId as string;
      if (!storeId) {
        this.sendClientErrorResponse(res, { success: false, message: "Missing store ID" }, 400);
        return;
      }
      const store = await storeDAO.getStore(storeId);
      if (!store) {
        this.sendClientErrorResponse(res, { success: false, message: "Store not found " + storeId }, 404);
        return;
      }
      this.sendNormalResponse(res, store);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async addStore(req: Request, res: Response) {
    const store = req.body as Store;
    try {
      if (!store) {
        logger.log("Store entity is not provided");
        this.sendClientErrorResponse(res, { success: false, message: "Store entity is not provided" }, 404);
        return;
      }
      if (store.id) {
        const existingStore = await storeDAO.getStore(store.id);
        if (!existingStore) {
          this.sendClientErrorResponse(res, { success: false, message: "No store with id " + store.id + " was found" }, 404);
          return;
        }
      }
      const id = await storeDAO.saveStore(store);
      logger.log("Store added successfully! id=" + id);
      this.sendNormalResponse(res, store);
    } catch (error: any) {
      logger.log("Failed to add a store", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getStoreLocations(req: Request, res: Response) {
    const storeID = req.params.storeID as string;
    logger.log(`getStoreLocations storeID as: ` + storeID);
    try {
      const locations = await storeLocationDAO.getStoreLocationsByStoreID(storeID);
      logger.log("Successfully retrieved all store locations!");
      this.sendNormalResponse(res, locations);
    } catch (error: any) {
      logger.log("Failed to retrieve store locations", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  private async getCategoriesByFoodID(foodID: string) {
    const categories = await Promise.all(
      (await foodDAO.getFoodCategoryAssociationsByFoodID(foodID)).map(async foodCategoryAssociation => {
        const foodCategoryID = foodCategoryAssociation.foodCategoryID!;
        const foodCategory = await foodDAO.getFoodCategoryByID(foodCategoryID);
        return foodCategory.name!;
      })
    );
    return categories;
  }

  async getStoreInventory(req: Request, res: Response) {
    try {
      logger.log("getStoreInventory: beginning");
      const organizationID = this.getCurrentOrganizationID(req)!;
      const foodData = await foodDAO.getFoodByOrganizationID(organizationID);
      const foodValueObjects = foodData.map(async food => {
        const inventoryEntry = new InventoryEntry();
        inventoryEntry.foodID = food.foodID;
        inventoryEntry.name = food.name;
        inventoryEntry.currentQuantity = food.currentQuantity;
        inventoryEntry.entryDate = food.entryDate;
        inventoryEntry.categories = await this.getCategoriesByFoodID(inventoryEntry.foodID!);

        return inventoryEntry;
      });
      logger.log("getStoreInventory: foodValueObjects=", foodValueObjects);
      this.sendNormalResponse(res, foodValueObjects);
    } catch (error: any) {
      logger.log("getStoreInventory: failed", error)
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter(): Router {
    const storeRouter = new StoreRouter();
    return express.Router()
      .get('/add-sample-store', authenticator([]), storeRouter.addSampleStore.bind(storeRouter))
      .get('/all', authenticator([]), storeRouter.getAllStores.bind(storeRouter))
      .get('/store/:storeId', authenticator([]), storeRouter.getStore.bind(storeRouter))
      .get('/:storeID/locations', authenticator([]), storeRouter.getStoreLocations.bind(storeRouter))
      .post('/store', authenticator([]), storeRouter.addStore.bind(storeRouter))
      .get('/get-store-inventory', authenticator([]), storeRouter.getStoreInventory.bind(storeRouter));
  }
}