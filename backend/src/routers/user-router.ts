import express, { Request, Response, Router } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { DetailedUser, LoginRequest, SignupData, User, RequestContext } from "../../../shared/src/kinds";
import { organizationDAO, roleDAO, userDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";
import { generateId } from "../shared/idutilities";
import { employeeHelpers } from "../shared/employee-helpers";
import { registrationManager } from "../managers/manager-factory";
import { checkDuplicatedUsername } from "../utility-functions";

export class UserRouter extends BaseRouter {
  async saveUser(req: Request, res: Response) {
    const detailedUser = req.body as DetailedUser;
    const organizationID = this.getCurrentOrganizationID(req)!;
    let userBeingSaved: User;
    try {
      const existingUser = await this.validateSaveUserRequest(organizationID, detailedUser);
      userBeingSaved = existingUser ? existingUser : new User();
    } catch (error: any) {
      if (error == "USERNAME_TAKEN") {
        this.sendNormalResponse(res, { success: false, message: "Username already taken, please choose another." });
        return;
      }
      logger.log("saveUser: failed to validate detailedUser object ", detailedUser);
      this.sendBadRequestResponse(res, { success: false, message: error });
      return;
    }

    const user = detailedUser.user!;
    const newUserRoleIDs = detailedUser.userRoleIDs;
    userBeingSaved.firstName = user.firstName;
    userBeingSaved.lastName = user.lastName;
    userBeingSaved.phoneNumber = user.phoneNumber;
    userBeingSaved.username = user.username;
    userBeingSaved.userType = this.getCurrentUser(req)!.userType;
    if (!userBeingSaved.userID) userBeingSaved.userID = generateId();
    if (!userBeingSaved.password) userBeingSaved.password = generateId().slice(0, 6);
    
    try {
      const oldUserRoleIDs = (await roleDAO.getUserRolesByUserID(userBeingSaved.userID!)).map(userRole => userRole.roleID!);
      const idsOfUserRolesToDelete = oldUserRoleIDs.filter(userRoleID => !newUserRoleIDs.includes(userRoleID));
      const idsOfUserRolesToSave = newUserRoleIDs.filter(userRoleID => !oldUserRoleIDs.includes(userRoleID));
      await employeeHelpers.saveEmployee(userBeingSaved, organizationID, idsOfUserRolesToSave, idsOfUserRolesToDelete);
      this.sendNormalResponse(res, user);
    } catch (error: any) {
      logger.log("Failed to add a user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  private async validateSaveUserRequest(organizationID: string, detailedUser: DetailedUser) {
    const user = detailedUser.user;
    if (!user) {
      logger.log("User entity is not provided");
      throw "User entity is not provided";
    }

    const newUserRoleIDs = detailedUser.userRoleIDs;
    if (!newUserRoleIDs || !newUserRoleIDs.length) {
      throw "No user roles provided";
    }

    for (let newUserRoleID of newUserRoleIDs) {
      const newUserRole = await roleDAO.getRole(newUserRoleID);
      if (!newUserRole) {
        logger.log("saveUser: newUserRole does not exist, newUserRoleID=" + newUserRole);
        throw "Attempting to assign nonexistent role";
      }
      if (newUserRole.organizationID != organizationID) {
        logger.log("saveUser: newUserRole not part of organization, newUserRoleID=" + newUserRole);
        throw "Attempting to assign role not belonging to current organization";
      }
    }

    if (user.userID) {
      const existingUser = await userDAO.getUser(user.userID);
      if (!existingUser) {
        throw "No user with id " + user.userID + " was found";
      }

      if (await employeeHelpers.getOrganizationOfUser(existingUser.userType, existingUser.userID) != organizationID) {
        throw "Attempting to modify user not on organization";
      }
      return existingUser;
    }

    if (user.username) {
      const isUsernameTaken = await checkDuplicatedUsername(user.username);
      if (isUsernameTaken) {
        throw 'USERNAME_TAKEN';
      }
    }

    return null;
  }

  async getAllSiteUsers(req: Request, res: Response) {
    try {
      const organizationID = this.getCurrentOrganizationID(req)!;
      const user = (req as any).user;
      const userType = user.userType;
      let userIDs: string[] | undefined;
      if (userType == "Store" || userType == "Pantry" || userType == "Volunteer") {
        userIDs = (await organizationDAO.getEmployeesByOrganizationID(organizationID)).map(v => v.userID!);
      } else if (userType == "Admin") {
        //TODO: Implement this
        //userIDs = (await userDAO.getAdminsByOrganizationID(organizationID)).map(v => v.userID!);
      }

      const users: User[] = userIDs ? await userDAO.getUsersByUserIDs(userIDs) : [];
      logger.log("getAllSiteUsers: made it to send normal response", users);
      const usersData = users.map(user => {
        // Send back user object containing only needed attributes by frontend to avoid sending back sensitive data
        return this.copyUserAttributesForFrontend(user);
      });
      logger.log("getAllSiteUsers: usersData=", usersData)
      this.sendNormalResponse(res, usersData);
    } catch (error: any) {
      logger.log("getAllSiteUsers: failed", error)
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getDetailedUserByID(req: Request, res: Response) {
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
      const userRoles = await roleDAO.getUserRolesByUserID(userId);
      const detailedUser = new DetailedUser();
      detailedUser.user = this.copyUserAttributesForFrontend(user);
      detailedUser.userRoleIDs = userRoles.map(userRole => userRole.roleID!);
      this.sendNormalResponse(res, detailedUser);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginRequest = req.body as LoginRequest;
      const loginResponse = await registrationManager.login(new RequestContext(req), loginRequest);
      this.sendNormalResponse(res, loginResponse);
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

  async signupUser(req: Request, res: Response) {
    const signupData = req.body as SignupData;
    try {
      const loginResponse = await registrationManager.signupUser(new RequestContext(req), signupData);
      this.sendNormalResponse(res, loginResponse);
    } catch (error: any) {
      logger.log("Failed to add a user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  private copyUserAttributesForFrontend(user: User) {
    const userForFrontend = new User();
    userForFrontend.userID = user.userID;
    userForFrontend.username = user.username;
    userForFrontend.firstName = user.firstName;
    userForFrontend.lastName = user.lastName;
    userForFrontend.phoneNumber = user.phoneNumber;
    return userForFrontend;
  }

  async removeUser(req: Request, res: Response) {
    const user = this.getCurrentUser(req)!;
    const organizationID = this.getCurrentOrganizationID(req)!;
    const userID = req.params.userID;
    try {
      logger.log("Remove user test data retrieved: ", userID, organizationID);
      const deleteRequestValid = await this.validateDeleteRequest(userID, user.userID!, organizationID);
      if (!deleteRequestValid) {
        this.sendNormalResponse(res, { success: false, message: "Invalid request data" });
        return;
      }
      if (!await employeeHelpers.removeUser(userID, user.userType!)) {
        this.sendNormalResponse(res, { success: false, message: "Failed to remove the user." });
      } else {
        this.sendNormalResponse(res, { success: true, message: "User successfully removed" });
      }
    } catch (error: any) {
      logger.log("Failed to remove user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async validateDeleteRequest(targetUserID: string, currentUserID: string, currentOrganizationID: string) {
    if (!targetUserID) {
      logger.log("validateDeleteRequest: no user ID provided");
      return false;
    }

    if (targetUserID == currentUserID) {
      logger.log("validateDeleteRequest: attempting to delete user who sent delete request " + targetUserID);
      return false;
    }

    const user = await userDAO.getUser(targetUserID);
    if (!user) {
      logger.log("validateDeleteRequest: no user with ID found " + targetUserID);
      return false;
    }

    const targetUserOrganizationID = await employeeHelpers.getOrganizationOfUser(user.userType!, targetUserID);
    if (targetUserOrganizationID != currentOrganizationID) {
      logger.log("validateDeleteRequest: target organization id does not match current " + targetUserOrganizationID + " | " + currentOrganizationID);
      return false;
    }

    return true;
  }

  static buildRouter(): Router {
    const userRouter = new UserRouter();
    return express.Router()
      .post('/user', authenticator([]), userRouter.saveUser.bind(userRouter))
      .get('/list-users', authenticator([]), userRouter.getAllSiteUsers.bind(userRouter))
      .get('/user-details/:userId', authenticator([]), userRouter.getDetailedUserByID.bind(userRouter))
      .post('/login', userRouter.login.bind(userRouter))
      .get('/verify-user-by-session', userRouter.verifyUserBySession.bind(userRouter))
      .post('/signup', userRouter.signupUser.bind(userRouter))
      .delete('/remove-user/:userID', authenticator([]), userRouter.removeUser.bind(userRouter));
  }
}
