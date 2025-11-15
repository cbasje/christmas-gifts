import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	return {
		user: cookies.get('user')!,
		family: Number(cookies.get('family')!),
	};
}) satisfies LayoutServerLoad;
