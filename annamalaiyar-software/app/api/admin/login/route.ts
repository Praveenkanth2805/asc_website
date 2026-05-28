import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'
import { otpEmail } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 1. Validate credentials
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 2. Generate OTP and store in DB
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.admin.update({
      where: { email },
      data: {
        otp,
        otpExp: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    })

    // 3. Send OTP email
    await sendEmail({
      to: email,
      subject: 'Your Admin OTP',
      html: otpEmail(otp),
    })

    return NextResponse.json({ message: 'OTP sent to your email' })
  } catch (error) {
    console.error('Login step 1 error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}