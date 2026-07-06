import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, token, user }) {
      if (session.user) {
        // Pastikan user ID selalu sama untuk user yang sama
        // Gunakan token.sub (Google's unique user ID) jika tersedia, fallback ke email
        const userId = token.sub || (session.user.email ? `google-${session.user.email}` : 'google-user')
        ;(session.user as { id?: string }).id = userId
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Pastikan token.sub selalu tersedia
      return token
    },
  },
}
