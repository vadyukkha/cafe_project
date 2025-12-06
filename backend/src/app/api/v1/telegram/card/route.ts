import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/connection';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const telegramId = searchParams.get('telegramId');

		if (!telegramId) {
			return NextResponse.json(
				{ error: 'Параметр telegramId обязателен' },
				{ status: 400 }
			);
		}

		const card = await prisma.loyaltyCard.findFirst({
			where: { telegramId },
		});

		if (!card) {
			return NextResponse.json(
				{ error: 'Карта не найдена' },
				{ status: 404 }
			);
		}

		return NextResponse.json(card);
	} catch (error) {
		console.error('Ошибка при получении карты:', error);
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
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
				{ error: 'Поле telegramId обязательно' },
				{ status: 400 }
			);
		}

		const existingCard = await prisma.loyaltyCard.findFirst({
			where: { telegramId },
		});

		if (existingCard) {
			return NextResponse.json(
				{ error: 'Карта с таким telegramId уже существует' },
				{ status: 409 }
			);
		}

		const newCard = await prisma.loyaltyCard.create({
			data: {
				telegramId,
				amount: 0,
				userId: null,
			},
		});

		return NextResponse.json(
			{
				message: 'Карта успешно создана',
				card: newCard
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Ошибка при создании карты:', error);
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { telegramId } = body;

		if (!telegramId) {
			return NextResponse.json(
				{ error: 'Поле telegramId обязательно' },
				{ status: 400 }
			);
		}

		const card = await prisma.loyaltyCard.findFirst({
			where: { telegramId },
		});

		if (!card) {
			return NextResponse.json(
				{ error: 'Карта не найдена' },
				{ status: 404 }
			);
		}

		const userId = request.headers.get('x-user-id') as string;
		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized request' }, { status: 401 });
		}

		if (card.userId && card.userId !== userId) {
			return NextResponse.json(
				{ error: 'Карта уже привязана к другому пользователю' },
				{ status: 403 }
			);
		}

		const updatedCard = await prisma.loyaltyCard.update({
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

		return NextResponse.json({
			message: 'Карта успешно привязана к вашему аккаунту',
			card: updatedCard,
		});
	} catch (error) {
		console.error('Ошибка при обновлении карты:', error);
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		);
	}
}
