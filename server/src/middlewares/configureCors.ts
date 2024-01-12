import { Application } from 'express';
import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

//Cors
const configureCors = (app: Application) => {
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }, 
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }));
};

export default configureCors;
