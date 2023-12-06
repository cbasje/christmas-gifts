import prisma from '$lib/server/prisma';
import { auth } from '$lib/server/lucia';
import { groupBy } from '$lib/utils/group-by';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseURL } from '$lib/utils/file';

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const [overviewList, users] = await prisma.$transaction([
		prisma.giftItem.findMany({
			orderBy: { recipient: { hue: 'desc' } },
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
				pic: true,
				purchased: true,
				recipientId: true,
				recipient: {
					select: {
						name: true,
						hue: true
					}
				}
			}
		}),
		prisma.user.findMany({
			where: {
				id: {
					not: user.id
				},
				groups: {
					has: currentGroupId
				}
			},
			orderBy: {
				name: 'asc'
			},
			select: {
				id: true,
				name: true,
				hue: true,
				sizes: true
			}
		})
	]);

	return {
		users,
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
