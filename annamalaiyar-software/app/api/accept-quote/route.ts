import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { quoteStatusEmail } from '@/lib/email-templates'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const quoteId = searchParams.get('quoteId')
  if (!quoteId) {
    return NextResponse.json({ error: 'Missing quoteId' }, { status: 400 })
  }

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { lead: { select: { id: true, name: true } } }
  })
  if (!quote) {
    return new NextResponse('Quote not found', { status: 404 })
  }
  if (quote.status === 'ACCEPTED') {
    return new NextResponse('Quote already accepted', { status: 200, headers: { 'Content-Type': 'text/html' } })
  }

  // Update quote status to ACCEPTED
  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: 'ACCEPTED' }
  })

  // Update lead status to ACCEPTED
  if (quote.lead?.id) {
    await prisma.lead.update({
      where: { id: quote.lead.id },
      data: { status: 'ACCEPTED' }
    })
  }

  // Create a project automatically (optional – you can skip this if you prefer manual)
  // We'll create a project if none exists for this lead yet
  const existingProject = await prisma.project.findFirst({
    where: { leadId: quote.leadId }
  })
  if (!existingProject) {
    await prisma.project.create({
      data: {
        leadId: quote.leadId,
        quoteId: quote.id,
        status: 'PROJECT_STARTED',
        progressNote: 'Project automatically created after quote acceptance.',
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    })
  }

  // Notify admin
  if (quote.lead) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'Quote Accepted by Client',
      html: quoteStatusEmail(quote, quote.lead.name, 'ACCEPTED')
    })
  }

  // Show success page
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Quote Accepted</title>
    <style>body{background:#0B0B0B;color:#fff;font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}
    .card{background:#1A1A1A;border:1px solid #B8860B;border-radius:12px;padding:40px;text-align:center;}
    h1{color:#B8860B;} p{color:#ccc;}</style></head>
    <body><div class="card"><h1>🎉 Thank You!</h1><p>Your acceptance has been recorded. We will contact you shortly.</p></div></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}