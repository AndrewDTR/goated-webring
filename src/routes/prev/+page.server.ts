import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { count, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import getSetting from '$lib/getSetting';

export const load: PageServerLoad = async ({ url }) => {
	// get redirect link from settings
	const REDIRECT_LINK = await getSetting('REDIRECT_LINK');

	// remove trailing slash
	const currentSite = url.searchParams.get('site')?.replace(/\/$/, '');

	if (currentSite == null) {
		redirect(302, REDIRECT_LINK);
	}

	try {
		new URL(currentSite ?? '');
	} catch {
		redirect(302, REDIRECT_LINK);
	}

	// get number of sites
	const numSites = await db.select({ count: count() }).from(sites);

	const siteOrderObj = await db
		.select({ order: sites.order })
		.from(sites)
		.where(eq(sites.link, currentSite));

	// no sites found w/ that url
	if (siteOrderObj.length === 0) {
		redirect(302, REDIRECT_LINK);
	}

	const siteOrder = siteOrderObj[0].order;

	if (numSites == null || siteOrder == null || siteOrder < 0) {
		redirect(302, REDIRECT_LINK);
	}

	let redirectSite: { site: string }[];

	// wrap around to the max index if they're the first one in the list
	if (siteOrder == 0) {
		redirectSite = await db
			.select({ site: sites.link })
			.from(sites)
			.where(eq(sites.order, numSites[0].count - 1)); // minus one because more 0 vs 1 indexed fun
	} else {
		redirectSite = await db
			.select({ site: sites.link })
			.from(sites)
			.where(eq(sites.order, siteOrder - 1));
	}

	redirect(302, redirectSite[0].site);
};
