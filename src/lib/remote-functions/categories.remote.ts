import { query } from '$app/server';
import { and, asc, count, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, tools } from '$lib/server/db/schema';

export const getCategories = query(async () => {
	return db
		.select({
			id: categories.id,
			name: categories.name,
			slug: categories.slug,
			toolCount: count(tools.id)
		})
		.from(categories)
		.leftJoin(tools, and(eq(categories.id, tools.categoryId), eq(tools.status, 'published')))
		.groupBy(categories.id, categories.name, categories.slug)
		.orderBy(asc(categories.order));
});
