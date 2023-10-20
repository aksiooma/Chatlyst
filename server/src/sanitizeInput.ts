import sanitizeString from './sanitizeString';
import { SanitizedInput, Message, Role } from './types/types';



export function sanitizeInput(rawInput: any): SanitizedInput {
  if (!rawInput || typeof rawInput !== 'object') {
      throw new Error('Invalid input format.');
  }

  const sanitizedMessages: Message[] = [];

  if (Array.isArray(rawInput.messages)) {
      for (let msg of rawInput.messages) {
          if (msg && typeof msg === 'object') {
              sanitizedMessages.push({
                  role: ['user', 'assistant', 'system'].includes(msg.role) ? msg.role : 'user', // Ensure valid role
                  content: sanitizeString(msg.content),
              });
          }
      }
  }

  return {
      messages: sanitizedMessages,
      honeypot: sanitizeString(rawInput.honeypot),
  };
}
