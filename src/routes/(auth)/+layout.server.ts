import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, parent }) => {
	const data = await parent();

	const { user, session } = locals;
	if (!user || !session)
		error(401, {
			message: 'Something is wrong!',
		});

	return {
		user,
		currentGroupId: session.group ?? user.groups?.at(0),
	};
}) satisfies LayoutServerLoad;
