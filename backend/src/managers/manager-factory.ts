import { SaveFoodManager } from "./inventory-actions/save-food";
import { DeleteFoodManager } from "./inventory-actions/delete-food";
import { GetInventoryManager } from "./inventory-actions/get-inventory";

export const saveFoodManager = new SaveFoodManager();
export const deleteFoodManager = new DeleteFoodManager();
export const getInventoryManager = new GetInventoryManager();