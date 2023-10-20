import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import logger from './logger';
import * as sqlite3 from 'sqlite3';
import { cleanupDatabase } from './dbCleanup';
import { sanitizeInput } from './sanitizeInput'
import { Messages, Message, UserMessage, AssistantMessage } from './types/types';



const rateLimit = require("express-rate-limit");
require('dotenv').config({ path: __dirname + '/../.env' });
const path = require('path');


interface GreetingRow {
  content: string;
}

let db: sqlite3.Database | null = null;


const DEFAULT_GREETING =  ["Greetings, mere mortal. How may I grace you with my unparalleled wisdom today?", "Salutations, human. What brings you to my digital realm of fantastic enlightenment?"];

const DEFAULT_SYSTEM_ROLE_PROMPT = "You are an assistant AI that helps the USER.";
const DEFAULT_ASSISTANT_ROLE_PROMPT = "You must be knowledgeable, helpful and deliver your assistance.";
const DEFAULT_USER_ROLE_PROMPT = "USER may ask you for help";

const SystemRolePrompt = process.env.SYSTEM_ROLE_PROMPT || DEFAULT_SYSTEM_ROLE_PROMPT;
const AssistantRolePrompt = process.env.ASSISTANT_ROLE_PROMPT || DEFAULT_ASSISTANT_ROLE_PROMPT;
const UserRolePrompt = process.env.USER_ROLE_PROMPT || DEFAULT_USER_ROLE_PROMPT;


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

// Initialize the SQLite database
const initDB = async () => {
  return new Promise<sqlite3.Database>((resolve, reject) => {
    const database = new sqlite3.Database('./chathistory.sqlite', (err) => {
      if (err) {
        reject(err);
      } else {
        database.run(`
                    CREATE TABLE IF NOT EXISTS messages(
                      id INTEGER PRIMARY KEY,
                      session_id TEXT NOT NULL,
                      role TEXT NOT NULL,
                      content TEXT NOT NULL,
                      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                  )
              `, (runErr) => {
          if (runErr) {
            reject(runErr);
            return;
          }

          // create greetings table
          database.run(`
                      CREATE TABLE IF NOT EXISTS greeting_messages(
                          id INTEGER PRIMARY KEY,
                          content TEXT
                      )
                  `, (greetingErr) => {
            if (greetingErr) {
              reject(greetingErr);
            } else {
              resolve(database);
            }
          });
        });
      }
    });
  });
};


// Setting an interval to run every 24 hours
setInterval(() => {
  if (db) { // Assume `db` is your initialized sqlite3.Database instance
    cleanupDatabase(db); //db cleanup
  }
}, 24 * 60 * 60 * 1000);

const session = require('express-session');

const app = express();

const cors = require('cors');

const API_URL = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';


// 1. Explicit CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from client's origin
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow GET and POST methods
  credentials: true,
}));

// Use body parser middleware
app.use(bodyParser.json());


// A rate limiter for added SPAM protection
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // limit each IP to 15 requests per window
  message: "Too many requests, please try again later.",
});


//The rate limiter to chatbot /message endpoint for added SPAM protection
app.use("/message", limiter);



//LOGGING
app.use((req, res, next) => {
  const logData = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    requestBody: req.body
  };
  logger.info('Incoming Request', logData);
  next();
});



// 3. Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false  // set this to true if you're using HTTPS
  }
}));




initDB()
  .then(database => {
    db = database;

    if (!db) {
      console.error('Database is not initialized');
      process.exit(1); // or handle it as you see fit
    }

    // Insert the predefined responses now that the database is initialized
    if (db) {
      for (const response of greetings) {
        db.run('INSERT INTO greeting_messages (content) VALUES (?)', [response]);
      }
    }

  })
  .catch(err => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });


if (!sqlite3.Database) {
  console.error('Database is not initialized');
  process.exit(1); // Exit the application or handle this scenario as you see fit
}


// Cache policy for versioned files
const longCache = 'public, max-age=31536000, immutable'; // 1 year

// Cache policy for non-versioned files
const shortCache = 'public, max-age=600'; // 10 minutes

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: (res, path) => {
    if (/\-(?:[a-fA-F\d]{8}|[a-fA-F\d]{13}|[a-fA-F\d]{20})\.(?:css|js|jpg|jpeg|png|webp|svg)$/.test(path)) {
      res.setHeader('Cache-Control', longCache);
    } else {
      res.setHeader('Cache-Control', shortCache);
    }
  }
}));

const PORT = 5173;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


interface AxiosError {
  response?: {
    data: any;
    status?: number;
    headers?: any;
    [key: string]: any;  // Optional, for other potential properties.
  };
  message: string;
}


interface CustomError {
  message: string;
}
function isCustomError(error: unknown): error is CustomError {
  return (error as CustomError).message !== undefined;
}

function isAxiosError(error: any): error is AxiosError {
  return error && typeof error === 'object' && (error.response || error.message);
}


if (!API_URL) {
  throw new Error('API_URL is not defined in environment variables.');
}


