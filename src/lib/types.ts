import type { Prisma, GiftItem as PrismaGiftItem, User as PrismaUser } from '@prisma/client';
import { z } from 'zod';

export type OverviewGiftItem = Omit<PrismaGiftItem, 'createdAt' | 'updatedAt'>;
export type WishListGiftItem = Omit<
	PrismaGiftItem,
	'createdAt' | 'updatedAt' | 'giftedById' | 'purchased'
>;
export type GiftItem = OverviewGiftItem | WishListGiftItem;
export type NewGiftItem = Omit<PrismaGiftItem, 'id' | 'createdAt' | 'updatedAt'>;
export type EditGiftItem = Omit<PrismaGiftItem, 'createdAt' | 'updatedAt' | 'giftedById'>;

export type User = PrismaUser;
export type NewUser = Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'> & {
	groups: Group[];
};

export const Groups = ['BENJAMINS', 'HAUGEN'] as const;
export type Group = (typeof Groups)[number];

export interface Sizes extends Prisma.JsonObject {
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
