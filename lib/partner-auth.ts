import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const scrypt = promisify(scryptCallback)
const sessionCookieName = 'partner_session'
const sessionLifetimeSeconds = 60 * 60 * 24 * 7

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is required for partner sessions.')
  return secret
}

export async function hashPartnerPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scrypt(password, salt, 64) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPartnerPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(':')
  if (!salt || !expectedHex || !/^[a-f0-9]{128}$/i.test(expectedHex)) return false

  const actual = await scrypt(password, salt, 64) as Buffer
  const expected = Buffer.from(expectedHex, 'hex')
  return timingSafeEqual(actual, expected)
}

function signSession(payload: string) {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('hex')
}

export async function setPartnerSession(partnerId: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds
  const payload = `${partnerId}.${expiresAt}`
  const cookieStore = await cookies()

  cookieStore.set(sessionCookieName, `${payload}.${signSession(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: sessionLifetimeSeconds,
    path: '/',
  })
}

export async function clearPartnerSession() {
  const cookieStore = await cookies()
  cookieStore.delete(sessionCookieName)
}

async function getPartnerIdFromSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value
  if (!token) return null

  const [partnerId, expiresAtValue, signature] = token.split('.')
  if (!partnerId || !expiresAtValue || !signature) return null

  const expiresAt = Number(expiresAtValue)
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return null

  const payload = `${partnerId}.${expiresAt}`
  const expected = Buffer.from(signSession(payload), 'hex')
  const provided = Buffer.from(signature, 'hex')
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null

  return partnerId
}

export async function getPartnerIdentity() {
  const partnerId = await getPartnerIdFromSession()
  if (!partnerId) return null

  const { data, error } = await getSupabaseAdmin()
    .from('partner_accounts')
    .select('id, store_name, email, whatsapp, status')
    .eq('id', partnerId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getApprovedPartner() {
  const partner = await getPartnerIdentity()
  return partner?.status === 'approved' ? partner : null
}
