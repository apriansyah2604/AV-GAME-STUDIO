import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getRobloxAdminUserId, isAllowedRobloxUserId } from '@/lib/roblox-auth'

const cookieName = 'partner_admin_session'

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}

export async function getAuthenticatedAdmin() {
  const session = await getServerSession(authOptions)
  const robloxUserId = session?.user?.robloxUserId
  const userId = getRobloxAdminUserId()

  if (
    !session?.user ||
    session.user.role !== 'admin' ||
    session.user.id !== userId ||
    !isAllowedRobloxUserId(robloxUserId)
  ) {
    return null
  }

  const { data, error } = await getSupabaseAdmin()
    .from('users')
    .select('id, username, role')
    .eq('id', userId)
    .eq('role', 'admin')
    .maybeSingle()

  if (error) throw error
  return data
}
