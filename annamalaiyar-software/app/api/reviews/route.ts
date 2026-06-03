import { NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'

export const GET = withAdminAuth(async () => {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(reviews)
})