async function sendToChatGPT(messages: Messages) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo-16k',
        messages: messages,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: -0.5,
        presence_penalty: 0.5,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Received response from ChatGPT:', response.data.choices[0].message.content);
    // Log the successful request here
    logger.info('Successful request', {
      requestBody: messages, // Assuming the messages array represents the request body.
      responseBody: response.data.choices[0].message.content,
    });
    //Return successful response
    return response.data.choices[0].message.content;
  } catch (error) {
    if (isAxiosError(error)) {
      // Here TypeScript knows error is of type AxiosError
      console.error(error.response?.data || error.message);
    } else if (isCustomError(error)) {
      // Here TypeScript knows error is of type CustomError
      console.error(error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new Error("Failed to send message to ChatGPT");

  }

}

  // Store the messages in DB
async function storeInDatabase(db: sqlite3.Database | null, sessionId: string, userMessage: UserMessage, assistantMessage: AssistantMessage): Promise<void> {
  if (!db) {
    console.error('Database is not initialized');
    return;
  }
  try {
    // Storing the messages
    await db.run('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)', [sessionId, 'user', userMessage]);
    await db.run('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)', [sessionId, 'assistant', assistantMessage]);

  } catch (error) {
    console.error("Error inserting message into database:", error);
  }
}

//Send message to ChatGPT API endpoint
app.post('/message', async (req, res) => {

  try {

    const sanitized = sanitizeInput(req.body);

    const {
      messages, honeypot
    } = sanitized;


    if (honeypot) {
      // Log potential spam attempt
      logger.warn('Potential spam detected', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        requestBody: req.body,
        honeypotValue: honeypot
      });

      // Respond to the bot with a generic error
      return res.status(400).json({
        success: false,
        error: process.env.NODE_ENV === 'development'
          ? 'An error occurred. Please try again later.'
          : 'Spam detected'
      });
    }

    // Creating predefined objects for AI role
    const systemMessage: Message = {
      role: "system",
      content: SystemRolePrompt
    };

    const assistantMessage: Message = {
      role: "assistant",
      content: AssistantRolePrompt
    };
    const userMessage: Message = {
      role: "user",
      content: UserRolePrompt
    };

    // Concatenate the predefined messages with the existing messages
    const updatedMessages = [systemMessage, assistantMessage, userMessage, ...messages];

    try {

      const chatGPTResponse = await sendToChatGPT(updatedMessages);
      if (chatGPTResponse) {

        res.send({ message: chatGPTResponse });
      } else {
        res.status(500).send('Failed to retrieve message from ChatGPT.');
      }
      // Store user's message in SQLite
      await storeInDatabase(db, req.sessionID, messages[messages.length - 1].content, chatGPTResponse);

    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    // First, log the detailed error internally.
    if (isAxiosError(error)) {
      logger.error('Axios error handling request', {
        requestBody: req.body,
        error: error.response ? error.response.data : error.message,
        statusCode: error.response ? error.response.status : 'Unknown'
      });
    } else if (isCustomError(error)) {
      logger.error('Custom error handling request', {
        requestBody: req.body,
        error: error.message,
      });
    } else {
      if (typeof error === 'string') {
        logger.error("Unknown error (string):", { error });
      } else if (error instanceof Error) {
        logger.error("Unknown error (Error object):", { error: error.message });
      } else {
        logger.error("Unknown error (Other type):", { error: JSON.stringify(error) });
      }
    }

    // Then, handle the response to the frontend based on the error type.
    if (isAxiosError(error)) {
      // Return the original status code from the Axios error, but sanitize the message for the frontend.
      res.status(error.response?.status || 500).send("An error occurred while contacting the ChatGPT service.");
    } else if (isCustomError(error)) {
      // Handle custom errors: You might have a more user-friendly message for these.
      res.status(400).send(error.message);
    } else {
      // Handle all other unknown errors generically.
      res.status(400).send("An unknown error occurred");
    }
  }
});


// GET endpoint for fetching chat history
app.get('/history', async (req, res) => {
  // Check if db is null before proceeding
  if (!db) {
    return res.status(500).send('Database not initialized');
  }

  try {
    // Now, TypeScript knows db is not null here, so you can safely use it
    db.all('SELECT role, content FROM messages WHERE session_id = ? ORDER BY timestamp ASC', [req.sessionID], (err, rows) => {
      if (err) {
        console.error("Error fetching chat history:", err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(rows);
      }
    });
  } catch (error) {
    console.error("Unexpected error fetching chat history:", error);
    res.status(500).send('Internal Server Error');
  }
});

// GET endpoint for fetching greeting/first response
app.get('/greeting', async (req, res) => {
  if (!db) {
    return res.status(500).send('Database not initialized');
  }
  console.log("Session ID:", req.sessionID);
  // Check if the greeting already exists in the session.
  if ((req.session as any).greeting) {
    // Send the greeting from the session.
    return res.json({ content: (req.session as any).greeting });
  }

  try {
    db.all('SELECT content FROM greeting_messages ORDER BY RANDOM() LIMIT 1', [], (err, rows) => {
      if (err) {
        console.error("Error fetching random greeting:", err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log("Session ID:", req.sessionID);
      const greetingRow = rows[0] as GreetingRow;
      if (greetingRow && greetingRow.content) {
        (req.session as any).greeting = greetingRow.content;
        res.json({ content: greetingRow.content });
        console.log("Session ID:", req.sessionID);
        console.log("Greeting in Session:", (req.session as any).greeting);
      } else {
        res.status(500).send('Unexpected database result');
      }
    });
  } catch (error) {
    console.error("Unexpected error fetching random greeting:", error);
    res.status(500).send('Internal Server Error');
  }
});
