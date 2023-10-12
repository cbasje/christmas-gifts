import type { Prisma, GiftItem as PrismaGiftItem, User as PrismaUser } from '@prisma/client';

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
