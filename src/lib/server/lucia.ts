import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { pool } from './drizzle';

export const auth = lucia({
	adapter: pg(pool, {
		user: 'users',
		key: 'keys',
		session: 'sessions'
	}),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (data) => {
		return {
			id: data.id,
			name: data.name,
			username: data.user_name,
			partnerId: data.partner_id,
			groups: data.groups,
			sizes: data.sizes,
			hue: data.hue
		};
	},
	getSessionAttributes: (data) => {
		return {
			group: data.group
		};
	},
	sessionExpiresIn: {
		activePeriod: 60 * 60 * 24 * 7 * 1000, // one week
		idlePeriod: 60 * 60 * 24 * 182.5 * 1000 // one half year
	}
});

export type Auth = typeof auth;
