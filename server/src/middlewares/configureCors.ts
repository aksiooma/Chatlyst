import { Application } from 'express';
import cors from 'cors';

const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.106:3000']

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
