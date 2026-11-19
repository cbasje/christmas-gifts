import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: { static: true },
	SMTP_URL: { static: true },
	EMAIL_FROM: { static: true },
});
