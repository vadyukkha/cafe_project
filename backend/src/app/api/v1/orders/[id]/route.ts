import { prisma } from '@/prisma/connection';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const order = await prisma.order.findUnique({
			where: { id: id },
			include: { items: true },
		});

		if (!order) {
			return NextResponse.json({ message: 'Order not found' }, { status: 404 });
		}
		return NextResponse.json({ order });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
