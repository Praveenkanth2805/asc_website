import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validators'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)
    const lead = await prisma.lead.create({ data })

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Lead Received',
      html: `<p><strong>${lead.name}</strong> (${lead.email}) is interested in ${lead.service || 'general inquiry'}.</p><p>${lead.message}</p>`
    })

    await sendEmail({
      to: lead.email,
      subject: 'Thank you for contacting Annamalaiyar Software Centre',
      html: `<p>Dear ${lead.name},</p><p>We have received your inquiry and will get back to you soon.</p>`
    })

    return NextResponse.json({ message: 'Lead created' })
  } catch (e: any) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}