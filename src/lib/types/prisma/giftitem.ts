import * as z from 'zod';
import { Group } from '@prisma/client';
import { type CompleteUser, RelatedUserSchema } from './index';

export const GiftItemSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	price: z
		.string()
		.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
			message: 'Price must consist of numbers with currency codes.'
		})
		.nullish(),
	notes: z.string().nullish(),
	recipientId: z.string(),
	giftedById: z.string().nullish(),
	link: z.string().url().nullish(),
	purchased: z.boolean(),
	idea: z.boolean(),
	ideaLinkId: z.string().nullish(),
	groups: z.nativeEnum(Group).array(),
	createdAt: z.date().nullish(),
	updatedAt: z.date().nullish()
});

export interface CompleteGiftItem extends z.infer<typeof GiftItemSchema> {
	recipient: CompleteUser;
	giftedBy?: CompleteUser | null;
}

/**
 * RelatedGiftItemSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGiftItemSchema: z.ZodSchema<CompleteGiftItem> = z.lazy(() =>
	GiftItemSchema.extend({
		recipient: RelatedUserSchema,
		giftedBy: RelatedUserSchema.nullish()
	})
);
