import type { Group } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	const currentGroupId = cookies.get('group_id') as Group | undefined;
	console.log('🎄 ----------------------------🎄');
	console.log('🎄 ~ load ~ cookies:', session, currentGroupId);
	console.log('🎄 ----------------------------🎄');
	if (!session) throw redirect(302, '/login');

	return {
		user: session.user,
		currentGroupId: currentGroupId ?? session.user.groups[0]
	};
}) satisfies LayoutServerLoad;
