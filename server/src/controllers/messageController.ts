//messageController.ts
import axios from "axios";
import { Request, Response } from 'express';
import { sanitizeInput } from '../utils/sanitizeInput';
import logger from "../logger";
import { AssistantMessage, Message, Messages, UserMessage } from "../types/types";
import { Database } from "../database";
import { isAxiosError, isCustomError } from "../utils/errorHandling";

const DEFAULT_SYSTEM_ROLE_PROMPT = "You are an assistant AI that helps the USER.";
const DEFAULT_ASSISTANT_ROLE_PROMPT = "You must be knowledgeable, helpful and deliver your assistance.";
const DEFAULT_USER_ROLE_PROMPT = "USER may ask you for help";

const SystemRolePrompt = process.env.SYSTEM_ROLE_PROMPT || DEFAULT_SYSTEM_ROLE_PROMPT;
const AssistantRolePrompt = process.env.ASSISTANT_ROLE_PROMPT || DEFAULT_ASSISTANT_ROLE_PROMPT;
const UserRolePrompt = process.env.USER_ROLE_PROMPT || DEFAULT_USER_ROLE_PROMPT;

const API_URL = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';


if (!API_URL) {
    throw new Error('API_URL is not defined in environment variables.');
}


export async function sendToChatGPT(messages: Messages) {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: 'gpt-3.5-turbo-16k',
                messages: messages,
                temperature: 0.8,
                top_p: 1,
                frequency_penalty: 2,
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

        // Log the successful request here
        logger.info('Successful request', {
            requestBody: messages,
            responseBody: response.data.choices[0].message.content,
        });
        //Return successful response
        return response.data.choices[0].message.content;
    } catch (error) {
        if (isAxiosError(error)) {
            //TypeScript knows error is of type AxiosError
            console.error(error.response?.data || error.message);
        } else if (isCustomError(error)) {
            //TypeScript knows error is of type CustomError
            console.error(error.message);
        } else {
            console.error("Unknown error:", error);
        }
        throw new Error("Failed to send message to ChatGPT");

    }

}

// Store the messages in DB
export async function storeInDatabase(sessionId: string, userMessage: UserMessage, assistantMessage: AssistantMessage): Promise<void> {
    const db = Database.getInstance();
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

export async function handleMessageRequest(req: Request, res: Response) {
    try {
      const sanitized = sanitizeInput(req.body);
      const { messages, honeypot } = sanitized;
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
        await storeInDatabase(req.sessionID, messages[messages.length - 1].content, chatGPTResponse);

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
  };
