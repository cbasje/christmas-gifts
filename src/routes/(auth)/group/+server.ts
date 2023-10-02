import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ request, locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		throw error(400);
	}

	cookies.set('group_id', id);

	return json({ success: true });
}) satisfies RequestHandler;
