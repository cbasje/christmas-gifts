import { command, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/drizzle';
import { parseCurrency } from '$lib/utils/price';
import { error } from '@sveltejs/kit';
import { and, asc, eq, getTableColumns, not } from 'drizzle-orm';
import z from 'zod';
import { familyGifts, gifts } from '../schema/gift-item';
import { users } from '../schema/user';

export const getHome = query(async () => {
	const { cookies } = getRequestEvent();
	const family = cookies.get('family');
	const user = cookies.get('user');

	if (!user || !family) error(401);

	const result = await db
		.select(getTableColumns(gifts))
		.from(gifts)
		.innerJoin(
			familyGifts,
			and(eq(familyGifts.gift, gifts.id), eq(familyGifts.family, Number(family)))
		)
		.innerJoin(users, eq(users.id, gifts.recipientId))
		.where(not(eq(gifts.recipientId, user)))
		.orderBy(users.hue, asc(gifts.createdAt));
	return Object.groupBy(result, ({ recipientId }) => recipientId);
});

export const getWishList = query(async () => {
	const { cookies } = getRequestEvent();
	const family = cookies.get('family');
	const user = cookies.get('user');

	if (!user || !family) error(401);

	const result = await db
		.select(getTableColumns(gifts))
		.from(gifts)
		.innerJoin(
			familyGifts,
			and(eq(familyGifts.gift, gifts.id), eq(familyGifts.family, Number(family)))
		)
		.where(eq(gifts.recipientId, user))
		.orderBy(asc(gifts.createdAt));
	return result;
});

export const addGift = command(
	z.object({
		families: z
			.string()
			.array()
			.transform((f) => f.map(Number)),
		text: z.string(),
		price: z.string().nullish(),
		link: z.string(),
	}),
	async (data) => {
		const { cookies } = getRequestEvent();
		const user = cookies.get('user');

		if (!user) error(401);

		const price = data.price ? parseCurrency(data.price) : undefined;

		const [newGift] = await db
			.insert(gifts)
			.values({
				text: data.text,
				price: price
					? {
							value: price.value,
							currency: price.currency,
							symbol: price.symbol,
						}
					: undefined,
				link: data.link,
				purchased: false,
				recipientId: user,
			})
			.returning();

		await db.insert(familyGifts).values(
			data.families.map((fam) => ({
				family: fam,
				gift: newGift.id,
			}))
		);

		getWishList().refresh();
	}
);

export const editGift = command(
	z.object({
		gift: z.coerce.number(),
		text: z.string(),
		price: z.string().nullish(),
		link: z.string(),
	}),
	async (data) => {
		const price = data.price ? parseCurrency(data.price) : undefined;

		await db
			.update(gifts)
			.set({
				text: data.text,
				price: price
					? {
							value: price.value,
							currency: price.currency,
							symbol: price.symbol,
						}
					: undefined,
				link: data.link,
			})
			.where(eq(gifts.id, data.gift));

		getWishList().refresh();
	}
);

export const removeGift = command(z.number(), async (id) => {
	await db.delete(gifts).where(eq(gifts.id, id));

	getWishList().refresh();
});

export const setGiftPurchased = command(
	z.object({
		gift: z.number(),
		purchased: z.boolean(),
	}),
	async (data) => {
		const { cookies } = getRequestEvent();
		const user = cookies.get('user');

		if (!user) error(401);

		await db
			.update(gifts)
			.set({
				giverId: data.purchased ? user : null,
				purchased: data.purchased,
			})
			.where(eq(gifts.id, data.gift));

		getHome().refresh();
	}
);
