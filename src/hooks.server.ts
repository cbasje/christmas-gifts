import { auth } from '$lib/server/lucia';
import { defaultLocale, locales } from '$lib/translations';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const lang = (async ({ event, resolve }) => {
	const { headers } = event.request;

	let currentLocale = event.cookies.get('locale');
	if (!currentLocale) {
		const headerLangs = headers.get('accept-language')?.split(/[;,]/g);
		const localeSet = new Set(
			headerLangs
				?.filter((l) => locales.get().includes(l.split('-')[0]))
				.map((l) => l.split('-')[0]),
		);

		currentLocale = [...localeSet][0];
		event.cookies.set('locale', currentLocale, { path: '/' });
		console.log('🗣️', headerLangs, localeSet);
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', currentLocale ?? defaultLocale),
	});
}) satisfies Handle;

function shouldProtectRoute(routeId: string | null) {
	// The group '(auth)' should be protected
	return !routeId || routeId?.startsWith('/(auth)') === true;
}

export const authorization = (async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;

		if (shouldProtectRoute(event.route.id)) redirect(302, '/login');
		else return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);
	if (session?.fresh) {
		const sessionCookie = auth.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}
	if (!session) {
		const sessionCookie = auth.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
}) satisfies Handle;

export const handle = sequence(authorization, lang);
