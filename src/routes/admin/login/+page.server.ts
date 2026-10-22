import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@eventorganizer.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword123';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = cookies.get('admin_session');
	if (session === 'authenticated') {
		throw redirect(303, '/admin');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString().trim();

		if (!email || !password) {
			return fail(400, { error: 'Email dan kata sandi wajib diisi.' });
		}

		if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
			return fail(401, { error: 'Email atau kata sandi admin salah.' });
		}

		// Set secure cookie session
		cookies.set('admin_session', 'authenticated', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 // 24 hours
		});

		throw redirect(303, '/admin');
	}
};

