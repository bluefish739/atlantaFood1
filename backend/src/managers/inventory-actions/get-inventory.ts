import { DetailedFood, Food, RequestContext } from "../../../../shared/src/kinds";
import { foodDAO } from "../../daos/dao-factory";
import * as logger from "firebase-functions/logger";

export class GetInventoryManager {
    async getInventory(requestContext: RequestContext, categoryIDs: string[]) {
        logger.log("getInventory: categoryIDs: ", categoryIDs);
        try {
            const organizationID = requestContext.getCurrentOrganizationID()!;
            const foods = await foodDAO.getFoodsByOrganizationID(organizationID);
            const detailedFoods = (await Promise.all(foods.map(async food => {
                const detailedFood = new DetailedFood();
                detailedFood.food = new Food();
                detailedFood.food.id = food.id;
                detailedFood.food.name = food.name;
                detailedFood.food.currentQuantity = food.currentQuantity;
                detailedFood.food.entryDate = food.entryDate;
                detailedFood.food.expirationDate = food.expirationDate;
                detailedFood.food.units = food.units;
                detailedFood.categoryIDs = await this.getCategoriesByFoodID(food.id!);

                return detailedFood;
            })));
            if (categoryIDs.length > 0) {
                return detailedFoods.filter(detailedFood => detailedFood.categoryIDs.some(categoryID => categoryIDs.includes(categoryID)));
            }
            return detailedFoods;
        } catch (error: any) {
            logger.log("getStoreInventory: failed", error);
            throw error;
        }
    }

    private async getCategoriesByFoodID(foodID: string) {
        const categories = await Promise.all(
          (await foodDAO.getFoodCategoryAssociationsByFoodID(foodID))
            .map(async foodCategoryAssociation => { return foodCategoryAssociation.foodCategoryID! })
        );
        return categories;
      }
}