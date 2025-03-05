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
        pool: pgPool,
        createTableIfMissing: true
      }),
      secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'none'
      },
      proxy: true
    })
  );
};

export default configureSession;