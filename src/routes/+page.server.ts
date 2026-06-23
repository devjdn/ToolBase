import { db } from '$lib/server/db';
import { tools, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { supabase } from '$lib/server/supabase';
import { addToolSchema, editToolSchema } from '$lib/zod-schemas';

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
				color: categories.color,
				slug: categories.slug
			}
		})
		.from(tools)
		.leftJoin(categories, eq(tools.categoryId, categories.id))
		.where(eq(tools.status, 'published'));

	return {
		tools: allTools
	};
};

export const actions: Actions = {
	addTool: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		const form = await superValidate(formData, zod4(addToolSchema));

		if (!form.valid) {
			return fail(400, { form });
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
				return message(form, { type: 'error', text: 'Failed to upload logo' }, { status: 500 });
			}

			const { data } = supabase.storage.from('ToolBase Images').getPublicUrl(fileName);

			logoUrl = data.publicUrl;
		}

		// const status = ['editor', 'admin'].includes(session.user.role ?? '') ? 'published' : 'pending';
		const status = 'published';

		try {
			await db.insert(tools).values({
				name: form.data.name,
				url: form.data.url,
				description: form.data.description ?? null,
				categoryId: form.data.categoryId,
				logoUrl,
				status
			});
		} catch {
			return message(form, { type: 'error', text: 'Failed to add tool' }, { status: 500 });
		}

		return message(form, { type: 'success', text: `${form.data.name} added to ToolBase` });
	},
	deleteTool: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		if (!['editor', 'admin'].includes(session.user.role ?? '')) {
			return fail(403, { error: 'Forbidden' });
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
		const session = await locals.getSession();
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		if (!['editor', 'admin'].includes(session.user.role ?? '')) {
			return fail(403, { error: 'Forbidden' });
		}

		const formData = await request.formData();

		const form = await superValidate(formData, zod4(editToolSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const existing = await db.select().from(tools).where(eq(tools.id, form.data.id)).limit(1);
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
				return message(form, { type: 'error', text: 'Failed to upload logo' }, { status: 500 });
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

		try {
			await db
				.update(tools)
				.set({
					name: form.data.name,
					url: form.data.url,
					description: form.data.description ?? null,
					categoryId: form.data.categoryId,
					logoUrl
				})
				.where(eq(tools.id, form.data.id));
		} catch {
			return message(form, { type: 'error', text: 'Failed to update tool' }, { status: 500 });
		}

		return message(form, { type: 'success', text: `${form.data.name} updated successfully` });
	}
};
