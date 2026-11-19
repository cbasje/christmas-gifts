import { command, form, getRequestEvent, query } from '$app/server';
import { db } from '#lib/server/drizzle.js';
import { m } from '#lib/paraglide/messages.js';
import { SecretSanta } from '#lib/utils/secret-santa.js';
import { error, invalid } from '@sveltejs/kit';
import { and, eq, getTableColumns, inArray, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import z from 'zod';
import { families, familyUsers, partners, secretSantaAssignments, users } from '../schema/user';

const partnerUserA = alias(users, 'partner_user_a');
const partnerUserB = alias(users, 'partner_user_b');

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
		.select({ family: familyUsers.family, isAdmin: users.isAdmin })
		.from(familyUsers)
		.innerJoin(users, eq(users.id, familyUsers.user))
		.where(and(eq(familyUsers.family, family), eq(familyUsers.user, user)));
	if (!membership) error(401);

	return { family, user, isAdmin: membership.isAdmin };
}

export const getAssignment = query(async () => {
	const { family, user, isAdmin } = await requireFamily();
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

	return { season, drawn: Boolean(drawn), assignment, isAdmin };
});

export const generateList = form(
	z.object({
		// The people this season's draw should include (checked in the form).
		// Exclusions are intentionally not persisted — this is a one-shot draw.
		participants: z.array(z.string()),
	}),
	async (data) => {
		const { family, isAdmin } = await requireFamily();
		if (!isAdmin) error(403, 'Only the organizer can start the draw');

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
			.select({ id: users.id })
			.from(users)
			.innerJoin(familyUsers, eq(familyUsers.user, users.id))
			.where(and(eq(familyUsers.family, family), inArray(users.id, data.participants)));
		if (players.length !== new Set(data.participants).size) {
			invalid(m.secret_santa_too_few());
		}

		// Partners: symmetric pairs from the partners table, but only pairs where
		// BOTH members are participating count (someone whose partner sits out is
		// effectively single for this draw). Build a per-player list so that even
		// a player in several pairs gets every partner excluded.
		const ids = players.map((p) => p.id);
		const pairs = await db
			.select({ userA: partners.userA, userB: partners.userB })
			.from(partners)
			.where(and(inArray(partners.userA, ids), inArray(partners.userB, ids)));
		const partnerBy = new Map<string, string[]>();
		for (const { userA, userB } of pairs) {
			for (const [a, b] of [
				[userA, userB],
				[userB, userA],
			]) {
				const list = partnerBy.get(a) ?? [];
				list.push(b);
				partnerBy.set(a, list);
			}
		}
		const roster = players.map((p) => ({ id: p.id, excludes: partnerBy.get(p.id) ?? [] }));

		let assignments;
		try {
			assignments = new SecretSanta(roster).generate();
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
	const { family, isAdmin } = await requireFamily();
	if (!isAdmin) error(403, 'Only the organizer can finish the season');

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

/**
 * The family's partner pairs plus all members (for the add-pair form).
 * Admin-only: this backs the dedicated partner management page.
 */
export const getPartners = query(async () => {
	const { family, isAdmin } = await requireFamily();
	if (!isAdmin) error(403, 'Only the organizer can manage partners');

	const members = await db
		.select({ id: users.id, name: users.name })
		.from(users)
		.innerJoin(familyUsers, eq(familyUsers.user, users.id))
		.where(eq(familyUsers.family, family))
		.orderBy(users.name);

	const memberIds = members.map((member) => member.id);
	const pairs = await db
		.select({
			userA: partners.userA,
			userB: partners.userB,
			nameA: partnerUserA.name,
			nameB: partnerUserB.name,
		})
		.from(partners)
		.innerJoin(partnerUserA, eq(partnerUserA.id, partners.userA))
		.innerJoin(partnerUserB, eq(partnerUserB.id, partners.userB))
		.where(and(inArray(partners.userA, memberIds), inArray(partners.userB, memberIds)))
		.orderBy(partnerUserA.name);

	return { members, pairs };
});

export const addPartner = form(
	z.object({
		userA: z.string(),
		userB: z.string(),
	}),
	async (data) => {
		const { family, isAdmin } = await requireFamily();
		if (!isAdmin) error(403, 'Only the organizer can manage partners');

		if (data.userA === data.userB) invalid(m.secret_santa_partner_same());

		// Both people must be members of this family (also catches tampering)
		const members = await db
			.select({ id: users.id })
			.from(users)
			.innerJoin(familyUsers, eq(familyUsers.user, users.id))
			.where(
				and(eq(familyUsers.family, family), inArray(users.id, [data.userA, data.userB]))
			);
		if (members.length !== 2) invalid(m.secret_santa_partner_member());

		// No duplicate pair in either direction
		const [existing] = await db
			.select({ userA: partners.userA })
			.from(partners)
			.where(
				or(
					and(eq(partners.userA, data.userA), eq(partners.userB, data.userB)),
					and(eq(partners.userA, data.userB), eq(partners.userB, data.userA))
				)
			)
			.limit(1);
		if (existing) invalid(m.secret_santa_partner_exists());

		// Store in canonical order (user_a < user_b), as the table CHECK requires
		const [a, b] = [data.userA, data.userB].sort();
		await db.insert(partners).values({ userA: a, userB: b });

		getPartners().refresh();
	}
);

export const removePartner = command(
	z.object({
		userA: z.string(),
		userB: z.string(),
	}),
	async (data) => {
		const { isAdmin } = await requireFamily();
		if (!isAdmin) error(403, 'Only the organizer can manage partners');

		await db
			.delete(partners)
			.where(and(eq(partners.userA, data.userA), eq(partners.userB, data.userB)));

		getPartners().refresh();
	}
);
