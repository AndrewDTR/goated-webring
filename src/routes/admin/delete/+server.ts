import deleteInvite from '$lib/deleteInvite';
import deleteSite from '$lib/deleteSite';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { id, type } = await request.json();

	if (type === 'invite') {
		await deleteInvite(id);
	}

	if (type === 'site') {
		await deleteSite(id);
	}
	return new Response();
};
