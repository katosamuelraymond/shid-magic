import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

// Helper to determine if a real postgres database is configured
export const isDatabaseConfigured = Boolean(connectionString && !connectionString.includes('dummy_placeholder'));

// Create singleton postgres connection client
let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (isDatabaseConfigured && connectionString) {
  // In serverless / edge, max 1 or small pool is recommended; for standard Node server 5-10 is great
  client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  dbInstance = drizzle(client, { schema });
}

export const db = dbInstance;
export { schema };
