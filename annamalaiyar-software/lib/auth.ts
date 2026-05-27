import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function signToken(payload: { email: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as { email: string }
}

export function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    return verifyToken(auth.split(' ')[1])
  } catch {
    return null
  }
}