import { Application } from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import Database from '../database'; 

const configureSession = (app: Application) => {
    const secret = process.env.SESSION_SECRET;
  
    if (!secret) {
      throw new Error('SESSION_SECRET is not set in the environment variables.');
    }
  
    const pgPool = Database.getInstance();
  
    app.use(
      session({
        store: new (pgSession(session))({
          pool: pgPool, // Use PostgreSQL pool for session storage
        }),
        secret, // Use the secret from environment variables
        resave: false, // Safe to use false since connect-pg-simple implements `touch`
        saveUninitialized: false, // Do not save empty sessions
        cookie: {
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
          httpOnly: true, // Prevent client-side JavaScript access
          sameSite: 'strict', // Helps mitigate CSRF attacks
        },
      })
    );
  };
  
  export default configureSession;