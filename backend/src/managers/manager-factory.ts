import { FoodActionManager } from "./inventory-actions/food-action";
import { GetInventoryManager } from "./inventory-actions/get-inventory";

export const foodActionManager = new FoodActionManager();
export const getInventoryManager = new GetInventoryManager();