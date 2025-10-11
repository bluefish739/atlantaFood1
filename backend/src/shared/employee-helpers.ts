import { organizationDAO, roleDAO, storeDAO, volunteerDAO } from "../daos/dao-factory";
import * as logger from "firebase-functions/logger";
import { datastore } from "../daos/data-store-factory";
import { RoleDAO } from "../daos/role-dao";
import { UserDAO } from "../daos/user-dao";
import { StoreDAO } from "../daos/store-dao";
import { OrganizationEmployee, StoreEmployee, TransportVolunteer, User, UserRole, UserType } from "../../../shared/src/kinds";
import { VolunteerDAO } from "../daos/volunteer-dao";
import { OrganizationDAO } from "../daos/organization-dao";

class EmployeeHelpers {
    private async getOrganizationIDofStoreUser(userID: string): Promise<string | undefined> {
        const employeeRecord = await storeDAO.getEmployeeRecordByUserID(userID);
        return employeeRecord?.organizationID;
    }

    private async getOrganizationIDofPantryUser(userID: string): Promise<string | undefined> {
        const employeeRecord = await organizationDAO.getEmployeeRecordByUserID(userID);
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
            const userRoles = await roleDAO.getUserRolesByUserID(userID);
            const keys = [
                datastore.key([UserDAO.USER_KIND, userID]),
            ];

            for (let userRole of userRoles) {
                keys.push(datastore.key([RoleDAO.USER_ROLE_KIND, userRole.userID + "|" + userRole.roleID]));
            }

            if (userType == UserType.STORE) {
                keys.push(datastore.key([StoreDAO.STORE_EMPLOYEE_KIND, userID]));
            } else if (userType == UserType.PANTRY) {
                keys.push(datastore.key([OrganizationDAO.ORGANIZATION_EMPLOYEE_KIND, userID]));
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

    private buildEmployeeRecordEntity(userType: string, userID: string, organizationID: string) {
        switch (userType) {
            case UserType.STORE: {
                const storeEmployee = new StoreEmployee();
                storeEmployee.userID = userID;
                storeEmployee.organizationID = organizationID;
                const storeEmployeeKey = datastore.key([StoreDAO.STORE_EMPLOYEE_KIND, userID]);
                const storeEmployeeEntity = {
                    key: storeEmployeeKey,
                    data: storeEmployee
                };
                return [storeEmployeeEntity];
            }
            case UserType.PANTRY: {
                const organizationEmployee = new OrganizationEmployee();
                organizationEmployee.userID = userID;
                organizationEmployee.organizationID = organizationID;
                const organizationEmployeeKey = datastore.key([OrganizationDAO.ORGANIZATION_EMPLOYEE_KIND, userID]);
                const organizationEmployeeEntity = {
                    key: organizationEmployeeKey,
                    data: organizationEmployee
                };
                return [organizationEmployeeEntity];
            }
            case UserType.VOLUNTEER: {
                const volunteer = new TransportVolunteer();
                volunteer.userID = userID;
                volunteer.organizationID = organizationID;
                const volunteerKey = datastore.key([VolunteerDAO.VOLUNTEER_KIND, userID]);
                const volunteerEntity = {
                    key: volunteerKey,
                    data: volunteer
                };
                return [volunteerEntity];
            }
            case UserType.ADMIN: {
                throw new Error("TODO: Admin record class not implemented");
            }
            default: {
                throw new Error("Unknown user type=" + userType);
            }
        }
    }

    public async saveEmployee(user: User, organizationID: string, idsOfUserRolesToSave: string[], idsOfUserRolesToDelete: string[]) {
        const userID = user.userID!;
        const transaction = datastore.transaction();
        try {
            const userKey = datastore.key([UserDAO.USER_KIND, userID]);
            const userEntity = {
                key: userKey,
                data: user
            };

            transaction.save([userEntity]);
            transaction.save(this.buildEmployeeRecordEntity(user.userType!, userID, organizationID));

            const userRoleEntities = idsOfUserRolesToSave.map(userRoleID => {
                const userRole = new UserRole();
                userRole.roleID = userRoleID;
                userRole.userID = user.userID;
                const userRoleKey = datastore.key([RoleDAO.USER_ROLE_KIND, user.userID + "|" + userRoleID]);
                const userRoleEntity = {
                    key: userRoleKey,
                    data: userRole
                };
                return userRoleEntity;
            });
            transaction.save(userRoleEntities);

            const keysOfUserRolesToDelete = idsOfUserRolesToDelete.map(userRoleID => datastore.key([RoleDAO.USER_ROLE_KIND, user.userID + "|" + userRoleID]));
            await transaction.run();
            transaction.delete(keysOfUserRolesToDelete);
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            logger.log('saveUser: Transaction failed ', error);
            return false;
        }
    }
}

export const employeeHelpers = new EmployeeHelpers();