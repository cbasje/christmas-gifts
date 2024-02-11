import { giftItems, ideas } from '$lib/db/schema/gift-item';
import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { error, json, redirect } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import type { LinkItem } from '$lib/types';

export const GET = (async ({ url, locals }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');

	const recipientId = url.searchParams.get('recipientId');

	if (!recipientId) {
		error(400);
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
					sql<boolean>`${giftItems.groups} ? ${session.group}`
				)
			);

		return json(linkItems satisfies LinkItem[]);
	} catch (e) {
		console.error(e);
		error(500);
	}
}) satisfies RequestHandler;

export const PATCH = (async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');

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
		const updatedItem = await db.transaction(async (tx) => {
			const [idea] = await tx
				.update(ideas)
				.set({
					purchased,
					updatedAt: new Date()
				})
				.where(eq(ideas.id, id))
				.returning({
					id: ideas.id,
					purchased: ideas.purchased,
					giftedById: ideas.giftedById,
					giftItemId: ideas.giftItemId
				});

			if (idea.giftItemId) {
				await tx
					.update(giftItems)
					.set({
						purchased,
						giftedById: purchased ? session.user.id : null,
						updatedAt: new Date()
					})
					.where(eq(giftItems.id, idea.giftItemId));
			}

			return idea;
		});

		return json(updatedItem);
	} catch (e) {
		console.error(e);
		error(500);
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');

	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		error(400);
	}

	try {
		const [removedItem] = await db
			.delete(giftItems)

			.where(eq(giftItems.id, id))
			.returning({
				id: giftItems.id
			});

		return json(removedItem);
	} catch (e) {
		console.error(e);
		error(500);
	}
}) satisfies RequestHandler;
