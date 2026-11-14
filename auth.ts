import type { NextAuthOptions } from 'next-auth'
import { getRobloxAdminUserId, hasRobloxAuthConfiguration, isAllowedRobloxUserId } from '@/lib/roblox-auth'
import { getUserById } from '@/lib/storage'

const robloxOAuthConfigured = Boolean(
  process.env.AUTH_ROBLOX_CLIENT_ID?.trim() && process.env.AUTH_ROBLOX_CLIENT_SECRET?.trim()
)

const providers: NextAuthOptions['providers'] = robloxOAuthConfigured
  ? [
      {
        id: 'roblox',
        name: 'Roblox',
        type: 'oauth',
        wellKnown: 'https://apis.roblox.com/oauth/.well-known/openid-configuration',
        clientId: process.env.AUTH_ROBLOX_CLIENT_ID!,
        clientSecret: process.env.AUTH_ROBLOX_CLIENT_SECRET!,
        authorization: {
          params: {
            scope: 'openid profile',
          },
        },
        idToken: true,
        checks: ['pkce', 'state'],
        profile(profile: {
          sub?: string
          name?: string
          preferred_username?: string
          email?: string
          picture?: string
        }) {
          const id = String(profile.sub || '')
          return {
            id,
            name: profile.name || profile.preferred_username || `Roblox ${id}`,
            email: profile.email ?? null,
            image: profile.picture ?? null,
          }
        },
      },
    ]
  : []

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ account, profile }) {
      const robloxUserId = String(profile?.sub ?? account?.providerAccountId ?? '')
      const isAllowedLogin =
        account?.provider === 'roblox' &&
        hasRobloxAuthConfiguration() &&
        isAllowedRobloxUserId(robloxUserId)
      if (!isAllowedLogin) return false

      const adminUser = await getUserById(getRobloxAdminUserId())
      return adminUser?.role === 'admin'
    },
    async redirect({ url, baseUrl }) {
      const base = new URL(baseUrl)
      const target = new URL(url, base)
      return target.origin === base.origin ? target.toString() : baseUrl
    },
    async session({ session, token }) {
      if (session.user) {
        const robloxUserId =
          token.authProvider === 'roblox' && isAllowedRobloxUserId(token.robloxUserId)
            ? token.robloxUserId
            : ''
        const dashboardUserId = robloxUserId ? getRobloxAdminUserId() : ''

        session.user.id = dashboardUserId
        session.user.role = dashboardUserId ? 'admin' : 'user'
        session.user.robloxUserId = robloxUserId
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.authProvider = account.provider
        token.robloxUserId =
          account.provider === 'roblox'
            ? String(profile?.sub ?? account.providerAccountId ?? '')
            : undefined
      }
      return token
    },
  },
}
