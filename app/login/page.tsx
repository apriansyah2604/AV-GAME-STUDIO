import { LoginPageClient } from '@/components/LoginPageClient'
import { getRobloxAdminUserId, hasRobloxAuthConfiguration } from '@/lib/roblox-auth'

// Force dynamic rendering to avoid build errors
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  let hasRobloxAuth = hasRobloxAuthConfiguration()
  if (hasRobloxAuth) {
    try {
      const { getUserById } = await import('@/lib/storage')
      const adminUser = await getUserById(getRobloxAdminUserId())
      hasRobloxAuth = adminUser?.role === 'admin'
    } catch (error) {
      console.error('Error checking the configured Roblox admin account:', error)
      hasRobloxAuth = false
    }
  }

  return (
    <LoginPageClient
      hasRobloxAuth={hasRobloxAuth}
    />
  )
}
