import { form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reports } from '$lib/server/db/schema';
import * as z from 'zod/v4';

const reportFormSchema = z.object({
	toolId: z.uuid(),
	reason: z.string().min(10, 'Please provide a reason for reporting this tool').max(250)
});

export const submitReport = form(reportFormSchema, async ({ toolId, reason }) => {
	const event = getRequestEvent();
	const session = await event.locals.getSession();

	if (!session?.user) {
		throw error(401, 'You must be signed in to report a tool');
	}

	const existing = await db.query.reports.findFirst({
		where: (r, { and, eq }) => and(eq(r.toolId, toolId), eq(r.userId, session.user.id))
	});

	if (existing) {
		throw error(400, 'You have already reported this tool');
	}

	await db.insert(reports).values({
		toolId,
		userId: session.user.id,
		reason
	});
});
