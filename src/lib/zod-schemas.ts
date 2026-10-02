import { z } from 'zod';

export const addToolSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	url: z.url('Must be a valid URL'),
	description: z.string().max(500).optional(),
	categoryId: z.uuid('Please select a category')
});

export const editToolSchema = addToolSchema.extend({
	id: z.uuid()
});

const logoFileSchema = z
	.instanceof(File)
	.optional()
	.refine(
		(f) => !f || f.size === 0 || ['image/webp', 'image/svg+xml'].includes(f.type),
		'Logo must be a WebP or SVG file'
	);

export const addToolFormSchema = addToolSchema.extend({
	logo: logoFileSchema
});
export const editToolFormSchema = editToolSchema.extend({
	logo: logoFileSchema
});

export const reportSchema = z.object({
	toolId: z.uuid(),
	reason: z.string().min(10, 'Please provide a reason for reporting this tool').max(100),
	status: z.enum(['pending', 'resolved', 'dismissed']).default('pending')
});

export const editorRequestSchema = z.object({
	message: z.string().min(50, 'Please provide a bit more detail.').max(200),
	status: z.enum(['pending', 'approved', 'denied']).default('pending'),
	reviewedBy: z.string().nullable().optional()
});

export type AddToolSchema = z.infer<typeof addToolSchema>;
export type EditToolSchema = z.infer<typeof editToolSchema>;
