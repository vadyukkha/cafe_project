import { OrderStatus } from '@/src/enums/order_status'
import { prisma } from '@/prisma/connection'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const { draftToken } = await request.json()
    const userId = request.headers.get('x-user-id')

    if (!draftToken) {
      return NextResponse.json(
        { message: 'draftToken are required' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: draftToken }
    })

    if (!order || order.userId !== userId) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        { message: 'Order already confirmed', order },
        { status: 200 }
      )
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.PAID }
    })

    return NextResponse.json(
      { message: 'Order confirmed successfully', order_id: order.id },
      { status: 200 }
    )
  } catch (_) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
