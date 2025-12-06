import { updateProductSchema } from '@/src/schemas/product';
import { prisma } from '@/prisma/connection';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function PUT(
	request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const parsed = updateProductSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: 'Invalid input',
					details: z.treeifyError(parsed.error),
				},
				{ status: 400 });
		}

		const existing = await prisma.product.findUnique({
			where: { id },
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

		const updated = await prisma.product.update({
			where: { id },
			data: parsed.data,
		});

		return NextResponse.json(updated, { status: 200 });
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(
	_: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const existing = await prisma.product.findUnique({
			where: { id },
		});

		if (!existing) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		await prisma.product.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
	}
}
