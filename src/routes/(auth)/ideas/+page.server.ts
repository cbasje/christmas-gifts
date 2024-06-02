import { ideas, insertIdeaSchema } from '$lib/db/schema/gift-item';
import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { groupBy } from '$lib/utils/group-by';
import { fail } from '@sveltejs/kit';
import { and, asc, desc, eq, isNotNull, not, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid/non-secure';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const ideaList = await db
		.select({
			id: ideas.id,
			name: ideas.name,
			price: ideas.price,
			recipientId: ideas.recipientId,
			giftedById: ideas.giftedById,
			link: ideas.link,
			purchased: ideas.purchased,
			giftItemId: ideas.giftItemId,
			idea: sql<boolean>`TRUE`
		})
		.from(ideas)
		.leftJoin(users, eq(ideas.recipientId, users.id))
		.where(
			and(
				not(eq(ideas.recipientId, user.id ?? '')),
				isNotNull(ideas.giftedById),
				or(
					eq(ideas.giftedById, user.id ?? ''),
					user.partnerId ? eq(ideas.giftedById, user.partnerId ?? '') : undefined
				)
			)
		)
		.orderBy(desc(users.hue));

	const groupUsers = await db
		.select({
			id: users.id,
			name: users.name,
			hue: users.hue,
			sizes: users.sizes
		})
		.from(users)
		.where(
			and(not(eq(users.id, user.id ?? '')), sql<boolean>`${users.groups} ? ${currentGroupId}`)
		)
		.orderBy(asc(users.name));

	const formData = await superValidate(
		{
			giftedById: user.id
		},
		zod(insertIdeaSchema)
	);

	return {
		data: formData,
		currentUserGroups: user.groups,
		users: groupUsers,
		ideaList: groupBy(ideaList, 'recipientId')
	};
}) satisfies PageServerLoad;

export const actions = {
	newItem: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(insertIdeaSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.insert(ideas).values({
				id: nanoid(),
				name: form.data.name,
				price: form.data.price,
				recipientId: form.data.recipientId,
				giftedById: form.data.giftedById,
				link: form.data.link,
				giftItemId: form.data.giftItemId
			});

			return withFiles({ form });
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
	editItem: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(insertIdeaSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db
				.update(ideas)
				.set({
					name: form.data.name,
					price: form.data.price,
					recipientId: form.data.recipientId,
					giftedById: form.data.giftedById,
					link: form.data.link,
					giftItemId: form.data.giftItemId,
					updatedAt: new Date()
				})
				.where(eq(ideas.id, form.data.id));

			return withFiles({ form });
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	}
} satisfies Actions;
