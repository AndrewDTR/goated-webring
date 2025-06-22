import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, lt, max } from 'drizzle-orm';

export default async function moveSiteUp(siteID: number) {
	// validate if the siteorder exists...?
	// Validate if the site is already at the top (order === 1)
	const [siteToMove] = await db
		.select({ id: sites.id, order: sites.order })
		.from(sites)
		.where(eq(sites.id, siteID));

	// get the siteID and its current count
	const [{ prevSiteOrder }] = await db
		.select({ prevSiteOrder: max(sites.order) })
		.from(sites)
		.where(lt(sites.order, siteToMove.order));

	if (!prevSiteOrder) {
		// todo validate
		return;
	}

	const [prevSite] = await db.select().from(sites).where(eq(sites.order, prevSiteOrder));

	db.batch([
		db.update(sites).set({ order: -1 }).where(eq(sites.id, siteToMove.id)),

		db.update(sites).set({ order: siteToMove.order }).where(eq(sites.id, prevSite.id)),

		db.update(sites).set({ order: prevSite.order }).where(eq(sites.id, siteToMove.id))
	]);
}
