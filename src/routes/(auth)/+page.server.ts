import { giftItems } from '$lib/db/schema/gift-item';
import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { auth } from '$lib/server/lucia';
import { getSupabaseURL } from '$lib/utils/file';
import { groupBy } from '$lib/utils/group-by';
import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq, not, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const overviewList = await db
		.select({
			id: giftItems.id,
			name: giftItems.name,
			price: giftItems.price,
			notes: giftItems.notes,
			link: giftItems.link,
			pic: giftItems.pic,
			purchased: giftItems.purchased,
			recipientId: giftItems.recipientId,
			recipientName: users.name,
			recipientHue: users.hue
		})
		.from(giftItems)
		.leftJoin(users, eq(users.id, giftItems.recipientId))
		.where(
			and(
				not(eq(giftItems.recipientId, user.id)),
				sql<boolean>`${giftItems.groups} ? ${currentGroupId}`,
				eq(giftItems.idea, false)
			)
		)
		.orderBy(desc(users.hue));

	return {
		user,
		overviewList: groupBy(
			overviewList.map((i) =>
				i.pic
					? {
							...i,
							pic: getSupabaseURL(i.pic)
					  }
					: i
			),
			'recipientId'
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login'); // redirect to login page
	}
} satisfies Actions;
