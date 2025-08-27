import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { count, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import getSetting from '$lib/getSetting';

export const load: PageServerLoad = async ({ url }) => {
	// get redirect link from settings
	const REDIRECT_LINK = await getSetting('REDIRECT_LINK');
	const SHOW_LANDING_PAGE = await getSetting('SHOW_LANDING_PAGE');
	const FALLBACK_REDIRECT = SHOW_LANDING_PAGE === 'true' ? '/' : REDIRECT_LINK;

	// remove trailing slash
	const currentSite = url.searchParams.get('site')?.replace(/\/$/, '');

	if (currentSite == null) {
		redirect(302, FALLBACK_REDIRECT);
	}

	try {
		new URL(currentSite ?? '');
	} catch {
		redirect(302, FALLBACK_REDIRECT);
	}

	// get number of sites
	const numSites = await db.select({ count: count() }).from(sites);

	const siteOrderObj = await db
		.select({ order: sites.order })
		.from(sites)
		.where(eq(sites.link, currentSite));

	// no sites found w/ that url
	if (siteOrderObj.length === 0) {
		redirect(302, FALLBACK_REDIRECT);
	}

	const siteOrder = siteOrderObj[0].order;

	if (siteOrder == null || siteOrder < 0) {
		redirect(302, FALLBACK_REDIRECT);
	}

	let redirectSite: { site: string }[];

	// wrap around to index 0 if they're the last one in the list
	// add one, since .count() is 1 indexed and our own count is 0 indexed
	if (siteOrder + 1 == numSites[0].count) {
		redirectSite = await db.select({ site: sites.link }).from(sites).where(eq(sites.order, 0));
	} else {
		redirectSite = await db
			.select({ site: sites.link })
			.from(sites)
			.where(eq(sites.order, siteOrder + 1));
	}

	redirect(302, redirectSite[0].site);
};
