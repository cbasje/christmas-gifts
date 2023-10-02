import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import type { Group } from '$lib/types';

export const PATCH = (async ({ request, locals, cookies }) => {
	const session = await locals.auth.validate();
	const currentGroupId = cookies.get('group_id') as Group | undefined;
	if (!session || !currentGroupId) throw redirect(302, '/login');

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
		const updatedItem = await prisma.giftItem.update({
			where: {
				id
			},
			data: {
				purchased,
				giftedBy: purchased
					? {
							connect: {
								id: session.user.id
							}
					  }
					: {
							disconnect: true
					  }
				//   FIXME:
				// ideaLink: {
				// 	update: {
				//         data: {}
				//     }
				// }
			},
			select: {
				id: true,
				purchased: true,
				giftedById: true
			}
		});

		return json(updatedItem);
	} catch (e) {
		console.error(e);
		throw error(500);
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals, cookies }) => {
	const session = await locals.auth.validate();
	const currentGroupId = cookies.get('group_id') as Group | undefined;
	if (!session || !currentGroupId) throw redirect(302, '/login');

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
