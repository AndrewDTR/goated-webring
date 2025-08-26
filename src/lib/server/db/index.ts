import { drizzle } from 'drizzle-orm/libsql';
import { execSync } from 'node:child_process';
import { env } from '$env/dynamic/private';
import { settings } from '$lib/server/db/schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

await execSync('npm run db:push');

export const db = drizzle(env.DATABASE_URL);

await db
	.insert(settings)
	.values([
		{ setting: 'REDIRECT_LINK', value: 'https://github.com/AndrewDTR/goated-webring' },
		{ setting: 'WEBRING_NAME', value: '🐐 My Webring' },
		{ setting: 'HIDE_WORDMARK', value: 'false' },
		{ setting: 'SHOW_LANDING_PAGE', value: 'true' }
	])
	.onConflictDoNothing();
