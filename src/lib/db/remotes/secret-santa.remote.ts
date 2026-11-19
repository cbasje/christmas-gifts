import { form, getRequestEvent, query } from '$app/server';
import { db } from '#lib/server/drizzle.js';
import { m } from '#lib/paraglide/messages.js';
import { SecretSanta } from '#lib/utils/secret-santa.js';
import { error, invalid } from '@sveltejs/kit';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import z from 'zod';
import { families, familyUsers, secretSantaAssignments, users } from '../schema/user';

const currentSeason = () => new Date().getFullYear();

/** The season the draw is currently active for: max(stored, current year). */
async function getActiveSeason(family: number) {
	const [familyRow] = await db
		.select({ season: families.secretSantaSeason })
		.from(families)
		.where(eq(families.id, family));

	return Math.max(familyRow?.season ?? 0, currentSeason());
}

/** The caller must be signed in and a member of the family in their cookie. */
async function requireFamily() {
	const { cookies } = getRequestEvent();
	const family = Number(cookies.get('family'));
	const user = cookies.get('user');

	if (!Number.isInteger(family) || !user) error(401);

	const [membership] = await db
		.select({ family: familyUsers.family })
		.from(familyUsers)
		.where(and(eq(familyUsers.family, family), eq(familyUsers.user, user)));
	if (!membership) error(401);

	return { family, user };
}

export const getAssignment = query(async () => {
	const { family, user } = await requireFamily();
	const season = await getActiveSeason(family);

	const [assignment] = await db
		.select(getTableColumns(users))
		.from(secretSantaAssignments)
		.innerJoin(users, eq(users.id, secretSantaAssignments.receiver))
		.where(
			and(
				eq(secretSantaAssignments.family, family),
				eq(secretSantaAssignments.giver, user),
				eq(secretSantaAssignments.season, season)
			)
		);

	// Is the draw for this season already made?
	const [drawn] = await db
		.select({ giver: secretSantaAssignments.giver })
		.from(secretSantaAssignments)
		.where(
			and(
				eq(secretSantaAssignments.family, family),
				eq(secretSantaAssignments.season, season)
			)
		)
		.limit(1);

	return { season, drawn: Boolean(drawn), assignment };
});

export const generateList = form(
	z.object({
		// The people this season's draw should include (checked in the form).
		// Exclusions are intentionally not persisted — this is a one-shot draw.
		participants: z.array(z.string()),
	}),
	async (data) => {
		const { family } = await requireFamily();

		const [familyRow] = await db
			.select({ enabled: families.enableSecretSanta })
			.from(families)
			.where(eq(families.id, family));
		if (!familyRow?.enabled) invalid(m.secret_santa_disabled());

		const season = await getActiveSeason(family);

		// Protected: a season that has already been drawn cannot be drawn again.
		// Use "finish season" to archive it and start the next one.
		const [existing] = await db
			.select({ giver: secretSantaAssignments.giver })
			.from(secretSantaAssignments)
			.where(
				and(
					eq(secretSantaAssignments.family, family),
					eq(secretSantaAssignments.season, season)
				)
			)
			.limit(1);
		if (existing) invalid(m.secret_santa_already_drawn());

		if (data.participants.length < 3) invalid(m.secret_santa_too_few());

		// Only actual members of the family can participate; this also catches
		// tampered form data and duplicate ids.
		const players = await db
			.select({ id: users.id, partnerId: users.partnerId })
			.from(users)
			.innerJoin(familyUsers, eq(familyUsers.user, users.id))
			.where(and(eq(familyUsers.family, family), inArray(users.id, data.participants)));
		if (players.length !== new Set(data.participants).size) {
			invalid(m.secret_santa_too_few());
		}

		let assignments;
		try {
			assignments = new SecretSanta(players).generate();
		} catch {
			invalid(m.secret_santa_impossible());
		}

		// Clean up any leftover rows for this season, then insert the fresh draw.
		// No transaction here (the neon-http driver doesn't support them); the
		// unique index on (family, giver, season) guards against duplicates.
		await db
			.delete(secretSantaAssignments)
			.where(
				and(
					eq(secretSantaAssignments.family, family),
					eq(secretSantaAssignments.season, season)
				)
			);

		await db
			.insert(secretSantaAssignments)
			.values(assignments.map((ass) => ({ ...ass, family, season })));

		getAssignment().refresh();
	}
);

export const finishSeason = form(async () => {
	const { family } = await requireFamily();
	const season = await getActiveSeason(family);

	// Only a season that has actually been drawn can be finished
	const [drawn] = await db
		.select({ giver: secretSantaAssignments.giver })
		.from(secretSantaAssignments)
		.where(
			and(
				eq(secretSantaAssignments.family, family),
				eq(secretSantaAssignments.season, season)
			)
		)
		.limit(1);
	if (!drawn) invalid(m.secret_santa_not_drawn());

	await db
		.update(families)
		.set({ secretSantaSeason: season + 1 })
		.where(eq(families.id, family));

	getAssignment().refresh();
});

/** All family members, so the page can render the participation checkboxes. */
export const getDrawMembers = query(async () => {
	const { family } = await requireFamily();
	const season = await getActiveSeason(family);

	const members = await db
		.select({ id: users.id, name: users.name })
		.from(users)
		.innerJoin(familyUsers, eq(familyUsers.user, users.id))
		.where(eq(familyUsers.family, family))
		.orderBy(users.name);

	return { season, members };
});
