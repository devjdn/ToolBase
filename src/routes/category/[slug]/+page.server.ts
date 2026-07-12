import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, and, desc, count } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { tools, categories } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params, url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
	const pageSize = 24;

	// checking if category exists if there are no rows
	const category = await db
		.select()
		.from(categories)
		.where(eq(categories.slug, params.slug))
		.limit(1)
		.then((r) => r[0]);

	if (!category) error(404, 'Category not found.');

	const rows = db
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
		.where(and(eq(tools.categoryId, category.id), eq(tools.status, 'published')))
		.orderBy(desc(tools.createdAt))
		.offset((page - 1) * pageSize)
		.limit(pageSize);

	const totalCount = db
		.select({ count: count() })
		.from(tools)
		.where(and(eq(tools.categoryId, category.id), eq(tools.status, 'published')));

	return {
		category,
		tools: rows,
		pagination: totalCount.then(([{ count: total }]) => ({
			page,
			pageSize,
			totalPages: Math.ceil(Number(total) / pageSize)
		}))
	};
};
