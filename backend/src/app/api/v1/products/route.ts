import { createProductSchema } from '@/src/schemas/product';
import { prisma } from '@/prisma/connection';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
	try {
		const products = await prisma.product.findMany({
			orderBy: { createdAt: 'desc' },
		});
		return NextResponse.json(products, { status: 200 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}

function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = createProductSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ message: 'Invalid input', details: z.treeifyError(parsed.error) },
				{ status: 400 });
		}

		await prisma.product.create({
			data: {
				name: parsed.data.name.toLowerCase(),
				description:
					capitalizeFirstLetter(parsed.data.description.toLowerCase()),
				volume: parsed.data.volume,
				price: parsed.data.price,
			},
		});

		return NextResponse.json(
			{ message: 'Item added successfully' }, { status: 201 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
