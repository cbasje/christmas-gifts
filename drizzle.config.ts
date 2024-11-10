import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/db/schema/*',
	out: './drizzle/migrations',
	verbose: true,
	strict: true
});
