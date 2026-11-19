import { error } from '@sveltejs/kit';
import { and, eq, getTableColumns, inArray, not } from 'drizzle-orm';
import z from 'zod';
import { db } from '#lib/server/drizzle.js';
import { dev } from '$app/env';
import { form, getRequestEvent, query } from '$app/server';
import { families, familyUsers, users } from '../schema/user';

export const getUser = query.batch(z.string(), async (id) => {
	const result = await db.select().from(users).where(inArray(users.id, id));
	const lookup = new Map(result.map((u) => [u.id, u]));
	return (id) => lookup.get(id);
});

/** The signed-in user, so the menu can show admin-only links. */
export const getCurrentUser = query(async () => {
	const { cookies } = getRequestEvent();
	const user = cookies.get('user');
	if (!user) error(401);

	const [me] = await db
		.select({ id: users.id, name: users.name, isAdmin: users.isAdmin })
		.from(users)
		.where(eq(users.id, user));
	if (!me) error(401);

	return me;
});

export const getAllUsers = query(z.number().optional(), async (familyId) => {
	const { cookies } = getRequestEvent();
	const family = cookies.get('family');
	const user = cookies.get('user');

	if (!user || !family) error(401);

	const result = await db
		.select(getTableColumns(users))
		.from(users)
		.innerJoin(
			familyUsers,
			and(
				not(eq(familyUsers.user, user)),
				eq(familyUsers.user, users.id),
				eq(familyUsers.family, familyId || Number(family))
			)
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

		const maxAge = 365 * 24 * 60 * 60; // one year, in seconds
		const expires = new Date(Date.now() + maxAge * 1000);
		cookies.set('family', data.family, {
			path: '/',
			secure: !dev,
			maxAge,
			expires,
		});
		return data.family;
	}
);

export const updateSizes = form(
	z.object({
		simple_top: z.string().optional(),
		simple_bottom: z.string().optional(),
		simple_shoe: z.string().optional(),
		advanced_head: z.string().optional(),
		advanced_sleeve: z.string().optional(),
		advanced_chest: z.string().optional(),
		advanced_waist: z.string().optional(),
		advanced_hip: z.string().optional(),
		advanced_inseam: z.string().optional(),
	}),
	async (data) => {
		const { cookies } = getRequestEvent();
		const user = cookies.get('user');
		if (!user) error(401);

		await db
			.update(users)
			.set({
				sizes: {
					simple: {
						top: data.simple_top || undefined,
						bottom: data.simple_bottom || undefined,
						shoe: data.simple_shoe || undefined,
					},
					advanced: {
						head: data.advanced_head || undefined,
						sleeve: data.advanced_sleeve || undefined,
						chest: data.advanced_chest || undefined,
						waist: data.advanced_waist || undefined,
						hip: data.advanced_hip || undefined,
						inseam: data.advanced_inseam || undefined,
					},
				},
			})
			.where(eq(users.id, user));

		getUser(user).refresh();
	}
);
