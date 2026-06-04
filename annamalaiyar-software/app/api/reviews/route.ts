import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { reviewSchema } from '@/lib/validators'

// GET – returns only approved reviews (for the public page)
export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

// POST – a visitor submits a new review (saved as unapproved)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = reviewSchema.parse(body)
    await prisma.review.create({
      data: {
        name: data.name,
        rating: data.rating,
        message: data.message,
        service: data.service,
        approved: false,          // must be approved by admin
      },
    })
    return NextResponse.json({ message: 'Review submitted' })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}