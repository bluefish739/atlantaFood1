import { BadRequestError, CategoryCount, DetailedFood, Food, FoodCategoryAssociation, GeneralConfirmationResponse, InventorySummary, RequestContext, ServerError } from "../../../../shared/src/kinds";
import * as logger from "firebase-functions/logger";
import { generateId } from "../../shared/idutilities";
import { foodDAO } from "../../daos/dao-factory";
import { datastore } from "../../daos/data-store-factory";
import { FoodDAO } from "../../daos/food-dao";
import { getAllFoodCategories } from "../../shared/utilities";

export class FoodActionManager {
    async saveFood(requestContext: RequestContext, detailedFood: DetailedFood) {
        const organizationID = requestContext.getCurrentOrganizationID()!;
        let foodBeingSaved: Food;
        let previousQuantity = 0;
        try {
            const existingFood = await this.validateSaveFoodRequest(organizationID, detailedFood);
            foodBeingSaved = existingFood ? existingFood : new Food();
            previousQuantity = existingFood ? (existingFood.currentQuantity || 0) : 0;
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
            this.saveFoodToDatabase(foodBeingSaved, previousQuantity, idsOfFoodCategoryAssociationsToSave, idsOfFoodCategoryAssociationsToDelete);

            const generalConfirmationResponse = new GeneralConfirmationResponse();
            generalConfirmationResponse.success = true;
            generalConfirmationResponse.message = "Food added successfully!";
            return generalConfirmationResponse;
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

    private async saveFoodToDatabase(food: Food, previousQuantity: number, idsOfFoodCategoriestoSave: string[], idsOfFoodCategoriestoDelete: string[]) {
        const foodID = food.id!;
        const transaction = datastore.transaction();
        try {
            const foodKey = datastore.key([FoodDAO.FOOD_KIND, foodID]);
            const foodEntity = {
                key: foodKey,
                data: food
            };

            // Save food itself
            transaction.save(foodEntity);
            
            // Save new food category associations
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
            
            let inventorySummary = await foodDAO.getInventorySummaryByOrganizationID(food.organizationID!); // Get existing or create new
            if (!inventorySummary) inventorySummary = new InventorySummary();

            const categories = await getAllFoodCategories();
            const prevFoodCategories = (await foodDAO.getFoodCategoryAssociationsByFoodID(foodID)).map(assoc => assoc.foodCategoryID!);
            categories.forEach(category => {
                // Get existing category count in inventory summary or create new
                let existingCategoryCount = inventorySummary.categoryCounts.find(c => c.categoryID === category.id);
                if (!existingCategoryCount) {
                    const categoryCount = new CategoryCount();
                    categoryCount.categoryID = category.id;
                    categoryCount.quantity = 0;
                    inventorySummary.categoryCounts.push(categoryCount);
                    existingCategoryCount = categoryCount;
                }

                if (idsOfFoodCategoriestoDelete.includes(category.id!)) {
                    existingCategoryCount.quantity! -= previousQuantity; // If category is being deleted, subtract previous quantity
                } else if (idsOfFoodCategoriestoSave.includes(category.id!)) {
                    existingCategoryCount.quantity! += food.currentQuantity!; // If category is being added, add full current quantity
                } else if (prevFoodCategories.includes(category.id!)) {
                    existingCategoryCount.quantity! += food.currentQuantity! - previousQuantity; // If category is unchanged, adjust by difference
                }
            });

            const inventorySummaryEntity = {
                key: datastore.key([FoodDAO.INVENTORY_SUMMARY_KIND, food.organizationID!]),
                data: inventorySummary
            };
            transaction.save(inventorySummaryEntity);

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

    async deleteFood(requestContext: RequestContext, foodID: string) {
        try {
            await this.validateDeleteRequest(foodID, requestContext.getCurrentOrganizationID()!);
            const foodCategoryAssociations = await foodDAO.getFoodCategoryAssociationsByFoodID(foodID);

            const transaction = datastore.transaction();
            const keys = [
                datastore.key([FoodDAO.FOOD_KIND, foodID])
            ];

            const food = await foodDAO.getFoodByID(foodID);
            const inventorySummary = await foodDAO.getInventorySummaryByOrganizationID(requestContext.getCurrentOrganizationID()!);
            foodCategoryAssociations.forEach(
                foodCategoryAssociation => {
                    keys.push(datastore.key([FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND, foodID + "|" + foodCategoryAssociation.foodCategoryID]))
                    if (inventorySummary && inventorySummary.categoryCounts) {
                        const categoryCount = inventorySummary.categoryCounts.find(c => c.categoryID === foodCategoryAssociation.foodCategoryID);
                        if (!categoryCount) {
                            throw new BadRequestError("Inconsistent database state: category count not found for categoryID " + foodCategoryAssociation.foodCategoryID);
                        }
                        categoryCount.quantity = (categoryCount.quantity || 0) - (food!.currentQuantity || 0);
                    }
                }
            );
            const inventorySummaryEntity = {
                key: datastore.key([FoodDAO.INVENTORY_SUMMARY_KIND, requestContext.getCurrentOrganizationID()!]),
                data: inventorySummary
            };
            transaction.save(inventorySummaryEntity);

            await transaction.run();
            transaction.delete(keys);
            await transaction.commit();
        } catch (error: any) {
            throw error;
        }
    }

    private async validateDeleteRequest(foodID: string, organizationID: string) {
        const food = await foodDAO.getFoodByID(foodID);
        if (!food) {
            throw new BadRequestError("Food not found");
        }

        if (food.organizationID != organizationID) {
            throw new BadRequestError("Food not owned by user organization");
        }
    }

    async getDetailedFoodByID(){

    }
}