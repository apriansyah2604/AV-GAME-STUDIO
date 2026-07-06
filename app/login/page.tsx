import { LoginPageClient } from '@/components/LoginPageClient'
import { getUsers } from '@/lib/supabase-storage'

// Force dynamic rendering to avoid build errors
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const hasGoogleAuth = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  )
  
  let hasLocalAuth = false
  try {
    const users = await getUsers()
    hasLocalAuth = users.length > 0
  } catch (error) {
    console.error('Error checking users for login page:', error)
  }

  return (
    <LoginPageClient
      hasGoogleAuth={hasGoogleAuth}
      hasLocalAuth={hasLocalAuth}
    />
  )
}
