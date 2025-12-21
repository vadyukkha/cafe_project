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

	const card = await prisma.loyaltyCard.findFirst({
		where: { userId },
	});

	return NextResponse.json({
		message: 'Authorized request',
		user: user,
		card: card,
	}, { status: 200 });
}
