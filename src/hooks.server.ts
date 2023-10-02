import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const lang = (async ({ event, resolve }) => {
	const currentLang = event.url.toString().startsWith('/nl') ? 'nl' : 'en';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', currentLang)
	});
}) satisfies Handle;

export const authorization = (async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
}) satisfies Handle;

export const handle = sequence(authorization, lang);
