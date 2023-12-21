import { Request, Response } from 'express';
import Database from '../database';

export async function getGreeting(req: Request, res: Response) {
  const db = Database.getInstance();
  if (!db) {
    return res.status(500).send('Database not initialized');
  }

  if ((req.session as any).greeting) {
    return res.json({ content: (req.session as any).greeting });
  }

  try {
    db.all('SELECT content FROM greeting_messages ORDER BY RANDOM() LIMIT 1', [], (err, rows) => {
      if (err) {
        console.error("Error fetching random greeting:", err);
        return res.status(500).send('Internal Server Error');
      }

      const greetingRow = rows[0] as any;
      if (greetingRow && greetingRow.content) {
        (req.session as any).greeting = greetingRow.content;
        res.json({ content: greetingRow.content });
      } else {
        res.status(500).send('Unexpected database result');
      }
    });
  } catch (error) {
    console.error("Unexpected error fetching random greeting:", error);
    return res.status(500).send('Internal Server Error');
  }
}
