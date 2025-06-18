import type { PageServerLoad } from './$types';
import { sites } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { PUBLIC_SHOW_LANDING_PAGE } from '$env/static/public';
import { REDIRECT_LINK } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	let redirectParse = new URL(REDIRECT_LINK);
	let sameLinkError = false;

	// try and prevent a situation where people have the index page redirecting
	// to itself, while the page isn't rendering anything (infinite loop)
	if (url.host === redirectParse.host) {
		sameLinkError = true;
	} else if (PUBLIC_SHOW_LANDING_PAGE === 'false') {
		redirect(307, REDIRECT_LINK);
	}

	const siteList = await db.select({ site: sites.link }).from(sites).orderBy(sites.order);

	return {
		sites: siteList,
		sameLinkError: sameLinkError
	};
};
