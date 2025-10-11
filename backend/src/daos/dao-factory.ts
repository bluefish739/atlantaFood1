import { OrganizationDAO } from "./organization-dao";
import { FoodDAO } from "./food-dao";
import { RoleDAO } from "./role-dao";
import { StoreDAO } from "./store-dao";
import { StoreLocationDAO } from "./store-location-dao";
import { UserDAO } from "./user-dao";
import { VolunteerDAO } from "./volunteer-dao";

export const organizationDAO = new OrganizationDAO();
export const storeLocationDAO = new StoreLocationDAO();
export const storeDAO = new StoreDAO();
export const roleDAO = new RoleDAO();
export const userDAO = new UserDAO();
export const volunteerDAO = new VolunteerDAO();
export const foodDAO = new FoodDAO();