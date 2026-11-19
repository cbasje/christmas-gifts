import { redirect } from '@sveltejs/kit';
import { type Handle, sequence } from '@sveltejs/kit/hooks';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { familyUsers, users } from '#db/schema/user.js';
import { getTextDirection } from '#lib/paraglide/runtime.js';
import { paraglideMiddleware } from '#lib/paraglide/server.js';
import { db } from '#lib/server/drizzle.js';
import { runMigrations } from '#lib/server/migrate.js';
import { dev } from '$app/env';

let migrationsStarted = false;

const migrationHandle: Handle = async ({ event, resolve }) => {
	if (!migrationsStarted) {
		migrationsStarted = true;
		await runMigrations();
	}
	return resolve(event);
};

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

		const maxAge = 365 * 24 * 60 * 60; // one year, in seconds
		const expires = new Date(Date.now() + maxAge * 1000);
		event.cookies.set('user', user.id, {
			path: '/',
			secure: !dev,
			maxAge,
			expires,
		});
		event.cookies.set('family', user.families.at(0)!, {
			path: '/',
			secure: !dev,
			maxAge,
			expires,
		});

		redirect(302, '/');
	}

	return resolve(event);
}) satisfies Handle;

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		return resolve(
			{ ...event, request: localizedRequest },
			{
				transformPageChunk: ({ html }) => {
					return html
						.replace('%lang%', locale)
						.replace('%dir%', getTextDirection(locale));
				},
			}
		);
	});

export const handle = sequence(migrationHandle, routeHandle, paraglideHandle);
