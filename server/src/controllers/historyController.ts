import { Request, Response } from 'express';
import Database from '../database';

export async function getChatHistory(req: Request, res: Response) {
  const db = Database.getInstance();

  try {
    console.log('Session ID:', req.sessionID);

    const result = await db.query(
      'SELECT role, content FROM messages WHERE session_id = $1 ORDER BY timestamp ASC',
      [req.sessionID]
    );
    
    console.log('Found messages:', result.rows.length);
    console.log('Messages:', result.rows);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    console.error('Session details:', req.session);
    res.status(500).send('Internal Server Error');
  }
}
