import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { uploadImage } from '@/lib/cloudinary'

export const POST = withAdminAuth(async (req: NextRequest) => {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await uploadImage(`data:${file.type};base64,${buffer.toString('base64')}`)
  return NextResponse.json({ url })
})