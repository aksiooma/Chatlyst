require('dotenv').config({ path: __dirname + '/../.env' });
import express from 'express';
import bodyParser from 'body-parser';
import Database from './database';
import { cleanupDatabase } from './dbCleanup';
import configureRateLimiter from './middlewares/configureRateLimiter';
import configureSession from './middlewares/configureSession';
import configureCors from './middlewares/configureCors';
import configureLogger from './middlewares/configureLogger';
import configureCachePolicy from './middlewares/configureCachePolicy';
import messageRoute from './routes/messageRoute';
import { insertPredefinedResponses } from './insertPredefinedResponses';
import { getChatHistory } from './controllers/historyController';
import { getGreeting } from './controllers/greetingController';

const DEFAULT_GREETING = ["Greetings, mere mortal. How may I grace you with my unparalleled wisdom today?", "Salutations, human. What brings you to my digital realm of fantastic enlightenment?"];

let greetings: string[];

try {
  if (process.env.GREETING) {
    greetings = JSON.parse(process.env.GREETING);
  } else {
    greetings = DEFAULT_GREETING;
  }
} catch (err) {
  console.error("Failed to parse the GREETING environment variable, using default value.", err);
  greetings = DEFAULT_GREETING;
}

const app = express();

//Middleware configurations:
// 1. Explicit CORS configuration
configureCors(app);
// 2. Use body parser middleware
app.use(bodyParser.json());
// 3. RateLimiter
configureRateLimiter(app);
//4. Logging
configureLogger(app);
// 5. Session middleware
configureSession(app);
// 6. Cache policy
configureCachePolicy(app);

// Initialize the SQLite database and then start the server
Database.initDB()
  .then(() => {
    const db = Database.getInstance();
    if (!db) {
      throw new Error('Database is not initialized pububu');
    }

    return insertPredefinedResponses(db, greetings);
  })
  .then(() => {
    app.use('/message', messageRoute);
    app.get('/history', getChatHistory);
    app.get('/greeting', getGreeting);

    const PORT = parseInt(process.env.VITE_PORT ?? '5173', 10); // Development
    // const PORT = process.env.PORT || 5173; // Production

    app.listen(PORT,'0.0.0.0', () => { //Remove '0.0.0.0' for Production
      console.log(`Server is running on port ${PORT}`);
    });

    // Setting an interval for database cleanup
    setInterval(() => {
      const dbInstance = Database.getInstance();
      if (dbInstance) {
        cleanupDatabase(dbInstance);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
  })
  .catch(err => {
    console.error('Error during initialization:', err);
    process.exit(1);
  });


