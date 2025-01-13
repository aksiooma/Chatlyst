import { Pool } from 'pg';

export const insertPredefinedResponses = async (db: Pool, greetings: string[]): Promise<void> => {
  if (!db) {
    throw new Error('Database is not initialized');
  }

  // Use a transaction for bulk inserts
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = 'INSERT INTO greeting_messages (content) VALUES ($1) ON CONFLICT DO NOTHING';

    for (const greeting of greetings) {
      await client.query(insertQuery, [greeting]);
    }

    await client.query('COMMIT');
    console.log('Predefined responses inserted successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting predefined responses:', err);
    throw err; // Re-throw the error to handle it at a higher level
  } finally {
    client.release(); // Release the client back to the pool
  }
};
