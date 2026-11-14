'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface User {
  id: string
  username: string
  email?: string | null
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  signInWithRoblox: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (status === 'authenticated' && session?.user?.id && session.user.role === 'admin') {
      setUser({
        id: session.user.id,
        username: session.user.name || 'Roblox User',
        email: session.user.email,
        role: 'admin',
      })
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [session, status])

  const logout = async () => {
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.error('NextAuth sign out failed:', error)
    }
    try {
      await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' })
    } catch (error) {
      console.error('Custom sign out failed:', error)
    }
    setUser(null)
  }

  const signInWithRoblox = async () => {
    await signIn('roblox', { callbackUrl: '/login' })
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, signInWithRoblox }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
