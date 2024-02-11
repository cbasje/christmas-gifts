import { auth } from '$lib/server/lucia';
import { defaultLocale, locales } from '$lib/translations';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const lang = (async ({ event, resolve }) => {
	const { headers } = event.request;

	let currentLocale = event.cookies.get('locale');
	if (!currentLocale) {
		const headerLangs = headers.get('accept-language')?.split(/[;,]/g);
		const localeSet = new Set(
			headerLangs
				?.filter((l) => locales.get().includes(l.split('-')[0]))
				.map((l) => l.split('-')[0])
		);

		currentLocale = [...localeSet][0];
		/* @migration task: add path argument */ event.cookies.set('locale', currentLocale);
		console.log('🗣️', headerLangs, localeSet);
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', currentLocale ?? defaultLocale)
	});
}) satisfies Handle;

export const authorization = (async ({ event, resolve }) => {
	// we can pass `event` because we used the SvelteKit middleware
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
}) satisfies Handle;

export const handle = sequence(authorization, lang);
