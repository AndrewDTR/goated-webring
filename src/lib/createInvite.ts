import { randomInt } from 'node:crypto';
import { invites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export type DurationOption = '30m' | '1h' | '6h' | '12h' | '1d' | '7d' | 'forever';
export type UsesOption = 1 | -1;

function generateInviteCode() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let code = '';
	for (let i = 0; i < 7; i++) code += chars[randomInt(0, chars.length)];
	return code;
}

export default async function createInvite(time: DurationOption, uses: UsesOption) {
	const durationMap: Record<DurationOption, number> = {
		'30m': 30 * 60 * 1000,
		'1h': 60 * 60 * 1000,
		'6h': 6 * 60 * 60 * 1000,
		'12h': 12 * 60 * 60 * 1000,
		'1d': 24 * 60 * 60 * 1000,
		'7d': 7 * 24 * 60 * 60 * 1000,
		forever: -1
	};

	const expiresAt = time === 'forever' ? -1 : Date.now() + durationMap[time];
	const code = await db
		.insert(invites)
		.values({ code: generateInviteCode(), expiresAt: expiresAt, uses: uses })
		.returning({ code: invites.code });

	return code;
}
