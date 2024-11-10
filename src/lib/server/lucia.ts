import { dev } from '$app/environment';
import { users, type AuthSession, type User, authSessions } from '$lib/db/schema/user';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';
import { db } from './drizzle';

const adapter = new DrizzlePostgreSQLAdapter(db, authSessions, users);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
	sessionExpiresIn: new TimeSpan(6, 'm'),
	getUserAttributes: (data) => {
		return {
			name: data.name,
			username: data.username,
			partnerId: data.partnerId,
			groups: data.groups,
			sizes: data.sizes,
			hue: data.hue,
		};
	},
	getSessionAttributes: (data) => {
		return {
			group: data.group,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: Omit<User, 'id'>;
		DatabaseSessionAttributes: Omit<AuthSession, 'id' | 'expiresAt' | 'userId'>;
	}
}
