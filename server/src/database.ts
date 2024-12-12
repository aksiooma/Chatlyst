//database.ts
import sqlite3 from 'sqlite3';

export class Database {
  private static instance: sqlite3.Database | null = null;

  static async initDB(): Promise<sqlite3.Database> {
    return new Promise<sqlite3.Database>((resolve, reject) => {
      const dbPath = '/tmp/chathistory.sqlite';
      console.log(`Initializing database at: ${dbPath}`);

      const database = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error(`Failed to connect to database at ${dbPath}:`, err.message);
          reject(err);
          return;
        }
        console.log(`Database connected at ${dbPath}`);

        database.run(`
          CREATE TABLE IF NOT EXISTS messages(
            id INTEGER PRIMARY KEY,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (runErr) => {
          if (runErr) {
            console.error('Error creating messages table:', runErr.message);
            reject(runErr);
            return;
          }
          console.log('Messages table created or already exists.');

          database.run(`
            CREATE TABLE IF NOT EXISTS greeting_messages(
              id INTEGER PRIMARY KEY,
              content TEXT
            )
          `, (greetingErr) => {
            if (greetingErr) {
              console.error('Error creating greeting_messages table:', greetingErr.message);
              reject(greetingErr);
            } else {
              Database.instance = database;
              console.log('Database setup complete.');
              resolve(database);
            }
          });
        });
      });
    });
  }


  static getInstance(): sqlite3.Database | null {
    return this.instance;
  }
}


export default Database;
