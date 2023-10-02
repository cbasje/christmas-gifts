import type { Group } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	const currentGroupId = cookies.get('group_id') as Group | undefined;
	if (!session || !currentGroupId) throw redirect(302, '/login');

	return {
		user: session.user,
		currentGroupId
	};
}) satisfies LayoutServerLoad;
