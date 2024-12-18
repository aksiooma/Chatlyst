// database.ts
import { Pool, PoolClient } from 'pg';

export class Database {
  private static pool: Pool | null = null;

  static async initDB(): Promise<void> {
    if (!this.pool) {
      console.log("Initializing database connection pool...");
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL, // Heroku provides this
        ssl: {
          rejectUnauthorized: false, // Required for Heroku
        },
      });
    }

    try {
      const client: PoolClient = await this.pool.connect();
      console.log("Connected to PostgreSQL database.");

      // Create messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Messages table created or already exists.");

      // Create greeting_messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS greeting_messages (
          id SERIAL PRIMARY KEY,
          content TEXT
        )
      `);
      console.log("Greeting messages table created or already exists.");

      client.release();
      console.log("Database setup complete.");
    } catch (err) {
      console.error(`An error occurred: ${(err as Error).message}`);
    }
  }

  static async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error("Database not initialized. Call initDB() first.");
    }
    return this.pool.connect();
  }
}

export default Database;
