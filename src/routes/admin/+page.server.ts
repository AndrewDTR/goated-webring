import type { PageServerLoad } from './$types';
import { sites, settings, invites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { Actions } from './$types';
import getSetting from '$lib/getSetting';
import { eq } from 'drizzle-orm';
import createInvite from '$lib/createInvite';
import pruneInvites from '$lib/pruneInvites';
import addSite from '$lib/addSite';

export const actions = {
	addSite: async ({ request }) => {
		const data = await request.formData();
		const siteToAdd = String(data.get('site'));

		// todo validate
		if (!siteToAdd) {
			return;
		}

		await addSite(siteToAdd);
	},
	settings: async ({ request, url }) => {
		const data = await request.formData();
		let redirectValue = data.get('redirectLink');
		let showLandingPage = data.get('showLandingPage');

		if (showLandingPage === null) showLandingPage = '';
		else if (typeof showLandingPage !== 'string') showLandingPage = String(showLandingPage);
		if (redirectValue === null) redirectValue = '';
		else if (typeof redirectValue !== 'string') redirectValue = String(redirectValue);
		const redirectParse = new URL(typeof redirectValue === 'string' ? redirectValue : '');

		if (url.host === redirectParse.host && showLandingPage === 'false') {
			return {
				success: 'false',
				error: `Please don't set the redirect to the same link as the index — you'll get an infinite loop.`
			};
		}

		try {
			await db.batch([
				db
					.update(settings)
					.set({ value: redirectValue })
					.where(eq(settings.setting, 'REDIRECT_LINK')),

				db
					.update(settings)
					.set({ value: showLandingPage })
					.where(eq(settings.setting, 'SHOW_LANDING_PAGE')),

				db
					.update(settings)
					.set({ value: String(data.get('webringName') ?? '') })
					.where(eq(settings.setting, 'WEBRING_NAME')),

				db
					.update(settings)
					.set({ value: String(data.get('hideWordmark') ?? '') })
					.where(eq(settings.setting, 'HIDE_WORDMARK'))
			]);
		} catch (error) {
			return {
				type: 'settings',
				success: 'false',
				error: `Unexpected error: ${error}`
			};
		}

		return { type: 'settings', success: 'true' };
	},

	invite: async ({ request, url }) => {
		const data = await request.formData();
		const timeEntry = data.get('duration');
		const time = (
			typeof timeEntry === 'string' ? timeEntry : 'forever'
		) as import('$lib/createInvite').DurationOption;
		const useTemp = data.get('uses');
		const uses = (
			useTemp !== null ? parseInt(useTemp as string, 10) : 0
		) as import('$lib/createInvite').UsesOption; // Cast to UsesOption

		const code = await createInvite(time, uses);
		return { type: 'invite', code: `${url.host}/invite/${code[0].code}`, success: 'true' };
	}
} satisfies Actions;

export const load: PageServerLoad = async () => {
	await pruneInvites();

	const [REDIRECT_LINK, WEBRING_NAME, HIDE_WORDMARK, SHOW_LANDING_PAGE, siteList, inviteList] =
		await Promise.all([
			getSetting('REDIRECT_LINK'),
			getSetting('WEBRING_NAME'),
			getSetting('HIDE_WORDMARK'),
			getSetting('SHOW_LANDING_PAGE'),
			db
				.select({ site: sites.link, order: sites.order, id: sites.id })
				.from(sites)
				.orderBy(sites.order),
			db.select().from(invites).orderBy(invites.expiresAt)
		]);

	return {
		sites: siteList,
		invites: inviteList,
		settings: {
			redirectLink: REDIRECT_LINK,
			webringName: WEBRING_NAME,
			hideWordmark: HIDE_WORDMARK,
			showLandingPage: SHOW_LANDING_PAGE
		}
	};
};
