import { maintenance } from '$lib/db/schema/maintenance';
import { db } from '$lib/server/drizzle';
import { error, redirect } from '@sveltejs/kit';
import { desc, gte, isNull, or, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, parent }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const data = await parent();

	const [maintenanceMode] = await db
		.select({
			reason: maintenance.reason,
			end: maintenance.end,
			isOn: or(isNull(maintenance.end), gte(maintenance.end, new Date())) ?? sql<null>`NULL`
		})
		.from(maintenance)
		.orderBy(desc(maintenance.start))
		.limit(1);

	if (maintenanceMode?.isOn)
		throw error(403, {
			message: maintenanceMode.reason ? maintenanceMode.reason[data.locale] : '',
			end: maintenanceMode.end ?? undefined
		});

	return {
		user: session.user,
		currentGroupId: session.group ?? session.user.groups?.at(0)
	};
}) satisfies LayoutServerLoad;
