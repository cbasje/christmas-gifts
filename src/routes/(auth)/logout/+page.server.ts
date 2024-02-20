import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ locals, cookies }) => {
		if (!locals.session) return fail(401);

		await auth.invalidateSession(locals.session.id); // invalidate session
		const sessionCookie = auth.createBlankSessionCookie(); // remove cookie
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/login');
	}
} satisfies Actions;
