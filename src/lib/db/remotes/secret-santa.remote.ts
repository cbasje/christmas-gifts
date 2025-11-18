import { form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/drizzle';
import { SecretSanta } from '$lib/utils/secret-santa';
import { error } from '@sveltejs/kit';
import { eq, and, getTableColumns } from 'drizzle-orm';
import { familyUsers, secretSantaAssignments, users } from '../schema/user';

export const getAssignment = query(async () => {
	const { cookies } = getRequestEvent();
	const family = cookies.get('family');
	const user = cookies.get('user');

	if (!user || !family) error(401);

	const [result] = await db
		.select(getTableColumns(users))
		.from(secretSantaAssignments)
		.innerJoin(users, eq(users.id, secretSantaAssignments.receiver))
		.where(
			and(
				eq(secretSantaAssignments.family, Number(family)),
				eq(secretSantaAssignments.giver, user)
			)
		);
	return result;
});

export const generateList = form(async () => {
	const { cookies } = getRequestEvent();
	const family = cookies.get('family');

	if (!family) error(401);

	const players = await db
		.select({ id: users.id, partnerId: users.partnerId })
		.from(users)
		.innerJoin(familyUsers, eq(familyUsers.user, users.id))
		.where(eq(familyUsers.family, Number(family)));

	const s = new SecretSanta(players);
	const assignments = s.generate();

	await db
		.insert(secretSantaAssignments)
		.values(assignments.map((ass) => ({ ...ass, family: Number(family) })));

	getAssignment().refresh();
});
