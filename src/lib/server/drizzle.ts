import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL ?? '';

// This will run migrations on the database, skipping the ones already applied
// for migrations
const migrationClient = postgres(connectionString, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: './drizzle/migrations' });

// Disable prefetch as it is not supported for "Transaction" pool mode
export const queryClient = postgres(connectionString, { prepare: false });
export const db = drizzle(queryClient);
