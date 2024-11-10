import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { auth } from '$lib/server/lucia';
import { verifyPasswordHash } from '$lib/server/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

// TODO: drizzle-zod
const schema = z.object({
	username: z.string().min(1).max(255).toLowerCase(),
	password: z.string().min(6).max(255),
});

export const load = (async ({ locals, url, cookies }) => {
	if (locals.user) redirect(302, '/');

	const userId = url.searchParams.get('user_id');
	if (userId) {
		// find user by username
		const [existingUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

		const session = await auth.createSession(existingUser.id, {
			group: existingUser.groups?.at(0) ?? 'HAUGEN',
		});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		// redirect to /
		redirect(302, '/');
	}

	const form = await superValidate(zod(schema));

	return {
		form,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));

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
			const isValidPassword = await verifyPasswordHash(
				existingUser?.hashedPassword ?? '',
				form.data.password,
			);

			if (!existingUser) {
				return setError(form, 'username', 'Incorrect username');
			}
			if (!isValidPassword) {
				return setError(form, 'password', 'Incorrect password');
			}

			const session = await auth.createSession(existingUser.id, {
				group: existingUser.groups?.at(0) ?? 'HAUGEN',
			});
			const sessionCookie = auth.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		} catch (error_) {
			const { message } = error_ instanceof Error ? error_ : { message: 'Internal error!' };
			console.error(message);
			return setError(form, 'username', message);
		}

		redirect(302, '/');
	},
} satisfies Actions;
