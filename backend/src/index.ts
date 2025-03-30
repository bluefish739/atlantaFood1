import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import { StoreRouter } from './routers/store-router';
import { CharityRouter } from "./routers/charity-router";
import { StoreLocationRouter } from "./routers/store-location-router";
import { StudentRouter } from "./routers/student-router";
import { CharityLocationRouter } from "./routers/charity-location-router";

const expressApp = express();
expressApp.use(express.json());
expressApp.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Expires', '0');
    next();
});

expressApp.use('/xapi/students', StudentRouter.buildRouter());
expressApp.use('/xapi/stores', StoreRouter.buildRouter());
expressApp.use('/xapi/store-locations', StoreLocationRouter.buildRouter());
expressApp.use('/xapi/charity-locations', CharityLocationRouter.buildRouter());
expressApp.use('/xapi/charities', CharityRouter.buildRouter());

export const xapi = onRequest(expressApp);
