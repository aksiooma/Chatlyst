import { Request, Response } from 'express';
import Database from '../database';

export async function getChatHistory(req: Request, res: Response) {
  const db = Database.getInstance();

  try {
    const result = await db.query(
      'SELECT role, content FROM messages WHERE session_id = $1 ORDER BY timestamp ASC',
      [req.sessionID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).send('Internal Server Error');
  }
}
