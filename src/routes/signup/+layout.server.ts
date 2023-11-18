import { defaultLocale } from '$lib/translations';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const locale = cookies.get('locale') ?? defaultLocale;

	return {
		locale
	};
}) satisfies LayoutServerLoad;
