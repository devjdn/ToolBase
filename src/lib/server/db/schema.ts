import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	color: text('color'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const tools = pgTable('tools', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description'),
	categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
	logoUrl: text('logo_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const toolImages = pgTable('tool_images', {
	id: uuid('id').primaryKey().defaultRandom(),
	toolId: uuid('tool_id')
		.notNull()
		.references(() => tools.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	type: text('type').notNull().default('screenshot'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	tools: many(tools)
}));

export const toolsRelations = relations(tools, ({ one, many }) => ({
	category: one(categories, {
		fields: [tools.categoryId],
		references: [categories.id]
	}),
	images: many(toolImages)
}));

export const toolImagesRelations = relations(toolImages, ({ one }) => ({
	tool: one(tools, {
		fields: [toolImages.toolId],
		references: [tools.id]
	})
}));

export * from './auth.schema';
