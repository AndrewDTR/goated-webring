import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export default async function moveSiteUp(siteID: number) {
	// validate if the siteorder exists...?
	// Validate if the site is already at the top (order === 1)
	const siteToMove = await db
		.select({ id: sites.id, order: sites.order })
		.from(sites)
		.where(eq(sites.id, siteID));

	if (!siteToMove.length) {
		throw new Error('Site not found');
	}

	if (siteToMove[0].order <= 0) {
		throw new Error('Site is already at the top');
	}

	// get the siteID and its current count
	const currentSite = await db
		.select({ id: sites.id, order: sites.order })
		.from(sites)
		.where(eq(sites.id, siteID));

	const prevSite = await db
		.select({ id: sites.id, order: sites.order })
		.from(sites)
		.where(eq(sites.order, currentSite[0].order - 1));

	// // get the siteID of whatever count is the one before this
	// const [aboveSite] = await db.select().from(sites).where(eq(sites.order, currentSite.order));

	// To avoid UNIQUE constraint violation, set one order to a temporary value first
	db.batch([
		db.update(sites).set({ order: -1 }).where(eq(sites.id, currentSite[0].id)),

		db.update(sites).set({ order: currentSite[0].order }).where(eq(sites.id, prevSite[0].id)),

		db.update(sites).set({ order: prevSite[0].order }).where(eq(sites.id, currentSite[0].id))
	]);
}
