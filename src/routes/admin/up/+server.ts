import moveSiteUp from '$lib/moveSiteUp';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	await moveSiteUp(id);
	return new Response();
};
