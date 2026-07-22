import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getUserById, getUserByUsername, createUser } from './storage'

export async function getAuthUser() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    // Gunakan user ID yang sudah di-set di callback session auth.ts
    const discordUserId = (session.user as { id?: string }).id || (session.user.email ? `discord-${session.user.email}` : 'discord-user')
    const username = session.user.name || session.user.email || 'Discord User'

    console.log('Discord auth - checking user:', discordUserId)

    // Cek apakah user sudah ada di storage lokal
    let existingUser = await getUserById(discordUserId)
    
    // Jika tidak ada, buat baru
    if (!existingUser) {
      try {
        existingUser = await createUser({
          id: discordUserId, // Gunakan userId string discord- sebagai id
          username: username,
          password: 'discord-auth', // Password dummy karena kita tidak butuh untuk Discord auth
          email: session.user.email || undefined,
          role: 'admin'
        })
        console.log('Created new discord user:', existingUser)
      } catch (error) {
        console.error('Error creating discord user:', error)
        // Jika gagal buat (misal username sudah ada), coba cari via username
        existingUser = await getUserByUsername(username)
      }
    }

    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser
      console.log('Returning existing user:', userWithoutPassword)
      return userWithoutPassword
    }

    console.log('Returning fallback discord user')
    return {
      id: discordUserId,
      username: username,
      email: session.user.email,
      role: 'admin' as const,
    }
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')
  
  if (!sessionId) {
    console.log('No session cookie found')
    return null
  }

  console.log('Checking local session:', sessionId.value)
  const user = await getUserById(sessionId.value)
  if (!user) {
    console.log('Local session user not found')
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  console.log('Returning local user:', userWithoutPassword)
  return userWithoutPassword
}
