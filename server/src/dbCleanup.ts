import sqlite3 from 'sqlite3';

export const cleanupDatabase = (db: sqlite3.Database): void => {
  db.run("DELETE FROM messages WHERE timestamp < datetime('now', '-7 days')", (err) => {
    if (err) {
      console.error("Failed to delete old messages:", err.message);
    } else {
      console.log("Old messages deleted.");
    }
  });
};
