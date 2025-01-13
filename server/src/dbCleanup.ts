import Database from './database';
import AppState from './AppState';

export async function dbCleanup(): Promise<void> {
  const db = Database.getInstance();
  const appState = AppState.getInstance(); // Get the singleton instance

  try {
    // Delete all messages
    const query = `DELETE FROM messages RETURNING *`;
    const result = await db.query(query);
    console.log(`Deleted ${result.rowCount} messages.`);

    // Set the dbCleared flag
    appState.setDbCleared(true);
  } catch (err) {
    console.error('Error during database cleanup:', err);
    throw err;
  }
}
