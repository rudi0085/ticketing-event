import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const session = cookies.get('admin_session');

	// If accessing admin pages other than /admin/login without session
	if (url.pathname !== '/admin/login' && session !== 'authenticated') {
		throw redirect(303, '/admin/login');
	}

	return {
		isAuthenticated: session === 'authenticated'
	};
};

