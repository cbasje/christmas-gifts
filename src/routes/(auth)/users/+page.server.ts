import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user, currentGroupId } = await parent();

	const users = await prisma.user.findMany({
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
		}
	});

	return {
		users
	};
}) satisfies PageServerLoad;
