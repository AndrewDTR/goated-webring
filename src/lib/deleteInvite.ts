import { invites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export default async function deleteInvite(id: number) {
	await db.delete(invites).where(eq(invites.id, id));
	return;
}
