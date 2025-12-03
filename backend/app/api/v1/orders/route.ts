import {createOrderSchema} from '@/app/schemas/order'
import {prisma} from '@/prisma/connection'
import {NextResponse} from 'next/server'
import {z} from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
          {message: 'Invalid input', details: z.treeifyError(parsed.error)},
          {status: 400})
    }

    const {items} = parsed.data

    const total = items.reduce(
        (sum, item) => {return sum + Number(item.price) * item.quantity}, 0)

    const userId = request.headers.get('x-user-id') as string

    const order = await prisma.order.create({
      data: {
        userId: userId,
        total,
        items: {
          create: items.map((i) => ({
                              userId: userId,
                              productId: i.productId,
                              quantity: i.quantity,
                              price: i.price,
                            })),
        },
      },
      include: {items: true},
    })

    return NextResponse.json({message: 'Order created successfully'}, {status: 201})
  } catch (e) {
    return NextResponse.json({message: 'Internal server error'}, {status: 500})
  }
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id') as string

    const orders = await prisma.order.findMany({
      where: {userId: userId},
      include: {items: true},
      orderBy: {createdAt: 'desc'},
    })

    return NextResponse.json({orders}, {status: 200})
  } catch (e) {
    return NextResponse.json({message: 'Internal server error'}, {status: 500})
  }
}
