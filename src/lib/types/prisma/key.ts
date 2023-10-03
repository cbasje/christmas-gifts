import * as z from 'zod';
import { type CompleteUser, RelatedUserSchema } from './index';

export const KeySchema = z.object({
	id: z.string(),
	hashed_password: z.string().nullish(),
	user_id: z.string()
});

export interface CompleteKey extends z.infer<typeof KeySchema> {
	user: CompleteUser;
}

/**
 * RelatedKeySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedKeySchema: z.ZodSchema<CompleteKey> = z.lazy(() =>
	KeySchema.extend({
		user: RelatedUserSchema
	})
);
