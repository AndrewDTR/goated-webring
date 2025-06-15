import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL, REDIRECT_LINK } from '$env/static/private';
import { count, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

const db = drizzle(DATABASE_URL);

export const load: PageServerLoad = async ({ url }) => {
	const currentSite = url.searchParams.get('site');

	if (currentSite == null) {
		redirect(307, REDIRECT_LINK);
	}

	try {
		new URL(currentSite ?? '');
	} catch {
		redirect(307, REDIRECT_LINK);
	}

	// get number of sites
	const numSites = await db.select({ count: count() }).from(sites);

	const siteOrderObj = await db
		.select({ order: sites.order })
		.from(sites)
		.where(eq(sites.link, currentSite));
	const siteOrder = siteOrderObj[0].order;

	if (numSites == null || siteOrder == null || siteOrder < 0) {
		redirect(307, REDIRECT_LINK);
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

	console.log(redirectSite);
	redirect(307, redirectSite[0].site);
};
