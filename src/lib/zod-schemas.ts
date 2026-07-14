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

export type AddToolSchema = z.infer<typeof addToolSchema>;
export type EditToolSchema = z.infer<typeof editToolSchema>;
