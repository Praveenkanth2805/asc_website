import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'
import { serviceSchema } from '@/lib/validators'
import { ZodError } from 'zod'

export const GET = withAdminAuth(async () => {
  const services = await prisma.service.findMany()
  return NextResponse.json(services)
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const data = serviceSchema.parse(body)

    const service = await prisma.service.create({ data })

    return NextResponse.json(service)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error(error)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
})