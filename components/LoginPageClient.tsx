'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Gamepad2, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

interface LoginPageClientProps {
  hasRobloxAuth: boolean
}

export function LoginPageClient({ hasRobloxAuth }: LoginPageClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithRoblox, user, loading } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/management')
    }
  }, [user, loading, router])

  const handleRobloxLogin = async () => {
    setIsLoading(true)
    try {
      await signInWithRoblox()
    } catch (error) {
      console.error('Roblox login failed:', error)
      addToast('Roblox login failed. Please try again.', 'error')
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[#00AFFF]" size={48} />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#07101d] to-[#030303]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-[#00AFFF]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#07101d]/80 backdrop-blur-xl border border-[#00AFFF]/20 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">
              <span className="text-white">AV</span>{' '}
              <span className="text-[#00AFFF] neon-text">STUDIO</span>
            </h1>
            <p className="text-white/60 text-sm">
              Sign in with your Roblox account to access management
            </p>
          </div>

          {hasRobloxAuth ? (
            <button
              onClick={handleRobloxLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Gamepad2 size={20} />
              )}
              Continue with Roblox
            </button>
          ) : (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              Roblox login belum dikonfigurasi. Isi kredensial OAuth Roblox, daftar ID
              Roblox yang diizinkan, konfigurasi Supabase, dan ID admin Supabase yang valid
              di file .env.local.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
