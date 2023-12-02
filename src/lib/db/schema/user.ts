import { relations } from 'drizzle-orm';
import { bigint, integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { giftItems } from './gift-item';

export const Groups = ['BENJAMINS', 'HAUGEN'] as const;
export type Group = (typeof Groups)[number];

export const UserSizesSchema = z.object({
	simple: z.object({
		top: z.string().optional(),
		bottom: z.string().optional(),
		shoe: z.string().optional()
	}),
	advanced: z.object({
		head: z.string().optional(),
		sleeve: z.string().optional(),
		chest: z.string().optional(),
		waist: z.string().optional(),
		hip: z.string().optional(),
		inseam: z.string().optional()
	})
});
export type UserSizes = z.infer<typeof UserSizesSchema>;

export const users = pgTable('users', {
	id: text('id').primaryKey().notNull(),
	name: text('name').unique(),
	username: text('user_name').notNull().unique(),
	partnerId: text('partner_id'),
	groups: jsonb('groups').$type<Group[]>(),
	hue: integer('hue').default(145).notNull(),
	sizes: jsonb('sizes').$type<UserSizes>(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const usersRelations = relations(users, ({ one, many }) => ({
	partner: one(users, {
		fields: [users.partnerId],
		references: [users.id]
	}),
	items: many(giftItems, { relationName: 'ReceivingItems' }),
	giftingItems: many(giftItems, { relationName: 'GiftingItems' }),
	authSession: many(sessions),
	key: many(keys)
}));

export const selectUserSchema = createSelectSchema(users);
export type SelectUser = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users, {
	hue: (schema) => schema.id.min(0).max(360)
});
export type InsertUser = typeof users.$inferInsert;

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull(),
	group: text('group').$type<Group>()
});

export const keys = pgTable('keys', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	hashedPassword: varchar('hashed_password', {
		length: 255
	})
});
