import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt, hashSession } from '@/src/utils/jwt';

const prefix = '/api/v1';
const publicRoutes = [
	prefix + '/auth/login',
	prefix + '/auth/register',
	prefix + '/health_check',
	prefix + '/products',
	prefix + '/orders',
	prefix + '/telegram/card', // ? Should be protected ?
];

function setCorsHeaders(res: NextResponse, origin: string) {
	res.headers.set('Access-Control-Allow-Origin', origin);
	res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.headers.set('Access-Control-Allow-Credentials', 'true');
	res.headers.set('Vary', 'Origin');
	return res;
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const origin = request.headers.get('origin') ?? '*';

	if (request.method === 'OPTIONS') {
		return setCorsHeaders(new NextResponse(null, { status: 204 }), origin);
	}

	if (publicRoutes
		.filter((r) => r !== prefix + '/products')
		.some((r) => pathname.startsWith(r)) ||
		(request.method === 'GET' && pathname.startsWith(prefix + '/products'))
	) {
		return setCorsHeaders(NextResponse.next(), origin);
	}

	const token = request.cookies.get('auth_token')?.value;
	const randomSession = request.cookies.get('random_session')?.value;

	if (!token || !randomSession) {
		return setCorsHeaders(
			NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
			origin
		);
	}

	const payload = verifyJwt(token);
	if (!payload) {
		return setCorsHeaders(
			NextResponse.json({ message: 'Invalid token' }, { status: 401 }),
			origin
		);
	}

	const expectedHash = hashSession(randomSession);
	if (expectedHash !== payload.sessionHash) {
		return setCorsHeaders(
			NextResponse.json({ message: 'Session mismatch' }, { status: 401 }),
			origin
		);
	}

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-user-id', String(payload.id));
	requestHeaders.set('x-user-email', payload.email);
	requestHeaders.set('x-user-role', payload.role);

	const res = NextResponse.next({ request: { headers: requestHeaders } });
	return setCorsHeaders(res, origin);
}

export const config = {
	matcher: ['/api/:path*'],
};
