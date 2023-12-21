import { Application } from 'express';
import cors from 'cors';

const configureCors = (app: Application) => {
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }));
};

export default configureCors;
