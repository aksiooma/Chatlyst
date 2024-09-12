//configureSession.ts
import { Application } from 'express';
const session = require('express-session');

//Session middleware
const configureSession = (app: Application) => {
    const isProduction = process.env.NODE_ENV === 'production';

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true, // Prevent client-side access to the cookie
            secure: isProduction, // Set to true if using HTTPS in production
            sameSite: isProduction ? 'strict' : 'lax', // Helps mitigate CSRF
        }
    }));
}
export default configureSession;
