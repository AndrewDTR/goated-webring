import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import getSetting from '$lib/getSetting';

export const load: PageServerLoad = async ({ url }) => {
	// get redirect link from settings
	const REDIRECT_LINK = await getSetting('REDIRECT_LINK');
	const SHOW_LANDING_PAGE = await getSetting('SHOW_LANDING_PAGE');
	const HIDE_WORDMARK = await getSetting('HIDE_WORDMARK');
	const WEBRING_NAME = await getSetting('WEBRING_NAME');

	if (SHOW_LANDING_PAGE === 'false') {
		redirect(302, REDIRECT_LINK);
	}

	const siteList = await db.select({ site: sites.link }).from(sites).orderBy(sites.order);

	return {
		sites: siteList,
		hideWordmark: HIDE_WORDMARK,
		webringName: WEBRING_NAME
	};
};
