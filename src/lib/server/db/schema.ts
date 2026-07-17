import { pgTable, text, timestamp, uuid, integer, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';

export const categories = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	color: text('color'),
	order: integer('order').notNull().default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const statusEnum = pgEnum('status', ['published', 'pending']);

export const tools = pgTable('tools', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description'),
	url: text('url').notNull(),
	categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
	logoUrl: text('logo_url'),
	status: statusEnum().notNull().default('pending'),
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

export const reportStatus = pgEnum('report_status', ['pending', 'resolved', 'dismissed']);

export const reports = pgTable(
	'reports',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		toolId: uuid('tool_id')
			.notNull()
			.references(() => tools.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		reason: text('reason').notNull(),
		status: reportStatus().notNull().default('pending'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(t) => [uniqueIndex('reports_tool_user_idx').on(t.toolId, t.userId)]
);

export const editorRequestStatus = pgEnum('editor_request_status', ['pending', 'approved', 'denied']);

export const editorRequests = pgTable('editor_requests', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	message: text('message').notNull(),
	status: editorRequestStatus().notNull().default('pending'),
	reviewedBy: text('reviewed_by').references(() => user.id, { onDelete: 'set null' }),
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
	images: many(toolImages),
	reports: many(reports)
}));

export const toolImagesRelations = relations(toolImages, ({ one }) => ({
	tool: one(tools, {
		fields: [toolImages.toolId],
		references: [tools.id]
	})
}));

export const reportsRelations = relations(reports, ({ one }) => ({
	tool: one(tools, {
		fields: [reports.toolId],
		references: [tools.id]
	}),
	user: one(user, {
		fields: [reports.userId],
		references: [user.id]
	})
}));

export const editorRequestRelations = relations(editorRequests, ({ one }) => ({
	user: one(user, {
		fields: [editorRequests.userId],
		references: [user.id]
	}),
	reviewer: one(user, {
		fields: [editorRequests.reviewedBy],
		references: [user.id],
		relationName: 'editor_request_reviewer'
	})
}));

export * from './auth.schema';
