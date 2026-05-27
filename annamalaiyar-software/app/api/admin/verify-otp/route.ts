import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json()
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin || admin.otp !== otp || !admin.otpExp || admin.otpExp < new Date()) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })
  }
  await prisma.admin.update({ where: { email }, data: { otp: null, otpExp: null } })
  const token = signToken({ email })
  return NextResponse.json({ token })
}