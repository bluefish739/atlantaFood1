
import { Request, Response, NextFunction } from "express";
import * as logger from "firebase-functions/logger";
import admin from 'firebase-admin';

admin.initializeApp();

export const authenticator = async (req: Request, res: Response, next: NextFunction) => {
    logger.log("Verifying authentication token...");
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        logger.log('verifyIdToken faield: no authorization available');
        //res.status(401).json({ sucess: false, message: 'You are not authorized' });
        //return;
    } else {
        const idToken = authorization.split('Bearer ')[1];
        try {
            const decodedIdToken = await admin.auth().verifyIdToken(idToken);
            (req as any).user = decodedIdToken;
            logger.log('verifyIdToken succeeded', decodedIdToken);
        } catch (e: any) {
            logger.log('verifyIdToken faield', e);
            //res.status(401).json({ sucess: false, message: 'You are not authorized' });
            //return;
        }
    }

    next();
};