import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/drizzle';
import { giftItems } from '$lib/db/gift-item';
import { and, eq } from 'drizzle-orm';

export const DELETE = (async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		throw error(400);
	}

	try {
		const removedItem = await db
			.delete(giftItems)
			.where(and(eq(giftItems.id, id), eq(giftItems.recipientId, session.user.id)))
			.returning({ id: giftItems.id });

		return json(removedItem.at(0));
	} catch (e) {
		console.error(e);
		throw error(500);
	}
}) satisfies RequestHandler;
