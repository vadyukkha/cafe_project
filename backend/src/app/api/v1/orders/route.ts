import { prisma } from '@/prisma/connection';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const userId = request.headers.get('x-user-id') as string;

		const orders = await prisma.order.findMany({
			where: { userId: userId },
			include: { items: true },
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json({ orders }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
