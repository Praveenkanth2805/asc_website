import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  await prisma.admin.update({
    where: { email },
    data: { otp, otpExp: new Date(Date.now() + 5 * 60 * 1000) },
  })

  await sendEmail({
    to: email,
    subject: 'Your Admin OTP',
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
  })

  return NextResponse.json({ message: 'OTP sent' })
}