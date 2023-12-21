//configureLogger.ts
import { Application } from 'express';
import logger from '../logger';

//4. Logging
const configureLogger = (app: Application) => {
    app.use((req, res, next) => {
        const logData = {
            method: req.method,
            path: req.path,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            requestBody: req.body
        };
        logger.info('Incoming Request', logData);
        next();

    });
}
export default configureLogger;