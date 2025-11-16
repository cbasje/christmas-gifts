import { index, integer, jsonb, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core';
import type { UserSizes } from '../models';
import { createdAt, updatedAt } from './timestamp-columns';

export const users = pgTable(
	'users',
	{
		id: text().primaryKey(),
		name: text().notNull(),
		username: text('user_name').notNull().unique(),
		partnerId: text('partner_id'),
		hue: integer().default(145).notNull(),
		sizes: jsonb().$type<UserSizes>(),
		createdAt,
		updatedAt,
	},
	(table) => ({
		usernameIdx: index().on(table.username),
	})
);

export const families = pgTable(
	'families',
	{
		id: serial().primaryKey(),
		name: text(),
		slug: text().unique(),
	},
	(table) => ({
		slugIdx: index().on(table.slug),
	})
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
		user: text()
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
	},
	(table) => ({
		key: primaryKey({
			columns: [table.family, table.user],
		}),
	})
);

export const secretSantaAssignments = pgTable('secret_santa_assignments', {
	id: serial().primaryKey(),
	family: integer()
		.notNull()
		.references(() => families.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	giver: text()
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	receiver: text()
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
});
