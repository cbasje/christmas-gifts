// import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	schema: ['./src/lib/db/gift-item.ts', './src/lib/db/user.ts'],
	out: './drizzle/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL ?? ''
	},
	verbose: true,
	strict: true
} satisfies Config;
