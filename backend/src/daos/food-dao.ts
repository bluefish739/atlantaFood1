import { Food, FoodCategory, FoodCategoryAssociation, InventorySummary } from "../../../shared/src/kinds";
import { datastore } from "./data-store-factory";
import { PropertyFilter } from "@google-cloud/datastore";

export class FoodDAO {
    static FOOD_KIND = "Food";
    static FOOD_CATEGORY_KIND = "FoodCategory";
    static FOOD_CATEGORY_ASSOCIATION_KIND = "FoodCategoryAssocation";
    static INVENTORY_SUMMARY_KIND = "InventorySummary";
    public async getFoodsByOrganizationID(organizationID: string) {
        const query = datastore.createQuery(FoodDAO.FOOD_KIND)
            .filter(new PropertyFilter('organizationID', '=', organizationID));
        const data = await query.run();
        const foods = data[0];
        return foods as Food[];
    }

    public async getAllFoodCategories() {
        const query = datastore.createQuery(FoodDAO.FOOD_CATEGORY_KIND);
        const data = await query.run();
        const foodCategories = data[0];
        return foodCategories as FoodCategory[];
    }

    public async getFoodCategoryByID(foodCategoryID: string) {
        const query = datastore.createQuery(FoodDAO.FOOD_CATEGORY_KIND)
            .filter(new PropertyFilter('id', '=', foodCategoryID));
        const data = await query.run();
        const [foodCategory] = data[0];
        return foodCategory as FoodCategory;
    }

    public async getFoodCategoryAssociationsByFoodID(foodID: string) {
        const query = datastore.createQuery(FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND)
            .filter(new PropertyFilter('foodID', '=', foodID));
        const data = await query.run();
        const foodCategories = data[0];
        return foodCategories as FoodCategoryAssociation[];
    }

    public async saveFoodCategoryAssociation(foodCategoryAssociation: FoodCategoryAssociation) {
        const entityKey = datastore.key([FoodDAO.FOOD_CATEGORY_ASSOCIATION_KIND, foodCategoryAssociation.foodID + "|" + foodCategoryAssociation.foodCategoryID]);
        const entity = {
            key: entityKey,
            data: foodCategoryAssociation
        }
        await datastore.save(entity);
    }

    public async getFoodByID(foodID: string) {
        const query = datastore.createQuery(FoodDAO.FOOD_KIND)
            .filter(new PropertyFilter('id', '=', foodID));
        const data = await query.run();
        const [food] = data[0];
        return food as Food;
    }

    public async saveFood(food: Food) {
        const entityKey = datastore.key([FoodDAO.FOOD_KIND, food.id!]);
        const entity = {
            key: entityKey,
            data: food
        }
        await datastore.save(entity);
    }

    public async saveInventorySummary(inventorySummary: InventorySummary) {
        const entityKey = datastore.key([FoodDAO.INVENTORY_SUMMARY_KIND, inventorySummary.organizationID!]);
        const entity = {
            key: entityKey,
            data: inventorySummary
        }
        await datastore.save(entity);
    }

    public async getInventorySummaryByOrganizationID(organizationID: string) {
        const entityKey = datastore.key([FoodDAO.INVENTORY_SUMMARY_KIND, organizationID]);
        const data = await datastore.get(entityKey);
        const inventorySummary = data[0];
        return inventorySummary as InventorySummary;
    }
}