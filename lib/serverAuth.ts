import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getRobloxAdminUserId, isAllowedRobloxUserId } from './roblox-auth'
import { getUserById } from './storage'

export async function getAuthUser() {
  const session = await getServerSession(authOptions)
  const robloxUserId = session?.user?.robloxUserId
  const dashboardUserId = getRobloxAdminUserId()

  if (
    !session?.user ||
    session.user.role !== 'admin' ||
    session.user.id !== dashboardUserId ||
    !isAllowedRobloxUserId(robloxUserId)
  ) {
    return null
  }

  const user = await getUserById(dashboardUserId)
  if (!user || user.role !== 'admin') return null

  const { password: _password, ...userWithoutPassword } = user
  return userWithoutPassword
}
