import { relations } from 'drizzle-orm';
import { bigint, integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { giftItems } from './gift-item';

export const Groups = ['BENJAMINS', 'HAUGEN'] as const;
export type Group = (typeof Groups)[number];

export interface Sizes {
	simple?: {
		top?: string;
		bottom?: string;
		shoe?: string;
	};
	advanced?: {
		head?: string;
		sleeve?: string;
		chest?: string;
		waist?: string;
		hip?: string;
		inseam?: string;
	};
}

export const users = pgTable('users', {
	id: varchar('id', {
		length: 15
	}).primaryKey(),
	name: text('name').unique(),
	userName: text('user_name').notNull(),
	partnerId: text('partnerId').unique(),
	groups: jsonb('groups').$type<Group[]>(),
	hue: integer('hue').default(145),
	sizes: jsonb('sizes').$type<Sizes>(),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt').defaultNow()
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

export const sessions = pgTable('sessions', {
	id: varchar('id', {
		length: 128
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15
	})
		.notNull()
		.references(() => users.id),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull(),
	group: text('group').$type<Group>()
});

export const keys = pgTable('keys', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15
	})
		.notNull()
		.references(() => users.id),
	hashedPassword: varchar('hashed_password', {
		length: 255
	})
});

//   model User {
//     id       String  @id @unique @default(uuid()) /// @zod.uuid()
//     name     String? @unique
//     username String

//     items        GiftItem[] @relation("ReceivingItems")
//     giftingItems GiftItem[] @relation("GiftingItems")
//     partner      User?      @relation("Partner", fields: [partnerId], references: [id])
//     partnerId    String?    @unique
//     partner2     User?      @relation("Partner")
//     groups       Group[]
//     hue          Int        @default(145) /// @zod.min(0).max(360)

//     sizes Json?

//     auth_session Session[]
//     key          Key[]

//     createdAt DateTime? @default(now())
//     updatedAt DateTime? @updatedAt
//   }

//   model Session {
//     id             String @id @unique
//     user_id        String
//     active_expires BigInt
//     idle_expires   BigInt
//     user           User   @relation(references: [id], fields: [user_id], onDelete: Cascade)

//     group Group?

//     @@index([user_id])
//   }

//   model Key {
//     id              String  @id @unique
//     hashed_password String?
//     user_id         String
//     user            User    @relation(references: [id], fields: [user_id], onDelete: Cascade)

//     @@index([user_id])
//   }
