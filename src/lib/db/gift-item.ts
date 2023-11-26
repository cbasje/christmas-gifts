import { relations } from 'drizzle-orm';
import { boolean, customType, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users, type Group } from './user';

const customJsonb = <TData>(name: string) =>
	customType<{ data: TData; driverData: string }>({
		dataType() {
			return 'jsonb';
		},
		// FIXME:
		toDriver(value: TData) {
			return value;
		}
	})(name);

export const giftItems = pgTable('gift_items', {
	id: varchar('id', {
		length: 128
	})
		.$default(() => crypto.randomUUID())
		.primaryKey(),
	name: text('name').notNull(),
	price: text('price'),
	notes: text('notes'),
	recipientId: text('recipient_id').notNull(),
	giftedById: text('gifted_by_id'),
	link: text('link'),
	pic: text('pic'),
	purchased: boolean('purchased').default(false),
	idea: boolean('idea').default(false),
	ideaLinkId: text('idea_link_id'),
	groups: customJsonb('groups').$type<Group[]>(),
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
	ideaLink: one(giftItems, {
		fields: [giftItems.ideaLinkId],
		references: [giftItems.id]
	})
}));

export const selectGiftItemSchema = createSelectSchema(giftItems);
export type SelectGiftItem = typeof giftItems.$inferSelect;

export const insertGiftItemSchema = createInsertSchema(giftItems, {
	id: (schema) => schema.id.uuid(),
	price: (schema) =>
		schema.price.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
			message: 'Price must consist of numbers with currency codes.'
		}),
	link: (schema) => schema.link.url()
}).pick({ id: true });
export type InsertGiftItem = typeof giftItems.$inferInsert;

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
