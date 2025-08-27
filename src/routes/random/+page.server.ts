import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import getSetting from '$lib/getSetting';

export const load: PageServerLoad = async () => {
	// get redirect link from settings
	const REDIRECT_LINK = await getSetting('REDIRECT_LINK');
	const SHOW_LANDING_PAGE = await getSetting('SHOW_LANDING_PAGE');
	const FALLBACK_REDIRECT = SHOW_LANDING_PAGE === 'true' ? '/' : REDIRECT_LINK;

	// get all sites
	const numSites = await db.select({ siteLink: sites.link }).from(sites);

	// if no sites
	if (numSites.length === 0) {
		redirect(302, FALLBACK_REDIRECT);
	}

	const randSiteLink = numSites[Math.floor(Math.random() * numSites.length)];

	redirect(302, randSiteLink.siteLink);
};
