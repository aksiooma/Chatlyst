import { Request, Response } from 'express';
import Database from '../database';


export async function getChatHistory(req: Request, res: Response) {
  const db = Database.getInstance();
  if (!db) {
    return res.status(500).send('Database not initialized');
  }

  try {
    db.all('SELECT role, content FROM messages WHERE session_id = ? ORDER BY timestamp ASC', [req.sessionID], (err: any, rows: any) => {
      if (err) {
        console.error("Error fetching chat history:", err);
        return res.status(500).send('Internal Server Error');
      }
      res.json(rows);
    });
  } catch (error) {
    console.error("Unexpected error fetching chat history:", error);
    return res.status(500).send('Internal Server Error');
  }
}
