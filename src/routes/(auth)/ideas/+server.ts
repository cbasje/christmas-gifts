import { giftItems } from '$lib/db/schema/gift-item';
import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { error, json, redirect } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import type { LinkItem } from '$lib/types';

export const GET = (async ({ url, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const recipientId = url.searchParams.get('recipientId');

	if (!recipientId) {
		throw error(400);
	}

	try {
		const linkItems = await db
			.select({
				id: giftItems.id,
				name: giftItems.name,
				recipientName: users.name
			})
			.from(giftItems)
			.leftJoin(users, eq(giftItems.recipientId, users.id))
			.where(
				and(
					eq(giftItems.recipientId, recipientId),
					sql<boolean>`${giftItems.groups} ? ${session.group}`,
					eq(giftItems.idea, false)
				)
			);

		return json(linkItems satisfies LinkItem[]);
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
		const updatedItem = await db
			.update(giftItems)
			.set({
				purchased
				// FIXME:
				// ideaLink: hasIdeaLink
				// 	? {
				// 			update: {
				// 				purchased
				// 			}
				// 	  }
				// 	: undefined
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

			.where(eq(giftItems.id, id))
			.returning({
				id: giftItems.id
			});

		return json(removedItem.at(0));
	} catch (e) {
		console.error(e);
		throw error(500);
	}
}) satisfies RequestHandler;
