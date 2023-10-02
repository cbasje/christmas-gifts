import { loadTranslations, locale } from '$lib/translations';
import type { Load } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	const { pathname } = url;

	const initLocale = locale.get() || 'en';
	await loadTranslations(initLocale, pathname);

	return {};
}) satisfies Load;
