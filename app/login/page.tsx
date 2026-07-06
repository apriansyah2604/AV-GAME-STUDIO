import { LoginPageClient } from '@/components/LoginPageClient'
import { getUsers } from '@/lib/supabase-storage'

export default async function LoginPage() {
  const hasGoogleAuth = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  )
  const users = await getUsers()
  const hasLocalAuth = users.length > 0

  return (
    <LoginPageClient
      hasGoogleAuth={hasGoogleAuth}
      hasLocalAuth={hasLocalAuth}
    />
  )
}
