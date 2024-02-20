import { giftItems } from '$lib/db/schema/gift-item';
import { db } from '$lib/server/drizzle';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE = (async ({ request, locals }) => {
	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		error(400);
	}

	try {
		const [removedItem] = await db
			.delete(giftItems)
			.where(and(eq(giftItems.id, id), eq(giftItems.recipientId, locals.user?.id ?? '')))
			.returning({ id: giftItems.id });

		return json(removedItem);
	} catch (e) {
		console.error(e);
		error(500);
	}
}) satisfies RequestHandler;
