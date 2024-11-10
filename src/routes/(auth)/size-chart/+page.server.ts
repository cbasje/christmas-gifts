import { UserSizesSchema, users } from '$lib/db/schema/user';
import { db } from '$lib/server/drizzle';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { user } = await parent();

	if (!user) error(404, 'Not found');
	const form = await superValidate(user.sizes as Record<string, string> | null, UserSizesSchema);

	return {
		form,
		user,
	};
}) satisfies PageServerLoad;

export const actions = {
	updateSizes: async ({ locals, request }) => {
		const form = await superValidate(request, UserSizesSchema);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db
				.update(users)
				.set({
					sizes: form.data,
					updatedAt: new Date(),
				})
				.where(eq(users.id, locals.user?.id ?? ''));

			return { form };
		} catch (error) {
			console.error(error);
			return fail(500, { form });
		}
	},
} satisfies Actions;
