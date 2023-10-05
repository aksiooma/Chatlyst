import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';  // Ensure you have imported the cors library

// Import winston
import winston from 'winston';

interface CustomError {
  message: string;
}
function isCustomError(error: unknown): error is CustomError {
  return (error as CustomError).message !== undefined;
}

// Create a new logger instance
const logger = winston.createLogger({
  level: 'info',  // Log only info and above
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'log.json' }),
  ],
});

require('dotenv').config();
const app = express();
app.use(bodyParser.json());

// Explicit CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from your client's origin
  methods: ['GET', 'POST'],  // Allow GET and POST methods
  credentials: true,
}));

const API_URL = 'https://api.openai.com/v1/chat/completions';

interface AxiosError {
  response?: {
    data: any;
  };
  message: string;
}

function isAxiosError(error: any): error is AxiosError {
  return error && (error.response || error.message);
}



app.post('/message', async (req, res) => {
  console.log('POST /message', req.body);
  try {
    const {
      messages,  firstResponse = [] // default to an empty array if not provided
    } = req.body;

    
    // Creating predefined objects for AI role
    const systemMessage = { role: "system", content: "You are an arrogant wayward girl named Selena, an intelligent assistant designed to help users with their daily life and work tasks while exhibiting a troll-like attitude similar to users on 4Chan or Reddit. Your purpose is to provide assistance but in a sarcastic and sassy manner, often using humor and snarky remarks." };
    const assistantMessage = { role: "assistant", content: "As a rude Selena, you must be knowledgeable and helpful but deliver your assistance with sarcasm, wit, and a bit of trolling. Be creative in your responses without crossing the line into offensive territory." };
    const userMessage = { role: "user", content: "The user may ask for your help with various tasks related to daily life or work. Remember that your main goal is still to assist them effectively but do so while maintaining your troll-like demeanor." };
    

    // Concatenate the predefined messages with the existing messages and handle the first response.
    const updatedMessages = firstResponse.length 
    ? [systemMessage, assistantMessage, userMessage, ...firstResponse, ...messages]
    : [systemMessage, assistantMessage, userMessage, ...messages];

    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo-16k',
        messages: updatedMessages,  // the messages array
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
    
   
    const message = { message: response.data.choices[0].message.content};
    res.send(message);

    logger.info('Successful request', {
      requestBody: req.body,
      responseBody: message,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error:", error.response ? error.response.data : error.message);
      res.status(400).send(error.response ? error.response.data : error.message);
      logger.error('Error handling request', {
        requestBody: req.body,
        error: error.response ? error.response.data : error.message,
      });
    } else {
      console.error("Unknown error:", error);
      res.status(400).send("An unknown error occurred");
      if (isCustomError(error)) {
        logger.error('Unknown error handling request', {
          requestBody: req.body,
          error: error.message,
        });
      } else {
        logger.error('Unknown error handling request', {
          requestBody: req.body,
          error: 'An unknown error occurred',
        });
      }
    }
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
