import { boolean, index, integer, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core';
import { createdAt, currency, updatedAt } from './custom-columns';
import { families, users } from './user';

export const gifts = pgTable(
	'gift_items',
	{
		id: serial().primaryKey(),
		text: text('name').notNull(),
		price: currency(),
		notes: text(),
		link: text(),
		recipientId: text('recipient_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		giverId: text('gifted_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		ideaId: integer('idea_link_id').references(() => ideas.id, {
			onDelete: 'set null',
			onUpdate: 'set null',
		}),
		purchased: boolean().default(false).notNull(),
		createdAt,
		updatedAt,
	},
	(table) => ({
		recipientIdx: index().on(table.recipientId),
	})
);

export const familyGifts = pgTable(
	'family_gifts',
	{
		family: integer()
			.notNull()
			.references(() => families.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		gift: integer()
			.notNull()
			.references(() => gifts.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
	},
	(table) => ({
		key: primaryKey({
			columns: [table.family, table.gift],
		}),
	})
);

export const ideas = pgTable(
	'ideas',
	{
		id: serial().primaryKey(),
		text: text('name').notNull(),
		link: text(),
		recipientId: text('recipient_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		giverId: text('gifted_by_id').references(() => users.id, {
			onDelete: 'set null',
			onUpdate: 'cascade',
		}),
		familyId: integer('family_id')
			.notNull()
			.references(() => families.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			}),
		createdAt,
		updatedAt,
	},
	(table) => ({
		giverIdx: index().on(table.giverId),
		familyIdx: index().on(table.familyId),
	})
);
