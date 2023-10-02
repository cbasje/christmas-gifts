import prisma from '$lib/prisma';
import { auth } from '$lib/server/lucia';
import { groupBy } from '$lib/utils/group-by';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const overviewList = await prisma.giftItem.findMany({
		where: {
			recipientId: { not: user.id },
			groups: {
				has: currentGroupId
			},
			idea: false
		},
		select: {
			id: true,
			name: true,
			price: true,
			notes: true,
			link: true,
			purchased: true,
			recipientId: true,
			recipient: {
				select: { name: true }
			}
		}
	});

	return {
		user,
		overviewList: groupBy(overviewList, 'recipientId')
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
