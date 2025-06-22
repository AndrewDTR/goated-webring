import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, lt, max } from 'drizzle-orm';

export default async function moveSiteUp(siteID: number) {
	const [siteToMove] = await db
		.select({ id: sites.id, order: sites.order })
		.from(sites)
		.where(eq(sites.id, siteID));

	if (!siteToMove) {
		throw new Error('Site not found');
	}

	if (siteToMove.order <= 0) {
		return;
	}

	const prevSiteResult = await db
		.select({ prevSiteOrder: max(sites.order) })
		.from(sites)
		.where(lt(sites.order, siteToMove.order));

	const [{ prevSiteOrder }] = prevSiteResult;

	if (prevSiteOrder === null || prevSiteOrder === undefined) {
		return;
	}

	const [prevSite] = await db.select().from(sites).where(eq(sites.order, prevSiteOrder));

	if (!prevSite) {
		return;
	}

	await db.batch([
		db.update(sites).set({ order: -1 }).where(eq(sites.id, siteToMove.id)),
		db.update(sites).set({ order: siteToMove.order }).where(eq(sites.id, prevSite.id)),
		db.update(sites).set({ order: prevSite.order }).where(eq(sites.id, siteToMove.id))
	]);
}
