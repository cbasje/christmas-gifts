import type { Locale } from '$lib/translations';
import { jsonb, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

type MaintenanceReason = Record<Locale, string>;

export const maintenance = pgTable('maintenance', {
	id: serial('id').primaryKey().notNull(),
	start: timestamp('start').defaultNow().notNull(),
	end: timestamp('end'),
	reason: jsonb('reason').$type<MaintenanceReason>()
});
