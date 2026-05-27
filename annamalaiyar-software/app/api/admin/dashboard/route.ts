import { NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'

export const GET = withAdminAuth(async () => {
  const totalLeads = await prisma.lead.count()
  const activeProjects = await prisma.project.count({ where: { status: { in: ['IN_PROGRESS', 'PROJECT_STARTED'] } } })
  const completedProjects = await prisma.project.count({ where: { status: 'COMPLETED' } })
  return NextResponse.json({ totalLeads, activeProjects, completedProjects })
})