import { OrderStatus } from '@/app/enums/order_status'
import { createOrderSchema } from '@/app/schemas/order'
import { prisma } from '@/prisma/connection'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const parsed = createOrderSchema.safeParse(body)

		if (!parsed.success) {
			return NextResponse.json(
				{ message: 'Invalid input', details: z.treeifyError(parsed.error) },
				{ status: 400 })
		}

		const { items } = parsed.data

		const dbProducts = await prisma.product.findMany(
			{ where: { id: { in: items.map(i => i.productId) } } })

		if (dbProducts.length !== items.length) {
			return NextResponse.json(
				{ message: 'Some products were not found' }, { status: 400 })
		}

		const orderItems = items.map((i) => {
			const dbProduct = dbProducts.find(p => p.id === i.productId)!
			return {
				productId: dbProduct.id,
				quantity: i.quantity,
				price: dbProduct.price,
				userId,
			}
		})

		const total = orderItems.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

		const userId = request.headers.get('x-user-id') as string

        const draftToken = uuidv4()

		await prisma.order.create({
			data: {
                draftToken,
                userId, 
                status: OrderStatus.PENDING,
                total,
                items: { create: orderItems } 
            },
			include: { items: true }
		})

		return NextResponse.json(
			{ draft_id: draftToken }, { status: 201 })
	} catch (_) {
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
	}
}
