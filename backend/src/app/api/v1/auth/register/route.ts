import { registerSchema } from '@/src/schemas/register';
import { Role } from '@/src/enums/role';
import { prisma } from '@/prisma/connection';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = registerSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ message: 'Invalid input', details: z.treeifyError(parsed.error) },
				{ status: 400 });
		}

		const { email, password, name } = parsed.data;

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return NextResponse.json({ message: 'User already exists' }, { status: 409 });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
				role: Role.USER,
			}
		});

		return NextResponse.json(
			{
				message: 'User registered successfully',
				user: { id: user.id },
			},
			{ status: 201 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
