export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/admin')) {
		const isLogin = event.url.pathname.startsWith('/admin/login');
		const authed = event.cookies.get('admin') === '1';
		if (!isLogin && !authed) {
			return Response.redirect(new URL('/admin/login', event.url), 303);
		}
	}
	return await resolve(event);
}
