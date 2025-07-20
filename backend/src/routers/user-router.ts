import express, { Request, Response, Router } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { SignupData, User } from "../shared/kinds";
import { userDAO } from "../daos/dao-factory";
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
    //const user = JSON.parse(req.params.user);
    const siteID = req.params.siteID;
    try {
      const users = await userDAO.getAllUsers(siteID);
      this.sendNormalResponse(res, users);
    } catch (error: any) {
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
      logger.log("Signup data incomplete");
      return false;
    }

    //TO DO: Add extra checks for
    //usertype is an allowed value, password and username are of valid form
    //separate function to politely let user know of user duplication
    return true;
  }

  private checkDuplicatedUsername(username: string) {
    //TO DO: add logic to actually check for duplicated usernames
    return true;
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

      if (!this.checkDuplicatedUsername(signupData.username!)) {
        logger.log("Username already taken, please choose another", signupData);
        this.sendNormalResponse(res, { success: false, message: "Username already taken, please choose another" });
        return;
      }

      const user = new User;
      user.username = signupData.username;
      user.password = signupData.password;
      user.userType = signupData.userType;
      const id = await userDAO.saveUser(user);
      logger.log("User added successfully! id=" + id);
      this.sendNormalResponse(res, { success: true, message: "" });
    } catch (error: any) {
      logger.log("Failed to add a user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter(): Router {
    const userRouter = new UserRouter();
    return express.Router()
      .post('/user', authenticator([]), userRouter.saveUser.bind(userRouter))
      .get('/:siteID/list-users', authenticator([]), userRouter.getAllSiteUsers.bind(userRouter))
      .get('/user/:userId', authenticator([]), userRouter.getUser.bind(userRouter))
      .get('/login/:username/:password', userRouter.verifyCreds.bind(userRouter))
      .get('/verify-user-by-session', userRouter.verifyUserBySession.bind(userRouter))
      .post('/signup', userRouter.signupUser.bind(userRouter));
  }
}
