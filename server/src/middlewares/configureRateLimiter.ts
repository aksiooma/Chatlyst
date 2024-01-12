import rateLimit from 'express-rate-limit';
import { Application } from 'express';

//Rate limiter
const configureRateLimiter = (app: Application) => {
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    message: "Too many requests, please try again later.",
  });

  app.use("/message", limiter);
};

export default configureRateLimiter;
