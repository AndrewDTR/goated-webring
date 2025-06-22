import { sites } from './server/db/schema';
import { db } from '$lib/server/db';
import { max } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export default async function addSite(siteURL: string) {
	// TODO validate the site's URL and relevant stuff like that

	let parsedURL;
	try {
		parsedURL = new URL(siteURL);
	} catch {
		error(400, { message: 'Invalid URL' });
	}

	if (!(parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:')) {
		error(400, { message: 'Invalid URL protocol. Goated webring only supports http and https.' });
	}

	const [{ highestOrder }] = await db.select({ highestOrder: max(sites.order) }).from(sites);

	if (!highestOrder) {
		// fail
		return;
	}

	await db.insert(sites).values({ link: siteURL, order: highestOrder + 1 });
}
