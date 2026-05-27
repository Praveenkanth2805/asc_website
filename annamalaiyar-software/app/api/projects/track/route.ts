import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const quoteId = searchParams.get('quoteId')

  let project = null
  if (email) {
    const lead = await prisma.lead.findFirst({ where: { email }, include: { projects: { take: 1, orderBy: { createdAt: 'desc' } } } })
    project = lead?.projects[0]
  } else if (quoteId) {
    const quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { lead: { include: { projects: true } } } })
    project = quote?.lead.projects[0]
  }

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ project })
}