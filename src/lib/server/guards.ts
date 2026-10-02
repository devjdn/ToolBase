import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export async function requireUser() {
	const { locals } = getRequestEvent();
	const session = await locals.getSession();
	if (!session?.user) error(401, 'Unauthorized');
	return session.user;
}

export async function requireRole(roles: string[]) {
	const user = await requireUser();
	if (!roles.includes(user.role ?? '')) error(403, 'Forbidden');
	return user;
}
