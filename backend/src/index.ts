import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import { OrganizationRouter } from "./routers/organization-router";
import { RoleRouter } from "./routers/role-router";
import { UserRouter } from "./routers/user-router";
import { FoodRouter } from "./routers/food-router";

const expressApp = express();
expressApp.use(express.json());
expressApp.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Expires', '0');
    next();
});

expressApp.use('/xapi/organizations', OrganizationRouter.buildRouter());
expressApp.use('/xapi/roles', RoleRouter.buildRouter());
expressApp.use('/xapi/users', UserRouter.buildRouter());
expressApp.use('/xapi/food', FoodRouter.buildRouter());

export const xapi = onRequest(expressApp);
