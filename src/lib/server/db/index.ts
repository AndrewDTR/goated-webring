import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import path from 'node:path';
import { settings } from '$lib/server/db/schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const url = env.DATABASE_URL;

const client = createClient({ url });
export const db = drizzle(client);

export const dbReady = (async () => {
	if (building) return;

	const migrationsFolder = path.join(process.cwd(), 'drizzle');
	await migrate(db, { migrationsFolder });

	const existing = await db.select().from(settings).limit(1);
	if (existing.length === 0) {
		await db
			.insert(settings)
			.values([
				{ setting: 'REDIRECT_LINK', value: 'https://github.com/AndrewDTR/goated-webring' },
				{ setting: 'WEBRING_NAME', value: '🐐 My Webring' },
				{ setting: 'HIDE_WORDMARK', value: 'false' },
				{ setting: 'SHOW_LANDING_PAGE', value: 'true' }
			])
			.onConflictDoNothing();
	}
})();
