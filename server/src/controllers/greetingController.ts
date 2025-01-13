import { Request, Response } from 'express';
import Database from '../database';
import AppState from '../AppState';

export async function getGreeting(req: Request, res: Response) {
  const db = Database.getInstance();
  const appState = AppState.getInstance();

  if (appState.isDbCleared()) {
    console.log('Database was cleared. Resetting session greeting.');
    delete (req.session as any).greeting;
    appState.setDbCleared(false); // Reset the flag
  }

  if ((req.session as any).greeting) {
    return res.json({ content: (req.session as any).greeting });
  }

  try {
    const result = await db.query('SELECT content FROM greeting_messages ORDER BY RANDOM() LIMIT 1');
    const greetingRow = result.rows[0];

    if (greetingRow && greetingRow.content) {
      (req.session as any).greeting = greetingRow.content;
      res.json({ content: greetingRow.content });
    } else {
      res.status(500).send('No greeting message found.');
    }
  } catch (err) {
    console.error('Error fetching random greeting:', err);
    res.status(500).send('Internal Server Error');
  }
}
