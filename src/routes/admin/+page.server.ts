import { db } from '#lib/server/db/index.js';
import { categories, reports, tools, user } from '#lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) {
		redirect(302, '/');
	}

	if (session.user.role !== 'admin') {
		redirect(302, '/');
	}

	const reportedTools = db
		.select({
			reportId: reports.id,
			reason: reports.reason,
			reportedAt: reports.createdAt,
			toolId: tools.id,
			toolName: tools.name,
			categorySlug: categories.slug,
			toolUrl: tools.url,
			toolLogoUrl: tools.logoUrl,
			reporterEmail: user.email,
			reporterName: user.name
		})
		.from(reports)
		.leftJoin(tools, eq(reports.toolId, tools.id))
		.leftJoin(user, eq(reports.userId, user.id))
		.leftJoin(categories, eq(tools.categoryId, categories.id))
		.where(eq(reports.status, 'pending'));

	return { reportedTools };
};
