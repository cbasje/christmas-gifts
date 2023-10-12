import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import client from './prisma';

export const auth = lucia({
	adapter: prisma(client),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (data) => {
		return {
			id: data.id,
			name: data.name,
			username: data.username,
			partnerId: data.partnerId,
			groups: data.groups,
			sizes: data.sizes
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
