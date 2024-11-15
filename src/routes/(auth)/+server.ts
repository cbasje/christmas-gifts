import { giftItems, ideas } from '$lib/db/schema/gift-item';
import { db } from '$lib/server/drizzle';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ request, locals }) => {
	const form = await request.formData();
	const id = form.get('id');
	const purchased = form.get('purchased') === 'true';

	if (
		id === undefined ||
		typeof id !== 'string' ||
		purchased === undefined ||
		typeof purchased !== 'boolean'
	) {
		error(400);
	}

	try {
		const [updatedItem] = await db
			.update(giftItems)
			.set({
				purchased,
				giftedById: purchased ? locals.user?.id : null,
				updatedAt: new Date(),
			})
			.where(eq(giftItems.id, id))
			.returning({
				id: giftItems.id,
				purchased: giftItems.purchased,
				giftedById: giftItems.giftedById,
				ideaId: giftItems.ideaId,
			});

		if (updatedItem.ideaId) {
			await db
				.update(ideas)
				.set({
					purchased,
					updatedAt: new Date(),
				})
				.where(eq(ideas.id, updatedItem.ideaId));
		}

		return json(updatedItem);
	} catch (e) {
		console.error(e);
		error(500);
	}
}) satisfies RequestHandler;
