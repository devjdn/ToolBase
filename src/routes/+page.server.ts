import { db } from '$lib/server/db';
import { tools, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { supabase } from '$lib/server/supabase';

const addToolSchema = z.object({
	name: z.string(),
	url: z.url('Must be a valid HTTPS URL'),
	description: z.string().max(255).optional(),
	categoryId: z.uuid('Please select a category')
});

export const load: PageServerLoad = async () => {
	const allTools = await db
		.select({
			id: tools.id,
			name: tools.name,
			url: tools.url,
			description: tools.description,
			logoUrl: tools.logoUrl,
			category: {
				id: categories.id,
				name: categories.name,
				color: categories.color
			}
		})
		.from(tools)
		.leftJoin(categories, eq(tools.categoryId, categories.id));

	return { tools: allTools };
};

export const actions: Actions = {
	addTool: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		const result = addToolSchema.safeParse({
			name: formData.get('name'),
			url: formData.get('url'),
			description: formData.get('description') || undefined,
			categoryId: formData.get('categoryId')
		});

		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);

			return fail(400, { error: fieldErrors });
		}

		const logoFile = formData.get('logo') as File | null;
		let logoUrl: string | null = null;

		if (logoFile && logoFile.size > 0) {
			const fileExt = logoFile.name.split('.').pop();
			const fileName = `${crypto.randomUUID()}.${fileExt}`;

			const { error } = await supabase.storage.from('ToolBase Images').upload(fileName, logoFile, {
				contentType: logoFile.type,
				upsert: false
			});

			if (error) {
				return fail(500, { error: 'Failed to upload logo' });
			}

			const { data } = supabase.storage.from('ToolBase Images').getPublicUrl(fileName);

			logoUrl = data.publicUrl;
		}

		await db.insert(tools).values({
			name: result.data.name,
			url: result.data.url,
			description: result.data.description ?? null,
			categoryId: result.data.categoryId,
			logoUrl
		});

		return { success: true };
	},
	deleteTool: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Tool ID must be present' });
		}

		const tool = await db.select().from(tools).where(eq(tools.id, id)).limit(1);

		if (!tool.length) {
			return fail(404, { error: 'Tool not found in ToolBase' });
		}

		if (tool[0].logoUrl) {
			const fileName = tool[0].logoUrl.split('/').pop();
			if (fileName) {
				await supabase.storage.from('ToolBase Images').remove([fileName]);
			}
		}

		await db.delete(tools).where(eq(tools.id, id));

		return { success: true };
	},
	editTool: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		const result = addToolSchema.extend({ id: z.uuid() }).safeParse({
			id: formData.get('id'),
			name: formData.get('name'),
			url: formData.get('url'),
			description: formData.get('description') || undefined,
			categoryId: formData.get('categoryId')
		});

		if (!result.success) {
			const { fieldErrors } = z.flattenError(result.error);
			return fail(400, { error: fieldErrors });
		}

		const existing = await db.select().from(tools).where(eq(tools.id, result.data.id)).limit(1);
		if (!existing.length) {
			return fail(404, { error: 'Tool not found in ToolBase' });
		}

		const logoFile = formData.get('logo') as File | null;
		let logoUrl: string | null = existing[0].logoUrl;

		if (logoFile && logoFile.size > 0) {
			const fileExt = logoFile.name.split('.').pop();
			const fileName = `${crypto.randomUUID()}.${fileExt}`;

			const { error } = await supabase.storage.from('ToolBase Images').upload(fileName, logoFile, {
				contentType: logoFile.type,
				upsert: false
			});

			if (error) {
				return fail(500, { error: error.message });
			}

			if (existing[0].logoUrl) {
				const oldFileName = existing[0].logoUrl.split('/').pop();

				if (oldFileName) {
					await supabase.storage.from('ToolBase Images').remove([oldFileName]);
				}
			}

			const { data } = supabase.storage.from('ToolBase Images').getPublicUrl(fileName);
			logoUrl = data.publicUrl;
		}

		await db
			.update(tools)
			.set({
				name: result.data.name,
				url: result.data.url,
				description: result.data.description ?? null,
				categoryId: result.data.categoryId,
				logoUrl
			})
			.where(eq(tools.id, result.data.id));

		return { success: true };
	}
};
