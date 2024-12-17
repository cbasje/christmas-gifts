import type { Group } from '$lib/db/schema/user';
import { auth } from '$lib/server/lucia';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ request, cookies, locals }) => {
	const form = await request.formData();
	const id = form.get('id');

	if (id === undefined || typeof id !== 'string') {
		error(400);
	}

	// TODO: check of dit werkt?
	if (locals.session) {
		const oldSession = locals.session;
		await auth.invalidateSession(oldSession.id);

		const session = await auth.createSession(oldSession.userId, {
			group: id as Group,
		});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}

	return json({ success: true });
}) satisfies RequestHandler;
