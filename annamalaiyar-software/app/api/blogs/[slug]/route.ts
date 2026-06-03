import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'
import { blogSchema } from '@/lib/validators'

export const GET = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params
  const blog = await prisma.blog.findUnique({ where: { id } })
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(blog)
})

export const PUT = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params
  const body = await req.json()
  const data = blogSchema.parse(body)
  const blog = await prisma.blog.update({ where: { id }, data })
  return NextResponse.json(blog)
})

export const DELETE = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params
  await prisma.blog.delete({ where: { id } })
  return NextResponse.json({ message: 'Deleted' })
})