import { auth } from '$lib/server/lucia';
import prisma from '$lib/server/prisma';
import supabase from '$lib/server/supabase';
import { getSupabaseURL, isFile, uploadFile } from '$lib/utils/file';
import { groupBy } from '$lib/utils/group-by';
import { Group } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import type { GiftItem } from '$lib/types';

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
	// purchased: z.boolean(),
	idea: z.boolean().default(true),
	ideaLinkId: z.string().nullish(),
	groups: z.nativeEnum(Group).array()
});

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const [ideaList, users] = await prisma.$transaction([
		prisma.giftItem.findMany({
			orderBy: { recipient: { hue: 'desc' } },
			where: {
				recipientId: {
					not: user.id
				},
				groups: {
					has: currentGroupId
				},
				OR: [{ idea: true }, { giftedById: user.id }]
			},
			select: {
				id: true,
				name: true,
				price: true,
				notes: true,
				link: true,
				pic: true,
				purchased: true,
				recipientId: true,
				giftedById: true,
				idea: true,
				ideaLinkId: true,
				groups: true,
				recipient: {
					select: {
						name: true,
						hue: true
					}
				}
			}
		}),
		prisma.user.findMany({
			where: {
				id: {
					not: user.id
				},
				groups: {
					has: currentGroupId
				}
			},
			orderBy: {
				name: 'asc'
			},
			select: {
				id: true,
				name: true
			}
		})
	]);

	const schemaWithDefaults = schema.merge(
		z.object({
			giftedById: z.string().default(user.id).nullish(),
			groups: z.nativeEnum(Group).array().default([currentGroupId])
		})
	);
	const formData = await superValidate(schemaWithDefaults);

	return {
		formData,
		currentUserGroups: user.groups,
		ideaList: groupBy(
			ideaList.map((i) =>
				i.pic
					? {
							...i,
							pic: getSupabaseURL(i.pic)
					  }
					: i
			),
			'recipientId'
		),
		users
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

			const newItem = await prisma.giftItem.create({
				data: { ...data },
				select: {
					name: true
				}
			});

			return { form, newItem };
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

			const editedItem = await prisma.giftItem.update({
				where: {
					id: form.data.id
				},
				data,
				select: {
					name: true
				}
			});

			return { form, editedItem };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	}
} satisfies Actions;
