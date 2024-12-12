//database.ts
import sqlite3 from 'sqlite3';

export class Database {
  private static instance: sqlite3.Database | null = null;

  static async initDB(): Promise<sqlite3.Database> {
    return new Promise<sqlite3.Database>((resolve, reject) => {
      const database = new sqlite3.Database('/tmp/chathistory.sqlite', (err) => {
        if (err) {
          reject(err);
          return;
        }

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
            reject(runErr);
            return;
          }

          database.run(`
            CREATE TABLE IF NOT EXISTS greeting_messages(
              id INTEGER PRIMARY KEY,
              content TEXT
            )
          `, (greetingErr) => {
            if (greetingErr) {
              reject(greetingErr);
            } else {
              Database.instance = database;
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
