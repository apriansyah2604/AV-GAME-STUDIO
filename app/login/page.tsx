import { LoginPageClient } from '@/components/LoginPageClient'
import { getUsers } from '@/lib/storage'

// Force dynamic rendering to avoid build errors
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const hasDiscordAuth = Boolean(
    process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET
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
      hasDiscordAuth={hasDiscordAuth}
      hasLocalAuth={hasLocalAuth}
    />
  )
}
