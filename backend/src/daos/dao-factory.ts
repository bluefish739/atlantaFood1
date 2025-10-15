import { OrganizationDAO } from "./organization-dao";
import { FoodDAO } from "./food-dao";
import { RoleDAO } from "./role-dao";
import { UserDAO } from "./user-dao";

export const organizationDAO = new OrganizationDAO();
export const roleDAO = new RoleDAO();
export const userDAO = new UserDAO();
export const foodDAO = new FoodDAO();