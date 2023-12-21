//configureSession.ts
import { Application } from 'express';
const session = require('express-session');

// 5. Session middleware
const configureSession = (app: Application) => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            secure: false  // set this to true if you're using HTTPS
        }
    }));
}
export default configureSession;