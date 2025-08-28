import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import * as sqliteSchema from "@shared/sqlite-schema";
import path from 'path';

neonConfig.webSocketConstructor = ws;

// Check if we have a real DATABASE_URL or should use SQLite fallback
const databaseUrl = process.env.DATABASE_URL;
const isPlaceholderUrl = databaseUrl === 'postgresql://user:password@host/database' || !databaseUrl;

let db: any;
let pool: Pool | null = null;

if (isPlaceholderUrl) {
  // Use SQLite for local development
  console.log('📁 Using SQLite database for local development');
  const sqlite = new Database(path.join(process.cwd(), 'local.db'));
  
  // Enable foreign keys and WAL mode for better performance
  sqlite.exec('PRAGMA foreign_keys = ON');
  sqlite.exec('PRAGMA journal_mode = WAL');
  
  db = drizzleSqlite(sqlite, { schema: sqliteSchema });
} else {
  // Use PostgreSQL/Neon for production
  console.log('🐘 Using PostgreSQL database');
  pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
}

export { db, pool };