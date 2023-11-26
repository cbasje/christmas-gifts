import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const connectionString = process.env.DATABASE_URL ?? '';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const queryClient = postgres(connectionString, { prepare: false });
export const db = drizzle(queryClient);
