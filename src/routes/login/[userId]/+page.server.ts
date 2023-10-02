import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load = (async ({ locals, cookies, params }) => {
	const { userId } = params;
	if (userId) {
		try {
			const user = await auth.getUser(userId);
			const session = await auth.createSession({
				userId: userId,
				attributes: {}
			});

			locals.auth.setSession(session); // set session cookie
			cookies.set('group_id', user.groups[0], {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				maxAge: 60 * 60 * 24 * 365 // one year
			}); // set group cookie
		} catch (e) {
			console.error(e);
			throw error(500);
		}

		// redirect to /
		throw redirect(302, '/');
	}
}) satisfies PageServerLoad;
