import { and, lt, ne, or, lte } from 'drizzle-orm';
import { db } from './server/db';
import { invites } from './server/db/schema';

export default async function pruneInvites() {
	const now = Date.now();

	await db
		.delete(invites)
		.where(
			or(
				and(ne(invites.expiresAt, -1), lt(invites.expiresAt, now)),
				and(ne(invites.uses, -1), lte(invites.uses, 0))
			)
		);
}
