import moveSiteDown from '$lib/moveSiteDown';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	await moveSiteDown(id);
	return new Response();
};
