export type UserMessage = string;
export type AssistantMessage = string;

export type Role = 'user' | 'assistant' | 'system';

export type Messages = Message[];

export interface Message {
  role: Role;
  content: string;
}

export interface SanitizedInput {
  messages: Message[]; 
  honeypot: string;
}
