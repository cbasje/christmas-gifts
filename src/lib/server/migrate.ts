import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { DATABASE_URL } from '$app/env/private';

const sql = neon(DATABASE_URL);

let running: Promise<unknown> | null = null;

/**
 * Applies any pending migrations on startup, skipping the ones already applied.
 * Runs once per server process; callers await the same promise so the first
 * request waits for migrations to finish before touching the database.
 */
export function runMigrations() {
	running ??= migrate(drizzle(sql), { migrationsFolder: './drizzle/migrations' });
	return running;
}