import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const services = await prisma.service.findMany()
  return NextResponse.json(services)
}