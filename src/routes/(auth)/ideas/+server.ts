import prisma from '$lib/server/prisma';
import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const recipientId = url.searchParams.get('recipientId');

	if (!recipientId) {
		throw error(400);
	}

	try {
		const linkItems = await prisma.giftItem.findMany({
			where: {
				recipientId,
				groups: {
					has: session.group
				},
				idea: false
			},
			select: {
				id: true,
				name: true,
				recipient: {
					select: { name: true }
				}
			}
		});

		return json(linkItems);
	} catch (e) {
		console.error(e);
		throw error(500);
	}
}) satisfies RequestHandler;

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
		const updatedItem = await prisma.giftItem.update({
			where: {
				id
			},
			data: {
				purchased
				// FIXME:
				// ideaLink: hasIdeaLink
				// 	? {
				// 			update: {
				// 				purchased
				// 			}
				// 	  }
				// 	: undefined
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
