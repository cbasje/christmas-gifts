import { giftItems, insertGiftItemSchema } from '$lib/db/schema/gift-item';
import { db } from '$lib/server/drizzle';
import { getSupabaseURL, uploadFile } from '$lib/utils/file';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid/non-secure';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const wishList = await db
		.select({
			id: giftItems.id,
			name: giftItems.name,
			price: giftItems.price,
			notes: giftItems.notes,
			link: giftItems.link,
			pic: giftItems.pic,
			recipientId: giftItems.recipientId,
			giftedById: giftItems.giftedById,
			idea: sql<boolean>`FALSE`,
			groups: giftItems.groups
		})
		.from(giftItems)
		.where(
			and(
				eq(giftItems.recipientId, user.id ?? ''),
				sql<boolean>`${giftItems.groups} ? ${currentGroupId}`
			)
		);

	const formData = await superValidate(
		{
			recipientId: user.id,
			groups: currentGroupId ? [currentGroupId] : []
		},
		zod(insertGiftItemSchema)
	);

	return {
		data: formData,
		currentUserGroups: user.groups,
		wishList: wishList.map((i) =>
			i.pic
				? {
						...i,
						pic: getSupabaseURL(i.pic)
					}
				: i
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	newItem: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(insertGiftItemSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			let picURL: string | undefined;
			if (form.data.pic) {
				picURL = await uploadFile(form.data.id, form.data.pic);
			}

			await db.insert(giftItems).values({
				id: nanoid(),
				name: form.data.name,
				price: form.data.price,
				notes: form.data.notes,
				recipientId: form.data.recipientId,
				giftedById: form.data.giftedById,
				link: form.data.link,
				pic: picURL,
				groups: form.data.groups
			});

			return withFiles({ form });
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
	editItem: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(insertGiftItemSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			let picURL: string | undefined;
			if (form.data.pic) {
				picURL = await uploadFile(form.data.id, form.data.pic);
			}

			await db
				.update(giftItems)
				.set({
					name: form.data.name,
					price: form.data.price,
					notes: form.data.notes,
					recipientId: form.data.recipientId,
					giftedById: form.data.giftedById,
					link: form.data.link,
					pic: picURL,
					groups: form.data.groups,
					updatedAt: new Date()
				})
				.where(eq(giftItems.id, form.data.id));

			return withFiles({ form });
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	}
} satisfies Actions;
