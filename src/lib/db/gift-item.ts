import { relations } from 'drizzle-orm';
import { boolean, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users, type Group } from './user';

export const giftItems = pgTable('gift_items', {
	id: varchar('id', {
		length: 128
	})
		.$default(() => crypto.randomUUID())
		.primaryKey()
		.unique(),
	name: text('name').notNull(),
	price: text('price'),
	notes: text('notes'),
	recipientId: text('recipient_id').notNull(),
	giftedById: text('gifted_by_id'),
	link: text('link'),
	purchased: boolean('purchased').default(false),
	idea: boolean('idea').default(false),
	ideaLinkId: text('idea_link_id').unique(),
	groups: jsonb('groups').$type<Group[]>(),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt').defaultNow()
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
	ideaLink: one(giftItems, {
		fields: [giftItems.ideaLinkId],
		references: [giftItems.id]
	})
}));

// model GiftItem {
//     id          String  @id @default(uuid()) /// @zod.uuid()
//     name        String
//     price       String? /// @zod.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, { message: "Price must consist of numbers with currency codes." });
//     notes       String?
//     recipient   User    @relation("ReceivingItems", fields: [recipientId], references: [id])
//     recipientId String
//     giftedBy    User?   @relation("GiftingItems", fields: [giftedById], references: [id])
//     giftedById  String?
//     link        String? /// @zod.url()
//     pic         String?
//     purchased   Boolean @default(false)
//     idea        Boolean @default(false)
//     ideaLinkId  String? @unique
//     groups      Group[]

//     createdAt DateTime? @default(now())
//     updatedAt DateTime? @updatedAt
//   }

//   enum Group {
//     BENJAMINS
//     HAUGEN
//   }
