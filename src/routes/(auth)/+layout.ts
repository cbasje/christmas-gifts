import { loadTranslations, locale } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, data }) => {
	const { pathname } = url;

	const initLocale = locale.get() || 'en';
	await loadTranslations(initLocale, pathname);

	return { ...data };
}) satisfies LayoutLoad;
