import express, { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import { authenticator } from "../shared/authentication";
import { foodDAO } from "../daos/dao-factory";
import { BaseRouter } from "./base-router";

export class FoodRouter extends BaseRouter {
    async getFoodCategories(req: Request, res: Response) {
        try {
            const foodCategories = await foodDAO.getFoodCategories();
            this.sendNormalResponse(res, foodCategories);
        } catch (error: any) {
            logger.log("getStoreInventory: failed", error)
            this.sendServerErrorResponse(res, { success: false, message: error.message });
        }
    }

    static buildRouter() {
        const foodRouter = new FoodRouter();
        return express.Router()
            .get('/get-food-categories', authenticator([]), foodRouter.getFoodCategories.bind(foodRouter));
    }
}