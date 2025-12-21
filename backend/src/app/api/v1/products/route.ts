import { 
	createProductSchema, 
	deleteProductSchema, 
	updateProductSchema
} from '@/src/schemas/product';
import { prisma } from '@/prisma/connection';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Role } from '@/src/enums/role';

function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

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

export async function POST(request: Request) {
	try {
		const userRole = request.headers.get('x-user-role') as string;
		if (userRole !== Role.ADMIN) {
			return NextResponse.json(
				{ message: 'Access Denied' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const parsed = createProductSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ message: 'Invalid input', details: z.treeifyError(parsed.error) },
				{ status: 400 });
		}

		const products = await prisma.product.findUnique({
			where: { name: parsed.data.name },
		});

		if (products) {
			return NextResponse.json(
				{ message: 'Item already exists' }, { status: 409 })
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

export async function PUT(request: Request) {
	try {
		const userRole = request.headers.get('x-user-role') as string;
		if (userRole !== Role.ADMIN) {
			return NextResponse.json(
				{ message: 'Access Denied' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const parsed = updateProductSchema.safeParse(body);

		const name = parsed.data!.productName;

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: 'Invalid input',
					details: z.treeifyError(parsed.error),
				},
				{ status: 400 });
		}

		const existing = await prisma.product.findUnique({
			where: { name },
		});

		if (!existing) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		if (parsed.data.description) {
			parsed.data.description =
				capitalizeFirstLetter(parsed.data.description.toLowerCase());
		}

		if (parsed.data.name) {
			parsed.data.name = parsed.data.name.toLowerCase();
		}

		const { productName, ...updateData } = parsed.data;
		const updated = await prisma.product.update({
			where: { name },
			data: updateData,
		});

		return NextResponse.json(updated, { status: 200 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const userRole = request.headers.get('x-user-role') as string;
		if (userRole !== Role.ADMIN) {
			return NextResponse.json(
				{ message: 'Access Denied' },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const parsed = deleteProductSchema.safeParse(body);
		const name = parsed.data!.productName;

		const existing = await prisma.product.findUnique({
			where: { name },
		});

		if (!existing) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		await prisma.product.delete({
			where: { name },
		});

		return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
