import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { connectionString } from './drizzle';

// This will run migrations on the database, skipping the ones already applied
// for migrations
const migrationClient = postgres(connectionString, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: './drizzle/migrations' });
