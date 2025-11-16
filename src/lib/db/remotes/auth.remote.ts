import { dev } from '$app/environment';
import { form, getRequestEvent } from '$app/server';
import { db } from '$lib/server/drizzle';
import { redirect } from '@sveltejs/kit';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import z from 'zod';
import { familyUsers, users } from '../schema/user';

export const login = form(
	z.object({
		username: z.string(),
	}),
	async (data, invalid) => {
		const [user] = await db
			.select({
				...getTableColumns(users),
				families: sql<string[]>`jsonb_agg(${familyUsers.family})`,
			})
			.from(users)
			.innerJoin(familyUsers, eq(familyUsers.user, users.id))
			.where(eq(users.username, data.username))
			.groupBy(users.id)
			.limit(1);
		if (!user) {
			invalid(invalid.username('Incorrect username'));
			return;
		}

		const { cookies } = getRequestEvent();

		const timestamp = Date.now() + 365 * 24 * 60 * 60 * 1000;
		cookies.set('user', user.id, {
			path: '/',
			secure: !dev,
			maxAge: timestamp / 1000,
			expires: new Date(timestamp),
		});
		cookies.set('family', user.families.at(0)!, {
			path: '/',
			secure: !dev,
			maxAge: timestamp / 1000,
			expires: new Date(timestamp),
		});

		redirect(302, '/');
	}
);

export const logout = form(async () => {
	const { cookies } = getRequestEvent();
	cookies.delete('user', {
		path: '/',
	});
	cookies.delete('family', {
		path: '/',
	});

	redirect(302, '/login');
});
