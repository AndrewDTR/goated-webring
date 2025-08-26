import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { timingSafeEqual } from 'crypto';

function secureCompare(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}
	return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

export const load: PageServerLoad = async ({ cookies }) => {
	const authed = cookies.get('admin');

	if (authed === '1') {
		redirect(303, '/admin');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const pw = String(data.get('password') ?? '');
		const next = url.searchParams.get('next') || '/admin';

		if (env.ADMIN_PASS === 'REPLACE-ME!') {
			return fail(400, { error: "Please don't use the default password! Change it in .env" });
		}

		if (!env.ADMIN_PASS || env.ADMIN_PASS === 'REPLACE-ME!' || !secureCompare(pw, env.ADMIN_PASS)) {
			return fail(400, { error: 'Incorrect password' });
		}

		cookies.set('admin', '1', {
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			path: '/',
			maxAge: 60 * 60 * 8
		});

		throw redirect(303, next);
	}
};
