import { Pool } from "pg";

class Database {
    private static instance: Pool | null = null;
  
    // Initialize the database connection
    static async initDB(): Promise<Pool> {
      if (this.instance) return this.instance;
  
      const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      });
  
      // Test the connection
      try {
        await pool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL');
  
        // Create tables if they don't exist
        await pool.query(`
          CREATE TABLE IF NOT EXISTS greeting_messages (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL
          )
        `);
  
        await pool.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
            content TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await pool.query(`
          CREATE TABLE IF NOT EXISTS session (
            sid VARCHAR NOT NULL PRIMARY KEY,
            sess JSON NOT NULL,
            expire TIMESTAMP(6) NOT NULL
          )
        `);
  
        console.log('Database tables initialized.');
      } catch (err) {
        console.error('Failed to initialize database:', err);
        throw err;
      }
  
      this.instance = pool;
      return pool;
    }
  
    // Get the database instance
    static getInstance(): Pool {
      if (!this.instance) {
        throw new Error('Database has not been initialized. Call initDB() first.');
      }
      return this.instance;
    }
  
    // Close the database connection
    static async closeDB(): Promise<void> {
      if (this.instance) {
        await this.instance.end();
        console.log('Database connection closed.');
        this.instance = null;
      }
    }
  
    // Helper method for running queries
    static async query(queryText: string, params?: any[]): Promise<any> {
      const pool = this.getInstance();
      try {
        const result = await pool.query(queryText, params);
        return result;
      } catch (err) {
        console.error('Database query error:', err);
        throw err;
      }
    }
  }
  
  export default Database;
  