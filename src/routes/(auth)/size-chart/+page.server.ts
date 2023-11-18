import { auth } from '$lib/server/lucia';
import prisma from '$lib/server/prisma';
import { UserSizesSchema } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user } = await parent();

	if (!user) throw error(404, 'Not found');
	const form = await superValidate(user.sizes as Record<string, string> | null, UserSizesSchema);

	return {
		form,
		user
	};
}) satisfies PageServerLoad;

export const actions = {
	updateSizes: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const form = await superValidate(request, UserSizesSchema);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await prisma.user.update({
				where: { id: session.user.id },
				data: {
					sizes: form.data
				}
			});

			return { form };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login'); // redirect to login page
	}
} satisfies Actions;
