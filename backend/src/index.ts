import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import { StoreRouter } from './routers/store-router';
import { charityRouter } from "./routers/charity-router";
import { locationRouter } from "./routers/location-router";
import { StudentRouter } from "./routers/student-router";

const expressApp = express();
expressApp.use(express.json());
expressApp.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Expires', '0');
    next();
});


expressApp.use('/xapi/students', StudentRouter.buildRouter());
expressApp.use('/xapi/stores', StoreRouter.buildRouter());
expressApp.use('/xapi/locations', locationRouter);
expressApp.use('/xapi/charities', charityRouter);

export const xapi = onRequest(expressApp);
