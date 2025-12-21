import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/connection';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const telegramId = searchParams.get('telegramId');

		if (!telegramId) {
			return NextResponse.json(
				{ message: 'Параметр telegramId обязателен' },
				{ status: 400 }
			);
		}

		const card = await prisma.loyaltyCard.findFirst({
			where: { telegramId },
		});

		if (!card) {
			return NextResponse.json(
				{ message: 'Карта не найдена' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ userId: card.userId, amount: card.amount },
			{ status: 200 }
		);
	} catch (_) {
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { telegramId } = body;

		if (!telegramId) {
			return NextResponse.json(
				{ message: 'Поле telegramId обязательно' },
				{ status: 400 }
			);
		}

		const existingCard = await prisma.loyaltyCard.findFirst({
			where: { telegramId },
		});

		if (existingCard) {
			return NextResponse.json(
				{ message: 'Карта с таким telegramId уже существует' },
				{ status: 409 }
			);
		}

		await prisma.loyaltyCard.create({
			data: {
				telegramId,
				amount: 0,
				userId: null,
			},
		});

		return NextResponse.json(
			{ message: 'Карта успешно создана' },
			{ status: 201 }
		);
	} catch {
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { telegramId, userId } = body;

		if (!telegramId || !userId) {
			return NextResponse.json(
				{ message: 'Поля telegramId и userId обязательны' },
				{ status: 400 }
			);
		}

		const card = await prisma.loyaltyCard.findFirst({
			where: { telegramId },
		});

		if (!card) {
			return NextResponse.json(
				{ message: 'Карта не найдена' },
				{ status: 404 }
			);
		}

		if (card.userId && card.userId !== userId) {
			return NextResponse.json(
				{ message: 'Карта уже привязана к другому пользователю' },
				{ status: 403 }
			);
		}

		await prisma.loyaltyCard.update({
			where: { id: card.id },
			data: {
				userId: userId,
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
						name: true,
					},
				},
			},
		});

		return NextResponse.json(
			{ message: 'Карта успешно привязана к вашему аккаунту' },
			{ status: 200 }
		);
	} catch {
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}
