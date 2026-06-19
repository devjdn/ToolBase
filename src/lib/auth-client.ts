import { createAuthClient } from 'better-auth/svelte';
import { adminClient } from 'better-auth/client/plugins';
import { ac, user, editor, admin } from './permissions';

export const authClient = createAuthClient({
	plugins: [
		adminClient({
			ac,
			roles: {
				user,
				editor,
				admin
			}
		})
	]
});
