// SQLite storage implementation (replaces Vercel KV)
// Uses file-based database, no installation required

import Database from 'better-sqlite3';
import path from 'path';

interface KVStorage {
  hset(key: string, fieldValues: { [field: string]: string }): Promise<void>;
  hget(key: string, field: string): Promise<string | null>;
  del(key: string): Promise<void>;
  debug(): void;
}

class SqliteKV implements KVStorage {
  private db: Database.Database;

  constructor() {
    // Create database file in the project root
    const dbPath = path.join(process.cwd(), 'zklogin.db');
    this.db = new Database(dbPath);
    
    // Create table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT NOT NULL,
        field TEXT NOT NULL,
        value TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (key, field)
      )
    `);

    console.log(`[SQLiteKV] Database initialized at: ${dbPath}`);
  }

  async hset(key: string, fieldValues: { [field: string]: any }): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO kv_store (key, field, value, updated_at) 
      VALUES (?, ?, ?, datetime('now'))
    `);

    const transaction = this.db.transaction((entries: [string, string, string][]) => {
      for (const [k, f, v] of entries) {
        stmt.run(k, f, v);
      }
    });

    const entries: [string, string, string][] = Object.entries(fieldValues).map(
      ([field, value]) => [key, field, typeof value === 'string' ? value : JSON.stringify(value)]
    );

    transaction(entries);
    console.log(`[SQLiteKV] Set ${key}:`, fieldValues);
  }

  async hget(key: string, field: string): Promise<any> {
    const stmt = this.db.prepare('SELECT value FROM kv_store WHERE key = ? AND field = ?');
    const result = stmt.get(key, field) as { value: string } | undefined;
    
    if (!result?.value) {
      console.log(`[SQLiteKV] Get ${key}.${field}: null`);
      return null;
    }

    // Try to parse as JSON, fallback to string
    let value: any;
    try {
      value = JSON.parse(result.value);
    } catch {
      value = result.value;
    }
    
    console.log(`[SQLiteKV] Get ${key}.${field}:`, value);
    return value;
  }

  async del(key: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM kv_store WHERE key = ?');
    stmt.run(key);
    console.log(`[SQLiteKV] Deleted ${key}`);
  }

  // Debug method: view all stored data
  debug(): void {
    const stmt = this.db.prepare('SELECT * FROM kv_store ORDER BY key, field');
    const results = stmt.all();
    console.log('[SQLiteKV] Current store:', results);
  }

  // Clean up method
  close(): void {
    this.db.close();
    console.log('[SQLiteKV] Database connection closed');
  }
}

// Create global instance
const sqliteKV = new SqliteKV();

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', () => {
    sqliteKV.close();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    sqliteKV.close();
    process.exit(0);
  });
}

// Export interface compatible with @vercel/kv
export const kv = sqliteKV;
