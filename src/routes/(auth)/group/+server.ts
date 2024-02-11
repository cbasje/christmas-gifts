import type { Group } from '$lib/db/schema/user';
import { auth } from '$lib/server/lucia';
import { error, json, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ request, locals }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');

	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		error(400);
	}

	try {
		await auth.updateSessionAttributes(session.sessionId, {
			group: id as Group
		});
	} catch (e) {
		console.error(e);
		if (e instanceof LuciaError && e.message === `AUTH_INVALID_SESSION_ID`) {
			error(400, {
            				message: e.detail
            			});
		}
		error(500);
	}

	return json({ success: true });
}) satisfies RequestHandler;
