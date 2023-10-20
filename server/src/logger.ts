// logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',  // Log only info and above
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'log.json' }),
  ],
});

export default logger;
