import { LoginPageClient } from '@/components/LoginPageClient'
import { getUsers } from '@/lib/storage'

export default function LoginPage() {
  const hasGoogleAuth = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  )
  const hasLocalAuth = getUsers().length > 0

  return (
    <LoginPageClient
      hasGoogleAuth={hasGoogleAuth}
      hasLocalAuth={hasLocalAuth}
    />
  )
}
