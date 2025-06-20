import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const sites = sqliteTable('sites', {
	id: integer('id').unique().primaryKey().notNull(),
	link: text('link').unique().notNull(),
	order: integer('order').unique().notNull()
});

export const users = sqliteTable('users', {
	id: integer('id').unique().primaryKey().notNull(),
	username: text('username').unique().notNull(),
	password: text('password').notNull()
});

export const invites = sqliteTable('invites', {
	id: integer('id').unique().primaryKey().notNull(),
	code: text('code').unique().notNull(),
	expiresAt: integer('expires_at').notNull(),
	uses: integer('uses').notNull()
});

export const settings = sqliteTable('settings', {
	setting: text('setting').unique().primaryKey().notNull(),
	value: text('value').notNull()
});
