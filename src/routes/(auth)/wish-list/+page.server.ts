import prisma from '$lib/server/prisma';
import { auth } from '$lib/server/lucia';
import { Group } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	id: z.string().uuid().optional(),
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
	// purchased: z.boolean(),
	idea: z.boolean().default(false),
	ideaLinkId: z.string().nullish(),
	groups: z.nativeEnum(Group).array()
});

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const wishList = await prisma.giftItem.findMany({
		where: {
			recipientId: user.id,
			groups: {
				has: currentGroupId
			},
			idea: false
		},
		select: {
			id: true,
			name: true,
			price: true,
			notes: true,
			link: true,
			purchased: false,
			recipientId: true,
			giftedById: true,
			idea: true,
			ideaLinkId: true,
			groups: true
		}
	});

	const schemaWithDefaults = schema.merge(
		z.object({
			recipientId: z.string().default(user.id),
			groups: z.nativeEnum(Group).array().default([currentGroupId])
		})
	);
	const formData = await superValidate(schemaWithDefaults);

	return {
		formData,
		currentUserGroups: user.groups,
		wishList
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

		const form = await superValidate(request, schema);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const newItem = await prisma.giftItem.create({
				data: {
					...form.data
				},
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

		const form = await superValidate(request, schema);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const editedItem = await prisma.giftItem.update({
				where: {
					id: form.data.id
				},
				data: {
					...form.data
				},
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
