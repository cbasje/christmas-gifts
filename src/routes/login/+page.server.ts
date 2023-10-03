import { auth } from '$lib/server/lucia';
import { error, fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	username: z.string().nonempty().max(255),
	password: z.string().nonempty().min(6).max(255)
});

export const load = (async ({ locals, cookies, url }) => {
	// const session = await locals.auth.validate();
	// if (session) throw redirect(302, '/');

	console.log('🎄 ----------------------🎄');
	console.log('🎄 ~ load:', url.searchParams);
	console.log('🎄 ----------------------🎄');
	const userId = url.searchParams.get('user_id');
	if (userId) {
		try {
			const session = await auth.createSession({
				userId: userId,
				attributes: {}
			});

			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			console.error(e);
			throw error(500);
		}

		// redirect to /
		throw redirect(302, '/');
	}

	const form = superValidate(schema);

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// find user by key
			// and validate password
			const key = await auth.useKey(
				'username',
				form.data.username.toLowerCase(),
				form.data.password
			);

			const user = await auth.getUser(key.userId);
			const session = await auth.createSession({
				userId: key.userId,
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
			if (e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') {
				// user does not exist
				return setError(form, 'username', 'Incorrect username.');
			}
			if (e instanceof LuciaError && e.message === 'AUTH_INVALID_PASSWORD') {
				// invalid password
				return setError(form, 'password', 'Incorrect password.');
			}
			return fail(500, {
				form
			});
		}
		// redirect to /
		throw redirect(302, '/');
	}
} satisfies Actions;
