//messageController.ts
import axios from "axios";
import { Request, Response } from 'express';
import { sanitizeInput } from '../utils/sanitizeInput';
import logger from "../logger";
import { AssistantMessage, Message, Messages, UserMessage } from "../types/types";
import Database from '../database';
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


export async function sendToChatGPT(messages: Messages): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
         // Update model version when OpenAI deprecates current one
        model: 'gpt-4o-mini',
        messages: messages,
        // Higher value (0.8) allows more creative responses
        temperature: 0.8,
        // Nucleus sampling - controls diversity like temperature
        // Not recommended to use both temperature and top_p
        // Keeping this as fallback if temperature is disabled
        top_p: 1,
        // Penalize repetition  
        frequency_penalty: 2,
        // Penalize missing words
        presence_penalty: 0.5,
        // Maximum tokens to generate 
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info('Successful request', {
      requestBody: messages,
      responseBody: response.data.choices[0].message.content,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else {
      console.error('Unknown error:', error);
    }
    throw new Error('Failed to send message to ChatGPT');
  }
}


// Store the messages in DB
export async function storeInDatabase(
  sessionId: string,
  userMessage: string,
  assistantMessage: string
): Promise<void> {
  const db = Database.getInstance();

  try {
    await db.query(
      'INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'user', userMessage]
    );
    await db.query(
      'INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'assistant', assistantMessage]
    );
    console.log('Messages stored successfully.');
  } catch (err) {
    console.error('Error inserting message into database:', err);
    throw err;
  }
}

export async function handleMessageRequest(req: Request, res: Response) {
  try {
    const sanitized = sanitizeInput(req.body);
    const { messages, honeypot } = sanitized;

    if (honeypot) {
      console.warn('Potential spam detected');
      return res.status(400).json({ success: false, error: 'Spam detected' });
    }

      // Predefined objects for AI role
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

    const updatedMessages: Message[] = [systemMessage, assistantMessage, ...messages];

    const chatGPTResponse = await sendToChatGPT(updatedMessages);

    if (chatGPTResponse) {
      res.json({ message: chatGPTResponse });
      await storeInDatabase(req.sessionID, messages[messages.length - 1].content, chatGPTResponse);
    } else {
      res.status(500).send('Failed to retrieve response from ChatGPT.');
    }
  } catch (error) {
    console.error('Error handling message request:', error);
    res.status(500).send('Internal Server Error');
  }
}