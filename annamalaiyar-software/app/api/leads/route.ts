import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validators'
import { sendEmail } from '@/lib/email'
import { adminNotificationEmail, autoReplyEmail } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    // Save to database
    const lead = await prisma.lead.create({ data })

    // 1. Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Lead Received',
      html: adminNotificationEmail(
        lead.name,
        lead.email,
        lead.service || 'General Inquiry',
        lead.message
      ),
    })

    // 2. Auto-reply to the user
    await sendEmail({
      to: lead.email,
      subject: 'Thank you for contacting us',
      html: autoReplyEmail(lead.name),
    })

    return NextResponse.json({ message: 'Lead saved successfully' })
  } catch (error: any) {
    console.error('Lead creation error:', error)
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}