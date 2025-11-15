import { timestamp } from 'drizzle-orm/pg-core';

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
