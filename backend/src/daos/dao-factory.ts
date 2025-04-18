import { CharityDAO } from "./charity-dao";
import { CharityLocationDAO } from "./charity-location-dao";
import { RoleDAO } from "./role-dao";
import { StoreDAO } from "./store-dao";
import { StoreLocationDAO } from "./store-location-dao";
import { StudentDAO } from "./student-dao";

export const charityDAO = new CharityDAO();
export const charityLocationDAO = new CharityLocationDAO();
export const storeLocationDAO = new StoreLocationDAO();
export const storeDAO = new StoreDAO();
export const studentDAO = new StudentDAO();
export const roleDAO = new RoleDAO();