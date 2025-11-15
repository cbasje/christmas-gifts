import { command, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/drizzle';
import { error } from '@sveltejs/kit';
import { and, asc, eq, getTableColumns, not } from 'drizzle-orm';
import z from 'zod';
import { ideas } from '../schema/gift-item';
import { users } from '../schema/user';

export const getAllIdeas = query(async () => {
	const { cookies } = getRequestEvent();
	const family = cookies.get('family');
	const user = cookies.get('user');

	if (!user || !family) error(401);

	const result = await db
		.select(getTableColumns(ideas))
		.from(ideas)
		.innerJoin(users, eq(users.id, ideas.recipientId))
		.where(
			and(
				eq(ideas.familyId, Number(family)),
				not(eq(ideas.recipientId, user)),
				eq(ideas.giverId, user)
			)
		)
		.orderBy(users.hue, asc(ideas.createdAt));
	return Object.groupBy(result, ({ recipientId }) => recipientId);
});

export const addIdea = command(
	z.object({
		recipient: z.string(),
		family: z.string().transform(Number),
		text: z.string(),
	}),
	async (data) => {
		const { cookies } = getRequestEvent();
		const user = cookies.get('user');

		if (!user) error(401);

		await db.insert(ideas).values({
			text: data.text,
			familyId: data.family,
			giverId: user,
			recipientId: data.recipient,
		});

		getAllIdeas().refresh();
	}
);

export const editIdea = command(
	z.object({
		idea: z.coerce.number(),
		recipient: z.string(),
		text: z.string(),
	}),
	async (data) => {
		await db
			.update(ideas)
			.set({
				text: data.text,
				recipientId: data.recipient,
			})
			.where(eq(ideas.id, data.idea));

		getAllIdeas().refresh();
	}
);

export const removeIdea = command(z.number(), async (id) => {
	await db.delete(ideas).where(eq(ideas.id, id));

	getAllIdeas().refresh();
});
