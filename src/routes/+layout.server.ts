import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { categories, tools } from '$lib/server/db/schema';
import { eq, sql, asc } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { addToolSchema, editToolSchema } from '$lib/zod-schemas';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();

	const allCategories = db
		.select({
			id: categories.id,
			name: categories.name,
			slug: categories.slug,
			toolCount: sql<number>`count(${tools.id})`.as('tool_count')
		})
		.from(categories)
		.leftJoin(tools, eq(categories.id, tools.categoryId))
		.groupBy(categories.id, categories.name, categories.slug)
		.orderBy(asc(categories.order));

	return {
		categories: await allCategories,
		addForm: superValidate(zod4(addToolSchema)),
		editForm: await superValidate(zod4(editToolSchema)),
		user: session?.user ?? null
	};
};
