import { type Handle, sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { auth } from '#lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	event.locals.getSession = () => auth.api.getSession({ headers: event.request.headers });

	return svelteKitHandler({ event, resolve, auth, building });
};

const handlePreload: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		preload: (input) => {
			if (input.type === 'js' || input.type === 'css') return true;

			if (input.type === 'font') {
				return input.filename.startsWith('src/lib/assets/fonts/') && input.filename.endsWith('.woff2');
			}

			return false;
		}
	});
};

export const handle: Handle = sequence(handleBetterAuth, handlePreload);
