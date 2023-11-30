import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'pg';

export const connectionString = process.env.DATABASE_URL ?? '';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const pool = new postgres.Pool({
	connectionString
});
export const db = drizzle(pool);
// export const queryClient = postgres(connectionString, { prepare: false });
// export const db = drizzle(queryClient);
