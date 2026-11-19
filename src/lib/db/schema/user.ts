import { sql } from 'drizzle-orm';
import {
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	serial,
	text,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core';
import type { UserSizes } from '../models';
import { createdAt, updatedAt } from './custom-columns';

export const users = pgTable(
	'users',
	{
		id: uuid().defaultRandom().primaryKey(),
		name: text().notNull(),
		username: text('user_name').notNull().unique(),
		email: text().unique(),
		isAdmin: boolean('is_admin').notNull().default(false),
		hue: integer().default(145).notNull(),
		sizes: jsonb().$type<UserSizes>(),
		createdAt,
		updatedAt,
	},
	(table) => [index().on(table.username)]
);

export const families = pgTable(
	'families',
	{
		id: serial().primaryKey(),
		name: text(),
		slug: text().unique(),
		enableSecretSanta: boolean('secret_santa').notNull().default(false),
		secretSantaSeason: integer('secret_santa_season').notNull().default(0),
	},
	(table) => [index().on(table.slug)]
);

export const familyUsers = pgTable(
	'family_users',
	{
		family: integer()
			.notNull()
			.references(() => families.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		user: uuid()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
	},
	(table) => [
		primaryKey({
			columns: [table.family, table.user],
		}),
	]
);

/**
 * Partner pairs (e.g. couples) for the Secret Santa draw: partners can't pick
 * each other. Symmetric relationship stored as one row per pair — the CHECK
 * forces a canonical order (user_a < user_b) so a pair can't exist twice or in
 * both directions.
 */
export const partners = pgTable(
	'partners',
	{
		userA: uuid('user_a')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		userB: uuid('user_b')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		createdAt,
	},
	(table) => [
		primaryKey({
			columns: [table.userA, table.userB],
		}),
		check('partners_order', sql`${table.userA} < ${table.userB}`),
	]
);

export const secretSantaAssignments = pgTable(
	'secret_santa_assignments',
	{
		id: serial().primaryKey(),
		family: integer()
			.notNull()
			.references(() => families.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		giver: uuid()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		receiver: uuid()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		// Which draw/season this assignment belongs to (e.g. the year).
		// A family can have one draw per season; older seasons stay archived.
		season: integer('season').notNull(),
	},
	(table) => [uniqueIndex().on(table.family, table.giver, table.season)]
);
