import { prisma } from '@/prisma/connection';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const userId = request.headers.get('x-user-id') as string;
	if (!userId) {
		return NextResponse.json({ message: 'Unauthorized request' }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	return NextResponse.json({
		message: 'Authorized request',
		user: user,
	}, { status: 200 });
}
