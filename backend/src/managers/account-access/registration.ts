import { ADMIN_ROLE_NAME, BadRequestError, InventorySummary, LoginRequest, LoginResponse, Organization, OrganizationEmployee, RequestContext, Role, ServerError, SignupData, User, UserRole } from "../../../../shared/src/kinds";
import * as logger from "firebase-functions/logger";
import { generateId } from "../../shared/idutilities";
import { foodDAO, organizationDAO, roleDAO, userDAO } from "../../daos/dao-factory";
import { checkDuplicatedUsername } from "../../utility-functions";

export class RegistrationManager {
    async signupUser(requestContext: RequestContext, signupData: SignupData) {
        try {
            const loginResponse = new LoginResponse();
            if (!signupData) {
                logger.log("Signup data is not provided", signupData);
                throw new BadRequestError("Signup data is not provided");
            }
            if (!this.validateSignupData(signupData)) {
                logger.log("Signup data incomplete", signupData);
                loginResponse.success = false;
                loginResponse.message = "Signup data incomplete";
                return loginResponse;
            }
            if (await checkDuplicatedUsername(signupData.username!)) {
                logger.log("Username already taken, please choose another", signupData);
                loginResponse.success = false;
                loginResponse.message = "Username already taken, please choose another";
                return loginResponse;
            }

            const organizationID = generateId();
            const user = new User();
            user.username = signupData.username;
            user.password = signupData.password;
            user.userType = signupData.userType;
            user.sessionID = generateId();
            const id = await userDAO.saveUser(user);
            logger.log("User added successfully! id=" + id);

            this.createNewOrganization(user.userID!, organizationID, user.userType!.toUpperCase());

            loginResponse.success = true;
            loginResponse.sessionID = user.sessionID;
            loginResponse.userID = user.userID;
            loginResponse.userType = user.userType;
            logger.log("signupUser: loginResponse=", loginResponse);
            return loginResponse;
        } catch (error: any) {
            logger.log("Failed to add a user", error);
            throw new ServerError(error.message);
        }
    }

    private validateSignupData(signupData: SignupData) {
        if (!(signupData.username && signupData.password && signupData.userType)) {
            logger.log("Signup data incomplete", signupData);
            return false;
        }
        const usernameRegex: RegExp = /[a-zA-Z0-9]{4,}/;
        if (!usernameRegex.test(signupData.username)) {
            logger.log("Username invalid", signupData);
            return false;
        }
        if (signupData.password.length < 6) {
            logger.log("Password invalid", signupData);
            return false;
        }
        if (!["Store", "Pantry", "Volunteer"].includes(signupData.userType)) {
            logger.log("User type invalid", signupData);
            return false;
        }

        return true;
    }

    private async createNewOrganization(userID: string, organizationID: string, organizationType: string) {
        const organization = new Organization();
        organization.id = organizationID;
        organization.organizationType = organizationType;
        await organizationDAO.saveOrganization(organization);
        logger.log("Created organization: ", organization);

        const organizationEmployee = new OrganizationEmployee();
        organizationEmployee.userID = userID;
        organizationEmployee.organizationID = organizationID;
        await organizationDAO.saveOrganizationEmployee(organizationEmployee);
        logger.log("Created organization employee: ", organizationEmployee);

        const adminRole = new Role();
        adminRole.name = ADMIN_ROLE_NAME;
        adminRole.organizationID = organizationID;
        adminRole.description = "Administrator";
        await roleDAO.saveRole(adminRole);
        logger.log("Created admin role: ", adminRole);

        const userRole = new UserRole();
        userRole.userID = userID;
        userRole.roleID = adminRole.id;
        await roleDAO.saveUserRole(userRole);
        logger.log("Created user role: ", userRole);

        const inventorySummary = new InventorySummary();
        inventorySummary.organizationID = organizationID;
        await foodDAO.saveInventorySummary(inventorySummary);
    }

    async login(requestContext: RequestContext, loginRequest: LoginRequest) {
        try {
            const loginRequestValid = this.validateLoginRequest(loginRequest);
            const loginResponse = new LoginResponse();
            if (!loginRequestValid) {
                loginResponse.success = false;
                loginResponse.message = "Login failed. Please provide both username and password.";
                return loginResponse;
            }

            const user = await userDAO.verifyUser(loginRequest.username!, loginRequest.password!);
            if (!user) {
                loginResponse.success = false;
                loginResponse.message = "Login failed. Username or password is incorrect.";
                return loginResponse;
            }

            user.sessionID = generateId();
            await userDAO.saveUser(user);
            loginResponse.success = true;
            loginResponse.sessionID = user.sessionID;
            loginResponse.userID = user.userID;
            loginResponse.userType = user.userType;
            return loginResponse;
        } catch (error: any) {
            throw new ServerError(error.message);
        }
    }

    private validateLoginRequest(loginRequest: LoginRequest) {
        if (!loginRequest) {
            logger.log("validateLoginRequest: login data not provided", loginRequest);
            return false;
        } 
        if (!loginRequest.username || !loginRequest.password) {
            logger.log("validateLoginRequest: username or password not provided", loginRequest);
            return false
        }
        return true;
    }
}