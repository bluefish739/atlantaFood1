import { charityDAO, storeDAO, volunteerDAO } from "../daos/dao-factory";
import * as logger from "firebase-functions/logger";

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
}

export const employeeHelpers = new EmployeeHelpers();