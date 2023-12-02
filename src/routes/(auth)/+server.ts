import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/drizzle';
import { giftItems } from '$lib/db/schema/gift-item';
import { eq } from 'drizzle-orm';

export const PATCH = (async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const form = await request.formData();
	const id = form.get('id');
	const purchased = form.get('purchased') === 'true';

	if (
		id === undefined ||
		typeof id !== 'string' ||
		purchased === undefined ||
		typeof purchased !== 'boolean'
	) {
		throw error(400);
	}

	try {
		const updatedItem = await db
			.update(giftItems)
			.set({
				purchased,
				giftedById: purchased ? session.user.id : null,
				updatedAt: new Date()
				//   FIXME:
				// ideaLink: {
				// 	update: {
				//         data: {}
				//     }
				// }
			})
			.where(eq(giftItems.id, id))
			.returning({
				id: giftItems.id,
				purchased: giftItems.purchased,
				giftedById: giftItems.giftedById
			});

		return json(updatedItem.at(0));
	} catch (e) {
		console.error(e);
		throw error(500);
	}
}) satisfies RequestHandler;
