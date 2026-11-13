import { LoginPageClient } from '@/components/LoginPageClient'

// Force dynamic rendering to avoid build errors
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const hasDiscordAuth = Boolean(
    process.env.AUTH_DISCORD_ID &&
    process.env.AUTH_DISCORD_SECRET &&
    process.env.REQUIRED_DISCORD_SERVER_ID
  )

  let hasLocalAuth = false
  if (hasSupabaseConfig) {
    try {
      const { getUsers } = await import('@/lib/storage')
      const users = await getUsers()
      hasLocalAuth = users.length > 0
    } catch (error) {
      console.error('Error checking users for login page:', error)
    }
  }

  return (
    <LoginPageClient
      hasDiscordAuth={hasDiscordAuth}
      hasLocalAuth={hasLocalAuth}
      hasSupabaseConfig={hasSupabaseConfig}
    />
  )
}
