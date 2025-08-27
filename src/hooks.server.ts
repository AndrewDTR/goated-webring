import { dbReady } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	await dbReady;

	if (event.url.pathname.startsWith('/admin')) {
		const isLogin = event.url.pathname.startsWith('/admin/login');
		const authed = event.cookies.get('admin') === '1';
		if (!isLogin && !authed) {
			redirect(303, '/admin/login');
		}
	}
	return await resolve(event);
}
