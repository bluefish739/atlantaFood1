
import { BadRequestError, DetailedFood, Food, InventoryQuery, InventorySummaryRow, RequestContext } from "../../../../shared/src/kinds";
import { foodDAO } from "../../daos/dao-factory";
import * as logger from "firebase-functions/logger";

export class GetInventoryManager {
    async getInventory(requestContext: RequestContext, inventoryQuery: InventoryQuery, organizationID: string | undefined) {
        try {
            if (organizationID == "BLANK") {
                organizationID = requestContext.getCurrentOrganizationID();
            }
            if (!organizationID) {
                throw new BadRequestError("No organizationID found.");
            }
            const categoryIDs = inventoryQuery.categoryIDs;
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

    private summarizeRow(inventorySummaryRow: InventorySummaryRow, filteredInventory: DetailedFood[]) {
        const unitsList = new Set(filteredInventory.map(v => v.food!.units!));
        inventorySummaryRow.quantitySummary = [...unitsList]
            .map(units =>
                filteredInventory
                    .filter(v => v.food!.units == units)
                    .reduce((accumulator, v) => accumulator += v.food!.currentQuantity!, 0) + " " + units
            ).join(", ");
        return inventorySummaryRow;
    }

    async getInventorySummary(requestContext: RequestContext, organizationID: string) {
        if (organizationID == "BLANK") {
            organizationID = requestContext.getCurrentOrganizationID()!;
        }
        const inventoryData = await this.getInventory(requestContext, new InventoryQuery(), organizationID);
        const foodCategories = await foodDAO.getAllFoodCategories();

        const inventorySummaryData = foodCategories.map(foodCategory => {
            const inventorySummaryRow = new InventorySummaryRow();
            inventorySummaryRow.categoryName = foodCategory.name;
            const filteredInventory = inventoryData.filter(v => v.categoryIDs.includes(foodCategory.id!));
            return this.summarizeRow(inventorySummaryRow, filteredInventory);
        });

        const inventorySummaryRow = new InventorySummaryRow();
        inventorySummaryRow.categoryName = "Other";
        const filteredInventory = inventoryData.filter(v => v.categoryIDs.length === 0);
        const uncategorizedRow = this.summarizeRow(inventorySummaryRow, filteredInventory);
        inventorySummaryData.push(uncategorizedRow);
        const filteredInventorySummaryData = inventorySummaryData.filter(r => r.quantitySummary);

        return filteredInventorySummaryData;
    }

    async getDetailedFoodByID(requestContext: RequestContext, foodID: string) {
        const detailedFood = new DetailedFood();
        detailedFood.food = await foodDAO.getFoodByID(foodID);
        detailedFood.categoryIDs = await this.getCategoriesByFoodID(foodID);
        return detailedFood;
    }
}