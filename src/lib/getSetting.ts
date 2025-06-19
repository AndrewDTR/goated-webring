import { settings } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

type dbSetting = 'REDIRECT_LINK' | 'WEBRING_NAME' | 'HIDE_WORDMARK' | 'SHOW_LANDING_PAGE';

export default async function getSetting(setting: dbSetting) {
	const redirPull = await db
		.select({ value: settings.value })
		.from(settings)
		.where(eq(settings.setting, setting));

	return redirPull[0].value;
}
