import { auth } from '$lib/server/lucia';
import { capitaliseString } from '$lib/utils/capitalise';
import { fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

// TODO: drizzle-zod
const schema = z.object({
	username: z.string().nonempty().max(255),
	password: z.string().nonempty().min(6).max(255)
});

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');

	const form = superValidate(schema);

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: form.data.username.toLowerCase(), // unique id when using "username" auth method
					password: form.data.password // hashed by Lucia
				},
				attributes: {
					name: capitaliseString(form.data.username),
					groups: ['HAUGEN', 'BENJAMINS'],
					partner_id: null,
					user_name: form.data.username,
					sizes: { simple: {}, advanced: {} },
					hue: 145
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					group: user.groups.at(0)!
				}
			});

			// Set auth cookie
			locals.auth.setSession(session);
		} catch (e) {
			console.error(e);
			if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
				// check for unique constraint error in user table
				return setError(form, 'username', 'Incorrect username.');
			}
			return fail(500, {
				form
			});
		}
		// redirect to /
		throw redirect(302, '/');
	}
} satisfies Actions;
