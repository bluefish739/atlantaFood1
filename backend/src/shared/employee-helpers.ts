import { charityDAO, roleDAO, storeDAO, volunteerDAO } from "../daos/dao-factory";
import * as logger from "firebase-functions/logger";
import { datastore } from "../daos/data-store-factory";
import { RoleDAO } from "../daos/role-dao";
import { UserDAO } from "../daos/user-dao";
import { StoreDAO } from "../daos/store-dao";
import { UserType } from "../../../shared/src/kinds";
import { CharityDAO } from "../daos/charity-dao";
import { VolunteerDAO } from "../daos/volunteer-dao";

class EmployeeHelpers {
    private async getOrganizationIDofStoreUser(userID: string): Promise<string | undefined> {
        const employeeRecord = await storeDAO.getEmployeeRecordByUserID(userID);
        return employeeRecord?.organizationID;
    }

    private async getOrganizationIDofPantryUser(userID: string): Promise<string | undefined> {
        const employeeRecord = await charityDAO.getEmployeeRecordByUserID(userID);
        return employeeRecord?.organizationID;
    }

    private async getOrganizationIDofVolunteer(userID: string): Promise<string | undefined> {
        const employeeRecord = await volunteerDAO.getEmployeeRecordByUserID(userID);
        return employeeRecord?.organizationID;
    }

    private async getOrganizationIDofAdmin(userID: string): Promise<string | undefined> {
        throw new Error("Function not implemented.");
    }

    public async getOrganizationOfUser(userType: string, userID: string) {
        if (userType == "Store") {
            return await this.getOrganizationIDofStoreUser(userID!);
        } else if (userType == "Pantry") {
            return await this.getOrganizationIDofPantryUser(userID!);
        } else if (userType == "Volunteer") {
            return await this.getOrganizationIDofVolunteer(userID!);
        } else if (userType == "Admin") {
            return await this.getOrganizationIDofAdmin(userID!);
        } else {
            logger.log("User type is unknown:", userType);
            return undefined;
        }
    }

    public async removeUser(userID: string, userType: string) {
        const transaction = datastore.transaction();
        try {
            // remove record of StoreEmployee/CharityEmployee/Volunteer
            const userRoles = await roleDAO.getUserRoles(userID);
            const keys = [
                datastore.key([UserDAO.USER_KIND, userID]), // remove User
            ];

            // Add key of UserRole entities to be removed
            for (let userRole of userRoles) {
                keys.push(datastore.key([RoleDAO.USER_ROLE_KIND, userRole.userID + "|" + userRole.roleID]));
            }

            // Add key of employee record entity to be removed
            if (userType == UserType.STORE) {
                keys.push(datastore.key([StoreDAO.STORE_EMPLOYEE_KIND, userID]));
            } else if (userType == UserType.PANTRY) {
                keys.push(datastore.key([CharityDAO.CHARITY_EMPLOYEE_KIND, userID]));
            } else if (userType == UserType.VOLUNTEER) {
                keys.push(datastore.key([VolunteerDAO.VOLUNTEER_KIND, userID]));
            } else if (userType == UserType.ADMIN) {
                throw new Error("TODO: Deletion of admin user type not implemented.");
            } else {
                throw new Error("Unknown user type=" + userType);
            }
            await transaction.run();
            transaction.delete(keys);
            await transaction.commit();
            logger.log('Entities deleted successfully.');
            return true;
        } catch (error) {
            await transaction.rollback();
            logger.log('Transaction failed:', error);
            return false;
        }
    }
}

export const employeeHelpers = new EmployeeHelpers();