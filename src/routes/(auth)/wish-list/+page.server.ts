import { giftItems } from '$lib/db/schema/gift-item';
import { Groups } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { auth } from '$lib/server/lucia';
import { getSupabaseURL, isFile, uploadFile } from '$lib/utils/file';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

// TODO: drizzle-zod
const schema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	price: z
		.string()
		.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
			message: 'Price must consist of numbers with currency codes.'
		})
		.nullish(),
	notes: z.string().nullish(),
	recipientId: z.string(),
	giftedById: z.string().nullish(),
	link: z.string().url().nullish(),
	pic: z.string().url().nullish(),
	idea: z.boolean().default(false),
	ideaLinkId: z.string().nullish(),
	groups: z.enum(Groups).array()
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
			pic: giftItems.pic,
			recipientId: giftItems.recipientId,
			giftedById: giftItems.giftedById,
			idea: giftItems.idea,
			ideaLinkId: giftItems.ideaLinkId,
			groups: giftItems.groups
		})
		.from(giftItems)
		.where(
			and(
				eq(giftItems.recipientId, user.id),
				sql<boolean>`${giftItems.groups} ? ${currentGroupId}`,
				eq(giftItems.idea, false)
			)
		);

	const formData = await superValidate(
		{
			recipientId: user.id,
			groups: [currentGroupId]
		},
		schema
	);

	return {
		formData,
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
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login'); // redirect to login page
	},
	newItem: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const formData = await request.formData();
		const form = await superValidate(formData, schema);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			let data: typeof form.data;
			const file = isFile(formData.get('pic'));
			if (file) {
				const pic = await uploadFile(form.data.id, file);
				data = {
					...form.data,
					pic: pic.toString()
				};
			} else {
				data = {
					...form.data
				};
			}

			const newItem = await db
				.insert(giftItems)
				.values({
					...data
				})
				.returning({
					name: giftItems.name
				});

			return { form, newItem: newItem.at(0) };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
	editItem: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const formData = await request.formData();
		const form = await superValidate(formData, schema);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			let data: typeof form.data;
			const file = isFile(formData.get('pic'));
			if (file) {
				const pic = await uploadFile(form.data.id, file);
				data = {
					...form.data,
					pic: pic.toString()
				};
			} else {
				data = {
					...form.data
				};
			}

			const editedItem = await db
				.update(giftItems)
				.set({
					...data
				})
				.where(eq(giftItems.id, form.data.id))
				.returning({
					name: giftItems.name
				});

			return { form, editedItem: editedItem.at(0) };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	}
} satisfies Actions;
