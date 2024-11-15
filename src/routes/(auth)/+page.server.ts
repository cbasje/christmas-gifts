import { giftItems } from '$lib/db/schema/gift-item';
import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { groupBy } from '$lib/utils/group-by';
import { and, asc, desc, eq, not, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const overviewList = await db
		.select({
			id: giftItems.id,
			name: giftItems.name,
			price: giftItems.price,
			notes: giftItems.notes,
			link: giftItems.link,
			purchased: giftItems.purchased,
			recipientId: giftItems.recipientId,
		})
		.from(giftItems)
		.leftJoin(users, eq(giftItems.recipientId, users.id))
		.where(
			and(
				not(eq(giftItems.recipientId, user.id)),
				sql<boolean>`${giftItems.groups} ? ${currentGroupId}`,
			),
		)
		.orderBy(desc(users.hue));

	const groupUsers = await db
		.select({
			id: users.id,
			name: users.name,
			hue: users.hue,
			sizes: users.sizes,
		})
		.from(users)
		.where(and(not(eq(users.id, user.id)), sql<boolean>`${users.groups} ? ${currentGroupId}`))
		.orderBy(asc(users.name));

	return {
		users: groupUsers,
		overviewList: groupBy(overviewList, 'recipientId'),
	};
}) satisfies PageServerLoad;
