import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from './auth'

export function withAdminAuth(handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    const user = getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return handler(req, context)
  }
}