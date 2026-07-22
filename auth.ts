import type { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID || '',
      clientSecret: process.env.AUTH_DISCORD_SECRET || '',
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user is a member of the required Discord server
      const requiredGuildId = process.env.REQUIRED_DISCORD_SERVER_ID
      if (!requiredGuildId) {
        console.error('REQUIRED_DISCORD_SERVER_ID is not set in environment variables')
        return false // If no server ID is set, block login
      }

      // Fetch the user's guilds from Discord API
      try {
        const response = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${account?.access_token}`,
          },
        })

        if (!response.ok) {
          console.error('Failed to fetch user guilds from Discord')
          return false
        }

        const guilds = await response.json()
        const isMember = guilds.some((guild: any) => guild.id === requiredGuildId)

        if (!isMember) {
          console.error(`User ${user.id} is not a member of the required Discord server`)
          // Return false to block login, or you could redirect to an error page
          return false
        }

        return true
      } catch (error) {
        console.error('Error checking Discord server membership:', error)
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, token }) {
      if (session.user) {
        // Use Discord's unique user ID
        const userId = token.sub || (session.user.email ? `discord-${session.user.email}` : 'discord-user')
        ;(session.user as { id?: string }).id = userId
      }
      return session
    },
    async jwt({ token, user, account }) {
      return token
    },
  },
}
