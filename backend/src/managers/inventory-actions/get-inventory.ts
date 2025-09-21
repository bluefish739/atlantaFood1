import { DetailedFood, Food, RequestContext } from "../../../../shared/src/kinds";
import { foodDAO } from "../../daos/dao-factory";
import * as logger from "firebase-functions/logger";

export class GetInventoryManager {
    async getInventory(requestContext: RequestContext, categoryIDs: string[]) {
        logger.log("getInventory: categoryIDs: ", categoryIDs);
        try {
            const organizationID = requestContext.getCurrentOrganizationID()!;
            const foods = await foodDAO.getFoodsByOrganizationID(organizationID);
            const detailedFoodList = await Promise.all(foods.map(async food => {
                const detailedFood = new DetailedFood();
                detailedFood.food = new Food();
                detailedFood.food.id = food.id;
                detailedFood.food.name = food.name;
                detailedFood.food.currentQuantity = food.currentQuantity;
                detailedFood.food.entryDate = food.entryDate;
                detailedFood.food.expirationDate = food.expirationDate;
                detailedFood.food.units = food.units;

                return detailedFood;
            }));
            return detailedFoodList;
        } catch (error: any) {
            logger.log("getStoreInventory: failed", error);
            throw error;
        }
    }
}