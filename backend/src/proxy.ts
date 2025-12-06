import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/src/utils/jwt';
import { JwtPayload } from '@/src/types/token';

const prefix = '/api/v1';
const publicRoutes = [
	prefix + '/orders',
	prefix + '/products',
	prefix + '/auth/login',
	prefix + '/auth/register',
	prefix + '/health_check',
];


function setCorsHeaders(res: NextResponse, origin: string) {
	res.headers.set('Access-Control-Allow-Origin', origin ?? '*');
	res.headers.set('Vary', 'Origin');
	res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	res.headers.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, X-Requested-With, x-user-id, x-user-email, x-user-role'
	);
	res.headers.set('Access-Control-Allow-Credentials', 'true');
	return res;
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const method = request.method;
	const origin = request.headers.get('origin') ?? '*';

	if (method === 'OPTIONS') {
		const preflight = new NextResponse(null, { status: 204 });
		return setCorsHeaders(preflight, origin);
	}

	if (publicRoutes.some((r) => pathname.startsWith(r))) {
		const res = NextResponse.next();
		return setCorsHeaders(res, origin);
	}

	const authHeader = request.headers.get('authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		const res = NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
		return setCorsHeaders(res, origin);
	}

	const token = authHeader.split(' ')[1];
	let payload: JwtPayload | null = null;
	try {
		payload = verifyJwt(token);
	} catch (_) {
		const res = NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
		return setCorsHeaders(res, origin);
	}

	if (!payload) {
		const res = NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
		return setCorsHeaders(res, origin);
	}
	const requestHeaders = new Headers(request.headers);
	if (payload.id) requestHeaders.set('x-user-id', String(payload.id));
	if (payload.email) requestHeaders.set('x-user-email', String(payload.email));
	if (payload.role) requestHeaders.set('x-user-role', String(payload.role));

	const res = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	return setCorsHeaders(res, origin);
}

export const config = {
	matcher: ['/api/:path*'],
};
