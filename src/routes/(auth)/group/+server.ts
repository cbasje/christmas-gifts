import type { Group } from '$lib/db/schema/user';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ request, locals }) => {
	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		error(400);
	}

	// TODO: check of dit werkt?
	if (locals.session) locals.session.group = id as Group;

	return json({ success: true });
}) satisfies RequestHandler;
