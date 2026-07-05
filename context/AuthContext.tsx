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
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout, forcing check custom session')
        checkCustomSession()
      }
    }, 3000) // 3 seconds timeout
    return () => clearTimeout(timeout)
  }, [loading])

  // Handle session from NextAuth
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const googleUser: User = {
        id: session.user.id || 'google-user-' + Date.now(),
        username: session.user.name || session.user.email || 'Google User',
        email: session.user.email,
        role: 'admin', // Default to admin for Google users
      }
      setUser(googleUser)
      setLoading(false)
    } else if (status === 'unauthenticated') {
      // Check our custom session
      checkCustomSession()
    } else if (status === 'loading') {
      // Still loading NextAuth, wait a bit then check custom as fallback
      const fallbackTimeout = setTimeout(() => {
        checkCustomSession()
      }, 2000)
      return () => clearTimeout(fallbackTimeout)
    }
  }, [session, status])

  // Check our custom session (for username/password login)
  const checkCustomSession = async () => {
    try {
      const res = await fetch('/api/local-auth/session', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to check session:', error)
      setUser(null)
    } finally {
      // Always set loading to false after checking
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        cache: 'no-store',
      })

      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    // Sign out from NextAuth
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.error('NextAuth sign out failed:', error)
    }
    // Sign out from our custom session
    try {
      await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' })
    } catch (error) {
      console.error('Custom sign out failed:', error)
    }
    setUser(null)
  }

  const signInWithGoogle = async () => {
    await signIn('google')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signInWithGoogle }}>
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
