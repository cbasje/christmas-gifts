import { authSchema, users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, url, cookies }) => {
	if (locals.user) redirect(302, '/');

	const userId = url.searchParams.get('user_id');
	if (userId) {
		try {
			// find user by username
			const [existingUser] = await db
				.select()
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			const session = await auth.createSession(existingUser.id, {
				group: existingUser.groups?.at(0) ?? 'HAUGEN'
			});
			const sessionCookie = auth.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			// redirect to /
			redirect(302, '/');
		} catch (e) {
			console.error(e);
		}
	}

	const form = await superValidate(zod(authSchema));

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(authSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// find user by username
			const [existingUser] = await db
				.select()
				.from(users)
				.where(eq(users.username, form.data.username))
				.limit(1);

			// validate password
			const isValidPassword = await new Argon2id().verify(
				existingUser?.hashedPassword ?? '',
				form.data.password
			);

			if (!existingUser) {
				return setError(form, 'username', 'Incorrect username');
			}
			if (!isValidPassword) {
				return setError(form, 'password', 'Incorrect password');
			}

			const session = await auth.createSession(existingUser.id, {
				group: existingUser.groups?.at(0) ?? 'HAUGEN'
			});
			const sessionCookie = auth.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error_) {
			const { message } = error_ instanceof Error ? error_ : { message: 'Internal error!' };
			console.error(message);
			return setError(form, 'username', message);
		}

		redirect(302, '/');
	}
} satisfies Actions;
