import { command, form, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reports, tools } from '$lib/server/db/schema';
import * as z from 'zod/v4';
import { eq } from 'drizzle-orm';

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

const reportIdSchema = z.object({ reportId: z.uuid() });

export const dismissReport = command(reportIdSchema, async ({ reportId }) => {
	const event = getRequestEvent();
	const session = await event.locals.getSession();

	if (session?.user?.role !== 'admin') throw error(403, 'Forbidden');

	await db.update(reports).set({ status: 'dismissed' }).where(eq(reports.id, reportId));
});

export const resolveReport = command(reportIdSchema, async ({ reportId }) => {
	const event = getRequestEvent();
	const session = await event.locals.getSession();

	if (session?.user?.role !== 'admin') throw error(403, 'Forbidden');

	await db.update(reports).set({ status: 'resolved' }).where(eq(reports.id, reportId));
});

const removeToolSchema = z.object({ toolId: z.uuid() });

export const removeTool = command(removeToolSchema, async ({ toolId }) => {
	const event = getRequestEvent();
	const session = await event.locals.getSession();

	if (session?.user?.role !== 'admin') throw error(403, 'Forbidden');

	await db.delete(tools).where(eq(tools.id, toolId));
});
