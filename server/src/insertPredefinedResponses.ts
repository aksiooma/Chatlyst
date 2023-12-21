//insertPredefinedResponses.ts
import sqlite3 from 'sqlite3';

export const insertPredefinedResponses = (db: sqlite3.Database | null, greetings: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database is not initialized'));
      return;
    }

    const insertGreeting = db.prepare('INSERT INTO greeting_messages (content) VALUES (?)', (err) => {
      if (err) {
        reject(err);
      }
    });

    // Use a transaction for bulk inserts for efficiency
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      for (const response of greetings) {
        insertGreeting.run(response, (err) => {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }
        });
      }

      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK');
          reject(err);
        } else {
          insertGreeting.finalize((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    });
  });
};
