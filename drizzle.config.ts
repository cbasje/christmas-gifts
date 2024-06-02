import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/db/schema/*',
	out: './drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? ''
	},
	verbose: true,
	strict: true
} satisfies Config;
