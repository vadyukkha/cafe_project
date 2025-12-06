import { loginSchema } from '@/src/schemas/login';
import { signJwt } from '@/src/utils/jwt';
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
				{ status: 400 });
		}

		const { email, password } = parsed.data;

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return NextResponse.json({ message: 'User does not exist' }, { status: 401 });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return NextResponse.json(
				{ message: 'Incorrect email or password' }, { status: 401 });
		}

		const access_token = signJwt({
			id: user.id,
			email: user.email,
			role: user.role as Role,
		});

		return NextResponse.json(
			{ access_token: access_token, token_type: 'bearer' }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
