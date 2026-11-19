import { invalid, redirect } from '@sveltejs/kit';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import z from 'zod';
import { db } from '#lib/server/drizzle.js';
import { dev } from '$app/env';
import { form, getRequestEvent } from '$app/server';
import { familyUsers, users } from '../schema/user';

export const login = form(
	z.object({
		username: z.string(),
	}),
	async (data, issue) => {
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
			invalid(issue.username('Incorrect username'));
		}

		const { cookies } = getRequestEvent();

		const maxAge = 365 * 24 * 60 * 60; // one year, in seconds
		const expires = new Date(Date.now() + maxAge * 1000);
		cookies.set('user', user.id, {
			path: '/',
			secure: !dev,
			maxAge,
			expires,
		});
		cookies.set('family', user.families.at(0)!, {
			path: '/',
			secure: !dev,
			maxAge,
			expires,
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
