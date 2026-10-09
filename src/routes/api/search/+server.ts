import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '#lib/server/db/index.js';
import { and, eq, ilike, or } from 'drizzle-orm';
import { tools, categories } from '#lib/server/db/schema.js';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim();

	if (!q || q.length < 2) return json([]);

	const [toolResults, categoryResults] = await Promise.all([
		db
			.select({
				id: tools.id,
				name: tools.name,
				description: tools.description,
				url: tools.url,
				logoUrl: tools.logoUrl,
				createdAt: tools.createdAt,
				updatedAt: tools.updatedAt,
				category: {
					id: categories.id,
					name: categories.name,
					color: categories.color,
					slug: categories.slug
				}
			})
			.from(tools)
			.innerJoin(categories, eq(tools.categoryId, categories.id))
			.where(and(eq(tools.status, 'published'), or(ilike(tools.name, `%${q}%`), ilike(tools.description, `%${q}%`))))
			.limit(8),

		db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug
			})
			.from(categories)
			.where(ilike(categories.name, `%${q}%`))
			.limit(3)
	]);

	return json({
		toolResults,
		categoryResults
	});
};
