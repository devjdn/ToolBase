import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { tools, categories } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const rows = await db
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
		.where(and(eq(categories.slug, params.slug), eq(tools.status, 'published')));

	// checking if category exists if there are no rows
	const category =
		rows[0]?.category ??
		(await db
			.select()
			.from(categories)
			.where(eq(categories.slug, params.slug))
			.limit(1)
			.then((r) => r[0]));

	if (!category) error(404, 'Category not found.');

	return { category, tools: rows };
};
