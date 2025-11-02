import { FoodCategory } from "../../../shared/src/kinds";
import { foodDAO } from "../daos/dao-factory";

export async function getAllFoodCategories(): Promise<FoodCategory[]> {
    return await foodDAO.getAllFoodCategories();
}