import { invites, sites } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { count, eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import getSetting from '$lib/getSetting';
import pruneInvites from '$lib/pruneInvites';
import addSite from '$lib/addSite';

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
			await addSite(link);

			const inviteUses = await db
				.select({ uses: invites.uses })
				.from(invites)
				.where(eq(invites.code, params.invite));

			if (inviteUses[0].uses == 1) {
				await db.delete(invites).where(eq(invites.code, params.invite));
			}
		} catch (err: unknown) {
			if (typeof err === 'object' && err !== null && 'body' in err) {
				const errorBody = err.body as { message: string };
				return {
					added: 'false',
					error: errorBody.message
				};
			}
			return {
				added: 'false',
				error: err instanceof Error ? err.message : String(err)
			};
		}
		redirect(302, `/links?site=${link}`);
	}
};

export const load: PageServerLoad = async ({ params }) => {
	// first prune
	await pruneInvites();

	// check if the invite *exists*, can do other checks when it's attempted to be written to
	const inviteList = await db.select().from(invites).where(eq(invites.code, params.invite));
	const WEBRING_NAME = await getSetting('WEBRING_NAME');

	if (inviteList.length > 0) {
		return { webringName: WEBRING_NAME, success: 'true' };
	} else {
		error(404, "Couldn't find that invite code");
	}
};
