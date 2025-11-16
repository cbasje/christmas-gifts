import { customType, timestamp } from 'drizzle-orm/pg-core';
import z from 'zod';

const schema = z.object({
	value: z.number(),
	currency: z.string(),
	symbol: z.string().optional(),
});

export const currency = customType<{
	data: z.infer<typeof schema>;
	driverData: string;
}>({
	dataType() {
		return 'jsonb';
	},
	toDriver(value) {
		return JSON.stringify(value);
	},
	fromDriver(value) {
		const { data } = schema.safeParse(value);
		return data!;
	},
});

export const createdAt = timestamp('created_at', {
	precision: 3,
	mode: 'date',
})
	.notNull()
	.$default(() => new Date());

export const updatedAt = timestamp('updated_at', {
	precision: 3,
	mode: 'date',
})
	.notNull()
	.$onUpdate(() => new Date());
