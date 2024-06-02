import { dev } from '$app/environment';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle as drizzleNeon, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import postgres from 'pg';

config({ path: '.env' });

export let db: NodePgDatabase | NeonHttpDatabase;
if (dev) {
	const pool = new postgres.Pool({
		connectionString: process.env.DATABASE_URL!
	});
	db = drizzlePg(pool);
} else {
	const sql = neon(process.env.DATABASE_URL!);
	db = drizzleNeon(sql);
}
