import deleteInvite from '$lib/deleteInvite';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	await deleteInvite(id);
	return new Response();
};
