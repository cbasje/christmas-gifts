import { relations } from 'drizzle-orm';
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users, type Group } from './user';

export const giftItems = pgTable('gift_items', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	price: text('price'),
	notes: text('notes'),
	recipientId: text('recipient_id')
		.notNull()
		.references(() => users.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	giftedById: text('gifted_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	}),
	link: text('link'),
	pic: text('pic'),
	purchased: boolean('purchased').default(false).notNull(),
	ideaId: text('idea_link_id'),
	groups: jsonb('groups').$type<Group[]>(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const giftItemsRelations = relations(giftItems, ({ one }) => ({
	recipient: one(users, {
		fields: [giftItems.recipientId],
		references: [users.id],
		relationName: 'ReceivingItems'
	}),
	giftedBy: one(users, {
		fields: [giftItems.giftedById],
		references: [users.id],
		relationName: 'GiftingItems'
	}),
	ideaLink: one(ideas, {
		fields: [giftItems.ideaId],
		references: [ideas.id]
	})
}));

export const selectGiftItemSchema = createSelectSchema(giftItems);
export type GiftItem = typeof giftItems.$inferSelect;

export const insertGiftItemSchema = createInsertSchema(giftItems, {
	id: (schema) => schema.id.uuid(),
	price: (schema) =>
		schema.price.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
			message: 'Price must consist of numbers with currency codes.'
		}),
	link: (schema) => schema.link.url()
}).pick({ id: true });
export type NewGiftItem = typeof giftItems.$inferInsert;

export const ideas = pgTable('ideas', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	price: text('price'),
	recipientId: text('recipient_id')
		.notNull()
		.references(() => users.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	giftedById: text('gifted_by_id').references(() => users.id, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	}),
	link: text('link'),
	giftItemId: text('gift_item_id').references(() => giftItems.id, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	}),
	purchased: boolean('purchased').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const ideasRelations = relations(ideas, ({ one }) => ({
	recipient: one(users, {
		fields: [ideas.recipientId],
		references: [users.id],
		relationName: 'ReceivingItems'
	}),
	giftedBy: one(users, {
		fields: [ideas.giftedById],
		references: [users.id],
		relationName: 'GiftingItems'
	}),
	ideaLink: one(giftItems, {
		fields: [ideas.giftItemId],
		references: [giftItems.id]
	})
}));

export const selectIdeaSchema = createSelectSchema(ideas);
export type Idea = typeof ideas.$inferSelect;

export const insertIdeaSchema = createInsertSchema(ideas, {
	id: (schema) => schema.id.uuid(),
	price: (schema) =>
		schema.price.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
			message: 'Price must consist of numbers with currency codes.'
		}),
	link: (schema) => schema.link.url()
}).pick({ id: true });
export type NewIdea = typeof ideas.$inferInsert;
