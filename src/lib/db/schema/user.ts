import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	serial,
	text,
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
		partnerId: text('partner_id'),
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

export const secretSantaAssignments = pgTable('secret_santa_assignments', {
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
});
