import { maintenance } from '$lib/db/schema/maintenance';
import { db } from '$lib/server/drizzle';
import { error } from '@sveltejs/kit';
import { desc, gte, isNull, lte, or, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, parent }) => {
	const data = await parent();

	const [maintenanceMode] = await db
		.select({
			reason: maintenance.reason,
			end: maintenance.end,
			isOn: or(isNull(maintenance.end), gte(maintenance.end, new Date())) ?? sql<null>`NULL`
		})
		.from(maintenance)
		.where(lte(maintenance.start, new Date()))
		.orderBy(desc(maintenance.start))
		.limit(1);

	if (maintenanceMode?.isOn)
		error(403, {
			message: maintenanceMode.reason ? maintenanceMode.reason[data.locale] : '',
			end: maintenanceMode.end ?? undefined
		});

	const { user, session } = locals;
	if (!user || !session)
		error(401, {
			message: 'Something is wrong!'
		});

	return {
		user,
		currentGroupId: session.group ?? user.groups?.at(0)
	};
}) satisfies LayoutServerLoad;
