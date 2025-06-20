import { invites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

type DurationOption = '30m' | '1h' | '6h' | '12h' | '1d' | '7d' | 'forever';
type UsesOption = 1 | -1;

function generateInviteCode() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let code = '';
	for (let i = 0; i < 5; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

export default async function createInvite(time: DurationOption, uses: UsesOption) {
	if (time === 'forever') {
		const code = await db
			.insert(invites)
			.values({ code: generateInviteCode(), expiresAt: -1, uses: uses })
			.returning({ code: invites.code });
		return code;
	} else {
		const durationMap: Record<DurationOption, number> = {
			'30m': 30 * 60 * 1000,
			'1h': 60 * 60 * 1000,
			'6h': 6 * 60 * 60 * 1000,
			'12h': 12 * 60 * 60 * 1000,
			'1d': 24 * 60 * 60 * 1000,
			'7d': 7 * 24 * 60 * 60 * 1000,
			forever: -1
		};
		const expiresAt = Date.now() + durationMap[time];
		const code = await db
			.insert(invites)
			.values({ code: generateInviteCode(), expiresAt: expiresAt, uses: uses })
			.returning({ code: invites.code });
		return code;
	}
}
