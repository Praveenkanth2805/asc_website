import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'
import { serviceSchema } from '@/lib/validators'

export const PUT = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const body = await req.json()
  const data = serviceSchema.parse(body)
  const service = await prisma.service.update({ where: { id: params.id }, data })
  return NextResponse.json(service)
})

export const DELETE = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await prisma.service.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Deleted' })
})