// db.ts
import sqlite3 from 'sqlite3';
const sqlite = require('sqlite');
const open = sqlite.open;


const initializeDatabase = async () => {
    const db = await open({
        filename: './chat-history.db',
        driver: sqlite3.Database
    });

    // Create a table for storing messages
    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT,
            content TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    return db;
};

export default initializeDatabase;
