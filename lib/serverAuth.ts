import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getUserById, getUserByUsername, createUser } from './supabase-storage'

export async function getAuthUser() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    // Gunakan user ID yang sudah di-set di callback session auth.ts
    const googleUserId = (session.user as { id?: string }).id || (session.user.email ? `google-${session.user.email}` : 'google-user')
    const username = session.user.name || session.user.email || 'Google User'

    console.log('Google auth - checking user:', googleUserId);

    // Cek apakah user sudah ada di Supabase
    let existingUser = await getUserById(googleUserId)
    
    // Jika tidak ada, buat baru
    if (!existingUser) {
      try {
        existingUser = await createUser({
          id: googleUserId, // Gunakan userId string google- sebagai id
          username: username,
          password: 'google-auth', // Password dummy karena kita tidak butuh untuk Google auth
          email: session.user.email || undefined,
          role: 'admin'
        })
        console.log('Created new google user:', existingUser);
      } catch (error) {
        console.error('Error creating google user:', error);
        // Jika gagal buat (misal username sudah ada), coba cari via username
        existingUser = await getUserByUsername(username)
      }
    }

    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser
      console.log('Returning existing user:', userWithoutPassword);
      return userWithoutPassword
    }

    console.log('Returning fallback google user');
    return {
      id: googleUserId,
      username: username,
      email: session.user.email,
      role: 'admin' as const,
    }
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session_id')
  
  if (!sessionId) {
    console.log('No session cookie found');
    return null
  }

  console.log('Checking local session:', sessionId.value);
  const user = await getUserById(sessionId.value)
  if (!user) {
    console.log('Local session user not found');
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  console.log('Returning local user:', userWithoutPassword);
  return userWithoutPassword
}
