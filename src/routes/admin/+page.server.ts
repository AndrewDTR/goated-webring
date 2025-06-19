import type { PageServerLoad } from './$types';
import { sites, settings } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { Actions } from './$types';
import getSetting from '$lib/getSetting';
import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		let redirectValue = data.get('redirectLink');
		let showLandingPage = data.get('showLandingPage');

		if (showLandingPage === null) showLandingPage = '';
		else if (typeof showLandingPage !== 'string') showLandingPage = String(showLandingPage);
		if (redirectValue === null) redirectValue = '';
		else if (typeof redirectValue !== 'string') redirectValue = String(redirectValue);
		let redirectParse = new URL(typeof redirectValue === 'string' ? redirectValue : '');

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
				success: 'false',
				error: `Unexpected error: ${error}`
			};
		}

		return { success: 'true' };
	}
} satisfies Actions;

export const load: PageServerLoad = async () => {
	const [REDIRECT_LINK, WEBRING_NAME, HIDE_WORDMARK, SHOW_LANDING_PAGE] = await Promise.all([
		getSetting('REDIRECT_LINK'),
		getSetting('WEBRING_NAME'),
		getSetting('HIDE_WORDMARK'),
		getSetting('SHOW_LANDING_PAGE')
	]);

	const siteList = await db.select({ site: sites.link }).from(sites).orderBy(sites.order);

	return {
		sites: siteList,
		settings: {
			redirectLink: REDIRECT_LINK,
			webringName: WEBRING_NAME,
			hideWordmark: HIDE_WORDMARK,
			showLandingPage: SHOW_LANDING_PAGE
		}
	};
};
