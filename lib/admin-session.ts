import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const cookieName = 'partner_admin_session'
const lifetimeSeconds = 60 * 60 * 8

function sign(payload: string) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is required for admin sessions.')
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function createAdminSession(userId: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + lifetimeSeconds
  const payload = `${userId}.${expiresAt}`
  return `${payload}.${sign(payload)}`
}

export async function setAdminSessionCookie(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(cookieName, createAdminSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: lifetimeSeconds,
    path: '/',
  })
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}

export async function getAuthenticatedAdmin() {
  const token = (await cookies()).get(cookieName)?.value
  if (!token) return null

  const [userId, expiresAtValue, signature] = token.split('.')
  const expiresAt = Number(expiresAtValue)
  if (!userId || !Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !signature) {
    return null
  }

  const payload = `${userId}.${expiresAt}`
  const expected = Buffer.from(sign(payload), 'hex')
  const provided = Buffer.from(signature, 'hex')
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null

  const { data, error } = await getSupabaseAdmin()
    .from('users')
    .select('id, username, role')
    .eq('id', userId)
    .eq('role', 'admin')
    .maybeSingle()

  if (error) throw error
  return data
}
