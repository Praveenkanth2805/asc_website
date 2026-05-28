import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'
import { quoteSchema } from '@/lib/validators'
import { sendEmail } from '@/lib/email'
import { quoteEmail } from '@/lib/email-templates'

export const GET = withAdminAuth(async () => {
  const quotes = await prisma.quote.findMany({
    include: { lead: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(quotes)
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const data = quoteSchema.parse(body)

    // Create the quote
    const quote = await prisma.quote.create({ data })

    // Fetch lead's email
    const lead = await prisma.lead.findUnique({
      where: { id: data.leadId },
      select: { email: true, name: true },
    })

    if (lead?.email) {
      // Send quote to the lead
      await sendEmail({
        to: lead.email,
        subject: 'Your Quote from Annamalaiyar Software Centre',
        html: quoteEmail(
          data.serviceName,
          data.price,
          data.description,
          data.deliveryTime,
          quote.id
        ),
      })
    }

    return NextResponse.json(quote)
  } catch (error: any) {
    console.error('Quote creation error:', error)
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 400 })
  }
})