import { dev } from '$app/environment';
import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/drizzle';
import { error } from '@sveltejs/kit';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import z from 'zod';
import { families, familyUsers, users } from '../schema/user';

export const getUser = query.batch(z.string(), async (id) => {
	const result = await db.select().from(users).where(inArray(users.id, id));
	const lookup = new Map(result.map((u) => [u.id, u]));
	return (id) => lookup.get(id);
});

export const getAllUsers = query(z.number().optional(), async (familyId) => {
	if (!familyId) return;

	const result = await db
		.select(getTableColumns(users))
		.from(users)
		.innerJoin(
			familyUsers,
			and(eq(familyUsers.user, users.id), eq(familyUsers.family, familyId))
		);
	return result;
});

export const getAllFamilies = query(async () => {
	const { cookies } = getRequestEvent();
	const user = cookies.get('user');

	if (!user) error(401);

	const result = await db
		.selectDistinct(getTableColumns(families))
		.from(families)
		.innerJoin(
			familyUsers,
			and(eq(familyUsers.user, user), eq(familyUsers.family, families.id))
		);
	return result;
});

export const updateFamily = form(
	z.object({
		family: z.string(),
	}),
	async (data) => {
		const { cookies } = getRequestEvent();
		cookies.set('family', data.family, {
			path: '/',
			secure: !dev,
		});
		return data.family;
	}
);
