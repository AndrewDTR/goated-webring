import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export default async function deleteSite(id: number) {
	await db.delete(sites).where(eq(sites.id, id));
	return;
}
