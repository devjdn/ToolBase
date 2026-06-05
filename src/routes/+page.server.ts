import { db } from '$lib/server/db';
import { tools, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allTools = await db
		.select({
			id: tools.id,
			name: tools.name,
			description: tools.description,
			logoUrl: tools.logoUrl,
			category: {
				id: categories.name,
				name: categories.name,
				color: categories.color
			}
		})
		.from(tools)
		.leftJoin(categories, eq(tools.categoryId, categories.id));

	return { tools: allTools };
};
