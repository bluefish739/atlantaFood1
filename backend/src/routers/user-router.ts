import express, { Request, Response, Router } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { User } from "../shared/kinds";
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
      this.sendSuccessfulResponse(res, user);
    } catch (error: any) {
      logger.log("Failed to add a user", error);
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async getAllSiteUsers(req: Request, res: Response) {
    const authentication = req.headers.authentication as string;
    const user = await userDAO.getUserBySessionID(authentication);
    if (!user) {
      this.sendSessionErrorResponse(res, { success: false, message: "Invalid session" });
      return;
    }
    const siteID = req.params.siteID as string;
    try {
      const users = await userDAO.getAllUsers(siteID);
      this.sendSuccessfulResponse(res, users);
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
      this.sendSuccessfulResponse(res, user);
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
        this.sendSuccessfulResponse(res, "Invalid Credentials");
        return;
      }
      user.sessionID = generateId();
      await userDAO.saveUser(user);
      this.sendSuccessfulResponse(res, user.sessionID);
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  async verifySession(req: Request, res: Response) {
    try {
      const authentication = req.headers.authentication as string;
      const user = await userDAO.getUserBySessionID(authentication);
      if (!user) {
        this.sendSessionErrorResponse(res, { success: false, message: "Invalid session" });
        return;
      }
      this.sendSuccessfulResponse(res, true)
    } catch (error: any) {
      this.sendServerErrorResponse(res, { success: false, message: error.message });
    }
  }

  static buildRouter(): Router {
    const userRouter = new UserRouter();
    return express.Router()
      .post('/user', authenticator, userRouter.saveUser.bind(userRouter))
      .get('/:siteID/list-users', authenticator, userRouter.getAllSiteUsers.bind(userRouter))
      .get('/user/:userId', authenticator, userRouter.getUser.bind(userRouter))
      .get('/login/:username/:password', authenticator, userRouter.verifyCreds.bind(userRouter))
      .get('/verify-session', authenticator, userRouter.verifySession.bind(userRouter));
  }
}
