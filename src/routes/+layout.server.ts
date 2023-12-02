import { defaultLocale, type Locale } from '$lib/translations';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const locale = (cookies.get('locale') ?? defaultLocale) as Locale;

	return {
		locale
	};
}) satisfies LayoutServerLoad;
