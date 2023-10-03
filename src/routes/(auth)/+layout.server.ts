import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	return {
		user: session.user,
		currentGroupId: session.group ?? session.user.groups[0]
	};
}) satisfies LayoutServerLoad;
