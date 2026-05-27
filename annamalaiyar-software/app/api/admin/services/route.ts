import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'
import { serviceSchema } from '@/lib/validators'

export const GET = withAdminAuth(async () => {
  const services = await prisma.service.findMany()
  return NextResponse.json(services)
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const data = serviceSchema.parse(body)
  const service = await prisma.service.create({ data })
  return NextResponse.json(service)
})