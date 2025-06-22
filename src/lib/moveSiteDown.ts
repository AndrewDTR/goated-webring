import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, gt, min } from 'drizzle-orm';

export default async function moveSiteDown(siteID: number) {
	const [siteToMove] = await db
		.select({ id: sites.id, order: sites.order })
		.from(sites)
		.where(eq(sites.id, siteID));

	if (!siteToMove) {
		throw new Error('Site not found');
	}

	// find the next highest site
	const [{ nextSiteOrder }] = await db
		.select({ nextSiteOrder: min(sites.order) })
		.from(sites)
		.where(gt(sites.order, siteToMove.order));

	if (!nextSiteOrder) {
		// todo handle
		return;
	}

	const [nextSite] = await db.select().from(sites).where(eq(sites.order, nextSiteOrder))

	await db.batch([
		db.update(sites).set({ order: -1 }).where(eq(sites.id, siteToMove.id)),

		db.update(sites).set({ order: siteToMove.order }).where(eq(sites.id, nextSite.id)),

		db.update(sites).set({ order: nextSite.order }).where(eq(sites.id, siteToMove.id))
	]);
}
