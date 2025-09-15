import { BadRequestError, DetailedFood, Food, FoodCategoryAssociation, RequestContext, ServerError } from "../../../../shared/src/kinds";
import * as logger from "firebase-functions/logger";
import { generateId } from "../../shared/idutilities";
import { foodDAO } from "../../daos/dao-factory";
import { datastore } from "../../daos/data-store-factory";
import { FoodDAO } from "../../daos/food-dao";

export class SaveFoodManager {
    async saveFood(requestContext: RequestContext, detailedFood: DetailedFood) {
        const organizationID = requestContext.getCurrentOrganizationID()!;
        let foodBeingSaved: Food;
        try {
            const existingFood = await this.validateSaveFoodRequest(organizationID, detailedFood);
            foodBeingSaved = existingFood ? existingFood : new Food();
        } catch (error: any) {
            logger.log("saveFood: failed to validate detailedFood object ", detailedFood);
            throw new BadRequestError(error);
        }

        const food = detailedFood.food!;
        foodBeingSaved.name = food.name;
        foodBeingSaved.expirationDate = food.expirationDate;
        if (!foodBeingSaved.entryDate) {
            foodBeingSaved.entryDate = new Date();
        }
        foodBeingSaved.initialQuantity = food.initialQuantity;
        foodBeingSaved.currentQuantity = food.currentQuantity;
        foodBeingSaved.units = food.units;
        foodBeingSaved.organizationID = organizationID;
        if (!foodBeingSaved.id) {
            foodBeingSaved.id = generateId();
        }

        try {
            const oldFoodCategoryIDs = (await foodDAO.getFoodCategoryAssociationsByFoodID(foodBeingSaved.id!))
                .map(foodCategoryAssociation => foodCategoryAssociation.foodCategoryID!);
            const idsOfFoodCategoryAssociationsToDelete = oldFoodCategoryIDs.filter(foodCategoryID => !detailedFood.categoryIDs.includes(foodCategoryID!));
            const idsOfFoodCategoryAssociationsToSave = detailedFood.categoryIDs.filter(foodCategoryID => !oldFoodCategoryIDs.includes(foodCategoryID));
            this.saveFoodToDatabase(foodBeingSaved, idsOfFoodCategoryAssociationsToSave, idsOfFoodCategoryAssociationsToDelete);
        } catch (error: any) {
            logger.log("Failed to add a food", error);
            throw new ServerError(error.message);
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

        if (!food.expirationDate) {
            throw "No expiration date assigned";
        }

        if (!food.units) {
            throw "No units assigned";
        }

        if (food.id) {
            const existingFood = await foodDAO.getFoodByID(food.id);
            if (!existingFood) {
                throw "No food with id " + food.id + " was found";
            }

            if (food.organizationID != organizationID) {
                throw "Attempting to modify food not on organization";
            }
            return existingFood;
        }

        return null;
    }

    private async saveFoodToDatabase(food: Food, idsOfFoodCategoriestoSave: string[], idsOfFoodCategoriestoDelete: string[]) {
        const foodID = food.id!;
        const transaction = datastore.transaction();
        try {
            const foodKey = datastore.key([FoodDAO.FOOD_KIND, foodID]);
            const foodEntity = {
                key: foodKey,
                data: food
            };

            transaction.save(foodEntity);

            const foodCategoryEntities = idsOfFoodCategoriestoSave.map(foodCategoryID => {
                const foodCategoryAssociation = new FoodCategoryAssociation();
                foodCategoryAssociation.foodCategoryID = foodCategoryID;
                foodCategoryAssociation.foodID = food.id;
                const foodCategoryKey = datastore.key([FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND, food.id + "|" + foodCategoryID]);
                const foodCategoryAssociationEntity = {
                    key: foodCategoryKey,
                    data: foodCategoryAssociation
                };
                return foodCategoryAssociationEntity;
            });
            transaction.save(foodCategoryEntities);

            const keysOfFoodCategoryAssociationToDelete = idsOfFoodCategoriestoDelete
                .map(foodCategoryID => datastore.key([FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND, food.id + "|" + foodCategoryID]));
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
}