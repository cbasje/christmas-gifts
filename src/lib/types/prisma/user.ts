import * as z from 'zod';
import { Group } from '@prisma/client';
import {
	type CompleteGiftItem,
	RelatedGiftItemSchema,
	type CompleteSession,
	RelatedSessionSchema,
	type CompleteKey,
	RelatedKeySchema
} from './index';

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const UserSchema = z.object({
	id: z.string().uuid(),
	name: z.string().nullish(),
	username: z.string(),
	partnerId: z.string().nullish(),
	groups: z.nativeEnum(Group).array(),
	sizes: jsonSchema,
	createdAt: z.date().nullish(),
	updatedAt: z.date().nullish()
});

export interface CompleteUser extends z.infer<typeof UserSchema> {
	items: CompleteGiftItem[];
	giftingItems: CompleteGiftItem[];
	partner?: CompleteUser | null;
	partner2?: CompleteUser | null;
	auth_session: CompleteSession[];
	key: CompleteKey[];
}

/**
 * RelatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() =>
	UserSchema.extend({
		items: RelatedGiftItemSchema.array(),
		giftingItems: RelatedGiftItemSchema.array(),
		partner: RelatedUserSchema.nullish(),
		partner2: RelatedUserSchema.nullish(),
		auth_session: RelatedSessionSchema.array(),
		key: RelatedKeySchema.array()
	})
);
