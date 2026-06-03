import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const quoteId = searchParams.get('quoteId')

  if (!email && !quoteId) {
    return NextResponse.json({ error: 'Please provide an email or Quote ID' }, { status: 400 })
  }

  let project = null
  let quote = null

  if (email) {
    // Case‑insensitive lead lookup
    const lead = await prisma.lead.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      include: {
        projects: { take: 1, orderBy: { createdAt: 'desc' } },
        quotes: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    })
    project = lead?.projects[0] || null
    quote = lead?.quotes[0] || null
  } else if (quoteId) {
    // 1. Try to find a project directly linked to this quoteId
    project = await prisma.project.findFirst({
      where: { quoteId },
      orderBy: { createdAt: 'desc' },
    })

    // 2. If no project found, look up the quote and its lead
    if (!project) {
      const foundQuote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: {
          lead: {
            include: {
              projects: { take: 1, orderBy: { createdAt: 'desc' } },
            },
          },
        },
      })

      if (foundQuote) {
        quote = foundQuote
        // Fallback to lead's latest project, but only if not already set
        project = foundQuote.lead?.projects[0] || null
      }
    }
  }

  if (!project && !quote) {
    return NextResponse.json({ error: 'No project or quote found' }, { status: 404 })
  }

  return NextResponse.json({ project, quote })
}