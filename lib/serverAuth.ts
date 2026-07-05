import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getUserById } from './storage'

export async function getAuthUser() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return {
      id: (session.user as { id?: string }).id || session.user.email || session.user.name || 'google-user',
      username: session.user.name || session.user.email || 'Google User',
      email: session.user.email,
      role: 'admin' as const,
    }
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')
  
  if (!sessionId) {
    return null
  }

  const user = getUserById(sessionId.value)
  if (!user) {
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
