import { eq } from 'drizzle-orm';
import { db } from './server/db';
import { invites } from './server/db/schema';

export default async function pruneInvites() {
	const allInvites = await db.select().from(invites);
	const currentEpoch = Date.now();

	for (const invite of allInvites) {
		// invite expires if it expires before right now
		if (invite.expiresAt < currentEpoch) {
			await db.delete(invites).where(eq(invites.id, invite.id));
		}
	}

	return;
}
