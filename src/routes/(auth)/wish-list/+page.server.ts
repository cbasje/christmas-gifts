import { giftItems } from '$lib/db/schema/gift-item';
import { Groups } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
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
	notes: z.string().nullish(),
	recipientId: z.string(),
	giftedById: z.string().nullish(),
	link: z.string().url().nullish(),
	idea: z.boolean().default(false),
	groups: z.enum(Groups).array(),
});

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const wishList = await db
		.select({
			id: giftItems.id,
			name: giftItems.name,
			price: giftItems.price,
			notes: giftItems.notes,
			link: giftItems.link,
			recipientId: giftItems.recipientId,
			giftedById: giftItems.giftedById,
			idea: sql<boolean>`FALSE`,
			groups: giftItems.groups,
		})
		.from(giftItems)
		.where(
			and(
				eq(giftItems.recipientId, user.id ?? ''),
				sql<boolean>`${giftItems.groups} ? ${currentGroupId}`,
			),
		);

	const formData = await superValidate(
		{
			recipientId: user.id,
			groups: currentGroupId ? [currentGroupId] : [],
		},
		zod(schema),
	);

	return {
		formData,
		currentUserGroups: user.groups,
		wishList,
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
			const [newItem] = await db.insert(giftItems).values(form.data).returning({
				name: giftItems.name,
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
				.update(giftItems)
				.set({
					name: form.data.name,
					recipientId: form.data.recipientId,
					price: form.data.price,
					giftedById: form.data.giftedById,
					link: form.data.link,
					notes: form.data.notes,
					groups: form.data.groups,
					updatedAt: new Date(),
				})
				.where(eq(giftItems.id, form.data.id))
				.returning({
					name: giftItems.name,
				});

			return { form, editedItem };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
} satisfies Actions;
