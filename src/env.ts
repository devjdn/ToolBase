import { defineEnvVars } from '@sveltejs/kit/env';

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
	ORIGIN: { schema: (input) => input ?? '' },
	BETTER_AUTH_SECRET: { schema: (input) => input ?? '' },
	GITHUB_CLIENT_ID: { schema: (input) => input ?? '' },
	GITHUB_CLIENT_SECRET: { schema: (input) => input ?? '' },
	SUPABASE_SERVICE_ROLE_KEY: { schema: (input) => input ?? '' },
	PUBLIC_SUPABASE_URL: { public: true, static: true },
	DATABASE_URL: { schema: (input) => input ?? '' }
});
