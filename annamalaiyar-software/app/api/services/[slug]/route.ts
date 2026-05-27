import { prisma } from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } })
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(service)
}