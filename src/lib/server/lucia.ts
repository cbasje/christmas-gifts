import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

const client = new PrismaClient();

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
	}
});

export type Auth = typeof auth;
