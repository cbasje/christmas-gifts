import { defaultLocale } from '$lib/translations';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const locale = cookies.get('locale') ?? defaultLocale;

	return {
		locale,
		user: session.user,
		currentGroupId: session.group ?? session.user.groups[0]
	};
}) satisfies LayoutServerLoad;
