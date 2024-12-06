import { Database } from "bun:sqlite";

let db: Database;

// This helper function creates a new database connection
export function getDb() {
  if (!db) {
    db = new Database("todos.db");
    
    // Create the todos table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      )
    `);
  }

  return db;
} 