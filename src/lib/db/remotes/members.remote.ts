import { error } from '@sveltejs/kit';
import { snakeCase } from 'change-case';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';
import { db } from '#lib/server/drizzle.js';
import { sendInviteEmail } from '#lib/server/email.js';
import { form, getRequestEvent, query } from '$app/server';
import { families, familyUsers, users } from '../schema/user';

/** Members of the currently selected family (for the admin members page). */
export const getFamilyMembers = query(async () => {
	const { cookies } = getRequestEvent();
	const user = cookies.get('user');
	const family = cookies.get('family');
	if (!user || !family) error(401);

	return db
		.select({ id: users.id, name: users.name, username: users.username, email: users.email })
		.from(users)
		.innerJoin(
			familyUsers,
			and(eq(familyUsers.user, users.id), eq(familyUsers.family, Number(family)))
		)
		.orderBy(users.name);
});

/** The current signed-in user, or null when unauthenticated. */
async function currentUser() {
	const { cookies } = getRequestEvent();
	const id = cookies.get('user');
	if (!id) return null;

	const [user] = await db.select(getTableColumns(users)).from(users).where(eq(users.id, id));
	return user ?? null;
}

/**
 * Admin-only: create a member (user + family membership) and email them their
 * sign-in username. The user row is rolled back if the invite email fails, so a
 * broken SMTP setup never leaves a half-created member behind.
 */
export const inviteMember = form(
	z.object({
		name: z.string().trim().min(1),
		email: z.email(),
		family: z.string(),
	}),
	async (data) => {
		const familyId = Number(data.family);

		const admin = await currentUser();
		if (!admin) error(401);
		if (!admin.isAdmin) error(403, 'Only the organizer can invite members');

		// Admins can only invite into families they belong to.
		const [membership] = await db
			.select({ family: familyUsers.family })
			.from(familyUsers)
			.where(and(eq(familyUsers.user, admin.id), eq(familyUsers.family, familyId)));
		if (!membership) error(403, 'You are not a member of that family');

		// Derive a unique username from the display name.
		const base = snakeCase(data.name);
		let username = base;
		for (let suffix = 2; await usernameTaken(username); suffix++)
			username = `${base}-${suffix}`;

		const [family] = await db
			.select({ id: families.id, name: families.name })
			.from(families)
			.where(eq(families.id, familyId));

		const [created] = await db
			.insert(users)
			.values({ name: data.name, username, email: data.email })
			.returning();

		try {
			await db.insert(familyUsers).values({ family: familyId, user: created.id });
			await sendInviteEmail({
				to: data.email,
				name: data.name,
				username,
				familyName: family?.name ?? `#${familyId}`,
				inviterName: admin.name,
				origin: getRequestEvent().url.origin,
			});
		} catch (cause) {
			await db.delete(users).where(eq(users.id, created.id));
			throw cause;
		}

		getFamilyMembers().refresh();
	}
);

async function usernameTaken(username: string) {
	const [existing] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.username, username));
	return Boolean(existing);
}
