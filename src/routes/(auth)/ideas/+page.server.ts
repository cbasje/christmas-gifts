import { ideas } from '$lib/db/schema/gift-item';
import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { groupBy } from '$lib/utils/group-by';
import { fail } from '@sveltejs/kit';
import { and, asc, desc, eq, isNotNull, not, or, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

// TODO: drizzle-zod
const schema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	price: z
		.string()
		.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
			message: 'Price must consist of numbers with currency codes.',
		})
		.nullish(),
	recipientId: z.string(),
	giftedById: z.string().nullish(),
	link: z.string().url().nullish(),
	idea: z.boolean().default(true),
	giftItemId: z.string().nullish(),
});

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
			idea: sql<boolean>`TRUE`,
		})
		.from(ideas)
		.leftJoin(users, eq(ideas.recipientId, users.id))
		.where(
			and(
				not(eq(ideas.recipientId, user.id ?? '')),
				isNotNull(ideas.giftedById),
				or(
					eq(ideas.giftedById, user.id ?? ''),
					user.partnerId ? eq(ideas.giftedById, user.partnerId ?? '') : undefined,
				),
			),
		)
		.orderBy(desc(users.hue));

	const groupUsers = await db
		.select({
			id: users.id,
			name: users.name,
			hue: users.hue,
			sizes: users.sizes,
		})
		.from(users)
		.where(
			and(
				not(eq(users.id, user.id ?? '')),
				sql<boolean>`${users.groups} ? ${currentGroupId}`,
			),
		)
		.orderBy(asc(users.name));

	const formData = await superValidate(
		{
			giftedById: user.id,
		},
		zod(schema),
	);

	return {
		formData,
		currentUserGroups: user.groups,
		users: groupUsers,
		ideaList: groupBy(ideaList, 'recipientId'),
	};
}) satisfies PageServerLoad;

export const actions = {
	newItem: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const [newItem] = await db.insert(ideas).values(form.data).returning({
				name: ideas.name,
			});

			return { form, newItem };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
	editItem: async ({ request }) => {
		const form = await superValidate(request, zod(schema));

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const [editedItem] = await db
				.update(ideas)
				.set({
					name: form.data.name,
					recipientId: form.data.recipientId,
					price: form.data.price,
					giftedById: form.data.giftedById,
					link: form.data.link,
					giftItemId: form.data.giftItemId,
					updatedAt: new Date(),
				})
				.where(eq(ideas.id, form.data.id))
				.returning({
					name: ideas.name,
				});

			return { form, editedItem };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
} satisfies Actions;
