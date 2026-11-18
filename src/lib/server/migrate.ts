import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { DATABASE_URL } from '$app/env/private';

// This will run migrations on the database, skipping the ones already applied
// for migrations
const sql = neon(DATABASE_URL);
migrate(drizzle(sql), { migrationsFolder: './drizzle/migrations' });
