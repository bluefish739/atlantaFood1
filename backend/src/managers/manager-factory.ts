import { RegistrationManager } from "./account-access/registration";
import { FoodActionManager } from "./inventory-actions/food-action";
import { GetInventoryManager } from "./inventory-actions/get-inventory";
import { OrganizationInfoManager } from "./organizations/organization-info";
import { GetCategorySummariesManager } from "./inventory-actions/get-category-summaries";

export const foodActionManager = new FoodActionManager();
export const getInventoryManager = new GetInventoryManager();
export const registrationManager = new RegistrationManager();
export const organizationInfoManager = new OrganizationInfoManager();
export const getCategorySummariesManager = new GetCategorySummariesManager();