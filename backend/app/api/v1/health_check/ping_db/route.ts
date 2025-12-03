import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/connection'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      message: 'Database worked!',
      timestamp: new Date().toISOString(),
    },
    { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Database is not working',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
