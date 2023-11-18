import { loadTranslations } from '$lib/translations';
import type { Load } from '@sveltejs/kit';

export const load = (async ({ url, data }) => {
	const { pathname } = url;
	await loadTranslations(data.locale, pathname);

	return {};
}) satisfies Load;
