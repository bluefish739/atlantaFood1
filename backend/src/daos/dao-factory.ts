import { CharityDAO } from "./charity-dao";
import { CharityLocationDAO, StoreLocationDAO } from "./location-dao";
import { StoreDAO } from "./store-dao";
import { StudentDAO } from "./student-dao";

export const charityDAO = new CharityDAO();
export const locationDAO = new CharityLocationDAO();
export const storeLocationDAO = new StoreLocationDAO();
export const storeDAO = new StoreDAO();
export const studentDAO = new StudentDAO();