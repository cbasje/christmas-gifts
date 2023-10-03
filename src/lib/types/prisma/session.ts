import * as z from 'zod';
import { type CompleteUser, RelatedUserSchema } from './index';

export const SessionSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	active_expires: z.bigint(),
	idle_expires: z.bigint()
});

export interface CompleteSession extends z.infer<typeof SessionSchema> {
	user: CompleteUser;
}

/**
 * RelatedSessionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSessionSchema: z.ZodSchema<CompleteSession> = z.lazy(() =>
	SessionSchema.extend({
		user: RelatedUserSchema
	})
);
