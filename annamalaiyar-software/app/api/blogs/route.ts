import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'
import { blogSchema } from '@/lib/validators'

export const GET = withAdminAuth(async () => {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(blogs)
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const data = blogSchema.parse(body)
  const blog = await prisma.blog.create({ data })
  return NextResponse.json(blog)
})