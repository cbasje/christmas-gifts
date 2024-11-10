import { users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { auth } from '$lib/server/lucia';
import { hashPassword } from '$lib/server/password';
import { capitaliseString } from '$lib/utils/capitalise';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

// TODO: drizzle-zod
const schema = z.object({
	username: z.string().min(1).max(255).toLowerCase(),
	password: z.string().min(6).max(255),
});

export const load = (async ({ locals }) => {
	if (locals.session) redirect(302, '/');

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
			const userId = generateId(15);
			const hashedPassword = await hashPassword(form.data.password);

			const [existingUser] = await db
				.select()
				.from(users)
				.where(eq(users.username, form.data.username))
				.limit(1);
			if (existingUser) {
				return setError(form, 'username', 'Username is already in use');
			}

			const [createdUser] = await db
				.insert(users)
				.values({
					id: userId,
					username: form.data.username.toLowerCase(),
					hashedPassword,
					name: capitaliseString(form.data.username),
					partnerId: null,
					groups: ['HAUGEN', 'BENJAMINS'],
					sizes: { simple: {}, advanced: {} },
					hue: 145,
					updatedAt: new Date(),
				})
				.returning();

			const session = await auth.createSession(userId, {
				group: createdUser.groups?.at(0) ?? 'HAUGEN',
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
