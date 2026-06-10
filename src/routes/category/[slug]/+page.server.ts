import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { tools, categories } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const category = await db.select().from(categories).where(eq(categories.slug, params.slug)).limit(1);

	if (!category.length) {
		error(404, 'Category not found.');
	}

	const categoryTools = await db
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
				color: categories.color
			}
		})
		.from(tools)
		.leftJoin(categories, eq(tools.categoryId, categories.id))
		.where(eq(tools.categoryId, category[0].id));

	return {
		category: category[0],
		tools: categoryTools
	};
};
