import { dev } from '$app/environment';
import { familyUsers, users } from '$lib/db/schema/user';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { db } from '$lib/server/drizzle';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { eq, getTableColumns, sql } from 'drizzle-orm';

const routeHandle = (async ({ event, resolve }) => {
	if (event.route.id?.startsWith('/(private)')) {
		const family_id = event.cookies.get('family');
		const user_id = event.cookies.get('user');
		if (!family_id || !user_id) redirect(302, '/login');
	}
	if (event.route.id?.startsWith('/(auth)/login')) {
		const user_id = new URL(event.request.url).searchParams.get('user_id');
		if (!user_id) return resolve(event);

		const [user] = await db
			.select({
				...getTableColumns(users),
				families: sql<string[]>`jsonb_agg(${familyUsers.family})`,
			})
			.from(users)
			.innerJoin(familyUsers, eq(familyUsers.user, users.id))
			.where(eq(users.id, user_id))
			.groupBy(users.id)
			.limit(1);
		if (!user) return resolve(event);

		event.cookies.set('user', user.id, {
			path: '/',
			secure: !dev,
		});
		event.cookies.set('family', user.families.at(0)!, {
			path: '/',
			secure: !dev,
		});

		redirect(302, '/');
	}

	return resolve(event);
}) satisfies Handle;

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			},
		});
	});

export const handle = sequence(routeHandle, paraglideHandle);
