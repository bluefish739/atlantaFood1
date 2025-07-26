import express, { Request, Response, Router } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { Charity, CharityEmployee, Role, SignupData, Store, StoreEmployee, TransportVolunteer, User, UserRole, VolunteerOrganization } from "../shared/kinds";
import { charityDAO, roleDAO, storeDAO, userDAO, volunteerDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";
import { generateId } from "../shared/idutilities";

export class UserRouter extends BaseRouter {
  async saveUser(req: Request, res: Response) {
    const user = req.body as User;
    try {
      if (!user) {
        logger.log("User entity is not provided");
        this.sendClientErrorResponse(res, { success: false, message: "User entity is not provided" }, 404);
        return;
      }
      if (user.userID) {
        const existingUser = await userDAO.getUser(user.userID);
        if (!existingUser) {
          this.sendClientErrorResponse(res, { success: false, message: "No user with id " + user.userID + " was found" }, 404);
          return;
        }
      }
      const id = await userDAO.saveUser(user);
      logger.log("User added successfully! id=" + id);
      this.sendNormalResponse(res, user);
    } catch (error: any) {
      logger.log("Failed to add a user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllSiteUsers(req: Request, res: Response) {
    try {
      logger.log("getAllSiteUsers: made it to beginning ", req.headers);
      const organizationID: string = (req as any).organizationID;
      const user = (req as any).user;
      const userType = user.userType;
      let userIDs: string[] | undefined;
      if (userType == "Store") {
        userIDs = (await userDAO.getEmployeesOfStoreByOrganizationID(organizationID)).map(v => v.userID!);
      } else if (userType == "Pantry") {
        userIDs = (await userDAO.getEmployeesOfPantryByOrganizationID(organizationID)).map(v => v.userID!);
      } else if (userType == "Volunteer") {
        userIDs = (await userDAO.getVolunteersByOrganizationID(organizationID)).map(v => v.userID!);
      } else if (userType == "Admin") {
        //TODO: Implement this
        //userIDs = (await userDAO.getAdminsByOrganizationID(organizationID)).map(v => v.userID!);
      }
      
      logger.log("getAllSiteUsers: organizationID from user ", organizationID);
      const users = userIDs? await userDAO.getUsersByUserIDs(userIDs) : [];
      logger.log("getAllSiteUsers: made it to send normal response", users);
      this.sendNormalResponse(res, users);
    } catch (error: any) {
      logger.log("getAllSiteUsers: failed", error)
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      if (!userId) {
        this.sendClientErrorResponse(res, { success: false, message: "Missing user ID" }, 400);
        return;
      }
      const user = await userDAO.getUser(userId);
      if (!user) {
        this.sendClientErrorResponse(res, { success: false, message: "User not found " + userId }, 404);
        return;
      }
      this.sendNormalResponse(res, user);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async verifyCreds(req: Request, res: Response) {
    try {
      const username = req.params.username as string;
      const password = req.params.password as string;
      const user = await userDAO.verifyUser(username, password);
      if (user === undefined) {
        this.sendNormalResponse(res, "Invalid Credentials");
        return;
      }
      user.sessionID = generateId();
      await userDAO.saveUser(user);
      this.sendNormalResponse(res, user.sessionID);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async verifyUserBySession(req: Request, res: Response) {
    try {
      let user = await this.getUserBySession(req, res);
      if (user) {
        this.sendNormalResponse(res, { hasSession: true });
      } else {
        this.sendNormalResponse(res, { hasSession: false });
      }
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
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

  private async checkDuplicatedUsername(username: string) {
    return await userDAO.usernameTaken(username);
  }

  async signupUser(req: Request, res: Response) {
    const signupData = req.body as SignupData;
    try {
      if (!signupData) {
        logger.log("Signup data is not provided", signupData);
        this.sendBadRequestResponse(res, { success: false, message: "Signup data is not provided" });
        return;
      }

      if (!this.validateSignupData(signupData)) {
        logger.log("Signup data incomplete", signupData);
        this.sendBadRequestResponse(res, { success: false, message: "Signup data incomplete" });
        return;
      }

      if (await this.checkDuplicatedUsername(signupData.username!)) {
        logger.log("Username already taken, please choose another", signupData);
        this.sendNormalResponse(res, { success: false, message: "Username already taken, please choose another" });
        return;
      }

      const organizationID = generateId();
      const user = new User;
      user.username = signupData.username;
      user.password = signupData.password;
      user.userType = signupData.userType;
      user.sessionID = generateId();
      const id = await userDAO.saveUser(user);
      logger.log("User added successfully! id=" + id);
      

      if (user.userType == "Store") {
        this.createNewStore(user.userID!, organizationID);
      } else if (user.userType == "Pantry") {
        this.createNewCharity(user.userID!, organizationID);
      } else if (user.userType == "Volunteer") {
        this.createNewVolunteer(user.userID!, organizationID);
      }

      this.sendNormalResponse(res, { success: true, message: "", sessionID: user.sessionID });
    } catch (error: any) {
      logger.log("Failed to add a user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  private async createNewStore(userID: string, organizationID: string) {
    const store = new Store();
    store.id = organizationID;
    storeDAO.saveStore(store);

    const storeEmployee = new StoreEmployee();
    storeEmployee.userID = userID;
    storeEmployee.organizationID = organizationID;
    userDAO.saveStoreEmployee(storeEmployee);

    const adminRole = new Role();
    adminRole.name = "ORGANIZATION_ADMIN";
    adminRole.organizationID = organizationID;
    adminRole.description = "Administrator";
    roleDAO.saveRole(adminRole);
    logger.log("Created admin role: ", adminRole);

    const userRole = new UserRole();
    userRole.userID = userID;
    userRole.roleID = adminRole.id;
    roleDAO.saveUserRole(userRole);
    logger.log("Created user role: ", userRole);
  }

  private async createNewCharity(userID: string, organizationID: string) {
    const charity = new Charity();
    charity.id = organizationID;
    charityDAO.saveCharity(charity);
    logger.log("Created charity: ", charity);

    const charityEmployee = new CharityEmployee();
    charityEmployee.userID = userID;
    charityEmployee.organizationID = organizationID;
    userDAO.saveCharityEmployee(charityEmployee);
    logger.log("Created charity employee: ", charityEmployee);

    const adminRole = new Role();
    adminRole.name = "ORGANIZATION_ADMIN";
    adminRole.organizationID = organizationID;
    adminRole.description = "Administrator";
    roleDAO.saveRole(adminRole);
    logger.log("Created admin role: ", adminRole);

    const userRole = new UserRole();
    userRole.userID = userID;
    userRole.roleID = adminRole.id;
    roleDAO.saveUserRole(userRole);
    logger.log("Created user role: ", userRole);
  }

  private createNewVolunteer(userID: string, organizationID: string) {
    const volunteerOrganization = new VolunteerOrganization();
    volunteerOrganization.id = organizationID;
    volunteerDAO.saveOrganization(volunteerOrganization);
    logger.log("Created volunteer organization: ", volunteerOrganization);

    const volunteer = new TransportVolunteer();
    volunteer.userID = userID;
    volunteer.organizationID = organizationID;
    volunteerDAO.saveVolunteer(volunteer);
    logger.log("Created volunteer: ", volunteer);

    const adminRole = new Role();
    adminRole.name = "ORGANIZATION_ADMIN";
    adminRole.organizationID = organizationID;
    adminRole.description = "Administrator";
    roleDAO.saveRole(adminRole);
    logger.log("Created admin role: ", adminRole);

    const userRole = new UserRole();
    userRole.userID = userID;
    userRole.roleID = adminRole.id;
    roleDAO.saveUserRole(userRole);
    logger.log("Created user role: ", userRole);
  }

  async removeUser(req: Request, res: Response) {
    const userID = req.params.userID;
    const organizationID = "TODO: Add organizationID";
    try {
      logger.log("Remove user test data retrieved: ", userID, organizationID);
      this.sendNormalResponse(res, { success: true, message: "User successfully removed" });
    } catch (error: any) {
      logger.log("Failed to remove user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter(): Router {
    const userRouter = new UserRouter();
    return express.Router()
      .post('/user', authenticator([]), userRouter.saveUser.bind(userRouter))
      .get('/list-users', authenticator([]), userRouter.getAllSiteUsers.bind(userRouter))
      .get('/user/:userId', authenticator([]), userRouter.getUser.bind(userRouter))
      .get('/login/:username/:password', userRouter.verifyCreds.bind(userRouter))
      .get('/verify-user-by-session', userRouter.verifyUserBySession.bind(userRouter))
      .post('/signup', userRouter.signupUser.bind(userRouter))
      .delete('/remove-user/:userID', authenticator([]), userRouter.removeUser.bind(userRouter));
  }
}
