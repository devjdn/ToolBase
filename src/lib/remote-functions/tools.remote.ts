import { query, command, form } from '$app/server';
import { z } from 'zod';
import { count, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { tools, categories } from '$lib/server/db/schema';
import { requireRole, requireUser } from '$lib/server/guards';
import { error, invalid } from '@sveltejs/kit';
import { uploadLogo, removeLogo } from '$lib/server/storage';
import { addToolFormSchema, editToolFormSchema } from '$lib/zod-schemas';

const PAGE_SIZE = 24;

export const getTools = query(z.object({ page: z.number().int().min(1) }), async ({ page }) => {
	const published = eq(tools.status, 'published');

	const [rows, [{ total }]] = await Promise.all([
		db
			.select({
				id: tools.id,
				name: tools.name,
				url: tools.url,
				description: tools.description,
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
			.leftJoin(categories, eq(tools.categoryId, categories.id))
			.where(published)
			.orderBy(desc(tools.createdAt))
			.offset((page - 1) * PAGE_SIZE)
			.limit(PAGE_SIZE),
		db.select({ total: count() }).from(tools).where(published)
	]);

	return {
		tools: rows,
		pagination: { page, pageSize: PAGE_SIZE, totalPages: Math.ceil(Number(total) / PAGE_SIZE) }
	};
});

export const addTool = form(addToolFormSchema, async (data, issue) => {
	await requireUser();

	let logoUrl: string | null = null;

	if (data.logo && data.logo.size > 0) {
		try {
			logoUrl = await uploadLogo(data.logo);
		} catch (e) {
			console.error(e);
			invalid(issue.logo('Failed to upload logo'));
		}
	}

	try {
		await db.insert(tools).values({
			name: data.name,
			url: data.url,
			description: data.description ?? null,
			categoryId: data.categoryId,
			logoUrl,
			status: 'published'
		});
	} catch (e) {
		console.error(e);
		await removeLogo(logoUrl);
		error(500, 'Failed to add tool');
	}
});

export const editTool = form(editToolFormSchema, async (data, issue) => {
	await requireRole(['editor', 'admin']);

	const [existing] = await db.select({ logoUrl: tools.logoUrl }).from(tools).where(eq(tools.id, data.id)).limit(1);
	if (!existing) {
		return error(404, 'Tool not found in ToolBase');
	}

	let newLogoUrl: string | null = null;

	if (data.logo && data.logo.size > 0) {
		try {
			newLogoUrl = await uploadLogo(data.logo);
		} catch (e) {
			console.error(e);
			invalid(issue.logo('Failed to upload logo'));
		}
	}

	try {
		await db
			.update(tools)
			.set({
				name: data.name,
				url: data.url,
				description: data.description,
				categoryId: data.categoryId,
				logoUrl: newLogoUrl ?? existing.logoUrl
			})
			.where(eq(tools.id, data.id));
	} catch (e) {
		console.error(e);
		await removeLogo(newLogoUrl);
		error(500, 'Failed to update tool');
	}

	if (newLogoUrl) await removeLogo(existing.logoUrl);

	return { success: true };
});

export const deleteTool = command(z.string(), async (id) => {
	await requireRole(['editor', 'admin']);

	const [tool] = await db
		.select({
			logoUrl: tools.logoUrl
		})
		.from(tools)
		.where(eq(tools.id, id))
		.limit(1);

	if (!tool) {
		error(404, 'Tool not found in ToolBase');
	}

	await db.delete(tools).where(eq(tools.id, id));

	await removeLogo(tool.logoUrl);

	return { success: true };
});
