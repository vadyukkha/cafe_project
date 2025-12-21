import { loginSchema } from '@/src/schemas/login';
import { signJwt, generateRandomSession, hashSession } from '@/src/utils/jwt';
import { prisma } from '@/prisma/connection';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Role } from '@/src/enums/role';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = loginSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ message: 'Invalid input', details: z.treeifyError(parsed.error) },
				{ status: 400 }
			);
		}

		const { email, password } = parsed.data;

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return NextResponse.json({ message: 'User does not exist' }, { status: 401 });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return NextResponse.json(
				{ message: 'Incorrect email or password' },
				{ status: 401 }
			);
		}

		const randomSession = generateRandomSession();
		const sessionHash = hashSession(randomSession);

		const access_token = signJwt({
			id: user.id,
			email: user.email,
			role: user.role as Role,
			sessionHash: sessionHash,
		});

		const response = NextResponse.json(
			{
				message: 'Login successfully.',
			}, { status: 200 }
		);

		response.cookies.set({
			name: 'random_session',
			value: randomSession,
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 60 * 60,
			path: '/',
		});

		response.cookies.set({
			name: 'auth_token',
			value: access_token,
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 60 * 60,
			path: '/',
		});

		return response;
	} catch (err) {
		console.error(err);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
