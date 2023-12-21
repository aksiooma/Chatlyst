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

export interface AxiosError {
  response?: {
    data: any;
    status?: number;
    headers?: any;
    [key: string]: any; 
  };
  message: string;
}


export interface CustomError {
  message: string;
}

export interface GreetingRow {
  content: string;
}