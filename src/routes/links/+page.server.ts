import { sites } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import getSetting from '$lib/getSetting';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	// check if the invite *exists*, can do other checks when it's attempted to be written to
	const WEBRING_NAME = await getSetting('WEBRING_NAME');
	const siteLink = url.searchParams.get('site')?.replace(/\/$/, '');

	let sitesWithURL = [];
	if (siteLink !== undefined) {
		sitesWithURL = await db.select().from(sites).where(eq(sites.link, siteLink));
	}

	if (sitesWithURL.length == 0) {
		error(404, "That site doesn't exist in this webring");
	}

	return { webringName: WEBRING_NAME, success: 'true' };
};
