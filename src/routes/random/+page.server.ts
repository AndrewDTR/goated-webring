import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL, REDIRECT_LINK } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

const db = drizzle(DATABASE_URL);

export const load: PageServerLoad = async () => {
	// get all sites
	const numSites = await db.select({ siteLink: sites.link }).from(sites);

	// if no sites
	if (numSites.length === 0) {
		redirect(307, REDIRECT_LINK);
	}

	const randSiteLink = numSites[Math.floor(Math.random() * numSites.length)];

	redirect(307, randSiteLink.siteLink);
};
