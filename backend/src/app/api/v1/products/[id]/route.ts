import { prisma } from '@/prisma/connection';
import { NextResponse } from 'next/server';

export async function GET(
	_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const product = await prisma.product.findUnique({
			where: { id },
		});

		if (!product) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		return NextResponse.json(product, { status: 200 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
