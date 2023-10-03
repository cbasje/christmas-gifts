import prisma from '$lib/prisma';
import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		throw error(400);
	}

	try {
		const removedItem = await prisma.giftItem.delete({
			where: {
				id
			},
			select: {
				id: true
			}
		});

		return json(removedItem);
	} catch (e) {
		console.error(e);
		throw error(500);
	}
}) satisfies RequestHandler;
