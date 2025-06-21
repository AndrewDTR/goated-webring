import { invites, sites } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { count, eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import getSetting from '$lib/getSetting';

export const actions = {
	default: async ({ request, url, params }) => {
		const data = await request.formData();
		let link = data.get('siteURL');

		// strip trailing slash if it exists
		if (typeof link === 'string' && link.endsWith('/')) {
			link = link.slice(0, -1);
		}

		// TODO more validation

		if (typeof link !== 'string') {
			return {
				added: 'false'
			};
		}

		try {
			const numSites = await db.select({ count: count() }).from(sites);
			await db.insert(sites).values({ link: link, order: numSites[0].count });

			const inviteUses = await db
				.select({ uses: invites.uses })
				.from(invites)
				.where(eq(invites.code, params.invite));

			if (inviteUses[0].uses == 1) {
				await db.delete(invites).where(eq(invites.code, params.invite));
			}
		} catch {
			return {
				added: 'false'
			};
		}
		redirect(302, `/links?site=${link}`);
	}
};

export const load: PageServerLoad = async ({ params }) => {
	// check if the invite *exists*, can do other checks when it's attempted to be written to
	const inviteList = await db.select().from(invites).where(eq(invites.code, params.invite));
	const WEBRING_NAME = await getSetting('WEBRING_NAME');

	if (inviteList.length > 0) {
		return { webringName: WEBRING_NAME, success: 'true' };
	} else {
		error(404, "Couldn't find that invite code");
	}
};
