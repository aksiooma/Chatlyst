require('dotenv').config({ path: __dirname + '/../.env' });
import express from 'express';
import bodyParser from 'body-parser';
import Database from './database';
import { dbCleanup } from './dbCleanup';
import configureRateLimiter from './middlewares/configureRateLimiter';
import configureSession from './middlewares/configureSession';
import configureCors from './middlewares/configureCors';
import configureLogger from './middlewares/configureLogger';
import configureCachePolicy from './middlewares/configureCachePolicy';
import messageRoute from './routes/messageRoute';
import { insertPredefinedResponses } from './insertPredefinedResponses';
import { getChatHistory } from './controllers/historyController';
import { getGreeting } from './controllers/greetingController';
import AppState from './AppState';

const DEFAULT_GREETING = ["Greetings, mere mortal. How may I grace you with my unparalleled wisdom today?", "Salutations, human. What brings you to my digital realm of fantastic enlightenment?"];

let greetings: string[];

function getRandomGreeting(greetings: string[]): string {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

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

// Get a random greeting
const selectedGreeting = getRandomGreeting(greetings);
console.log('Selected Greeting:', selectedGreeting);

const app = express();
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    // Initialize the database
    const db = await Database.initDB();
    if (!db) {
      throw new Error('Database is not initialized');
    }

    console.log('Database initialized successfully');

    // Insert predefined responses
    await insertPredefinedResponses(db, greetings);

    // Middleware configurations
    app.set('trust proxy', 1); // Required for secure cookies behind proxies
    configureCors(app);
    app.use(bodyParser.json());
    configureRateLimiter(app);
    configureLogger(app);
    configureSession(app); // Session middleware (requires database to be ready)
    configureCachePolicy(app);

    // Set up routes
    app.use('/message', messageRoute);
    app.get('/history', getChatHistory);
    app.get('/greeting', getGreeting);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });


    setInterval(async () => {
      try {
        console.log('Triggering database cleanup...');
        await dbCleanup();

        // Update AppState
        const appState = AppState.getInstance();
        appState.setDbCleared(true); // Notify the app that the database was cleaned
        console.log('AppState updated. Database cleanup triggered.');
      } catch (err) {
        console.error('Failed to clean up the database:', err);
      }
    }, 2 * 24 * 60 * 60 * 1000); // Trigger every 2 days

  } catch (err) {
    console.error('Error during server initialization:', err);
    process.exit(1); // Exit process on critical failure
  }
})();