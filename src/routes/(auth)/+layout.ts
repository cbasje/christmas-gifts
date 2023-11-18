import { loadTranslations } from '$lib/translations';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, data }) => {
	const { pathname } = url;
	await loadTranslations(data.locale, pathname);

	return { ...data };
}) satisfies LayoutLoad;
