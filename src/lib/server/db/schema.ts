import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

export const sites = sqliteTable('sites', {
	id: integer('id').unique().primaryKey().notNull(),
	link: text('link').unique().notNull(),
	order: integer('order').unique().notNull()
});

// TODO
// export const users = sqliteTable('sites', {
// 	id: integer('id').unique().primaryKey().notNull(),
// 	link: text('link').unique().notNull(),
// 	order: integer('order').unique().notNull()
// });

// export const invites = sqliteTable('sites', {
// 	id: integer('id').unique().primaryKey().notNull(),
// 	link: text('link').unique().notNull(),
// 	order: integer('order').unique().notNull()
// });
