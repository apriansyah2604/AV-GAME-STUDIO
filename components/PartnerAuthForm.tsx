'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PartnerAuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const isRegister = mode === 'register'
  const [storeName, setStoreName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(isRegister ? '/api/partners/register' : '/api/partners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName, email, whatsapp, password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Permintaan gagal.')

      if (isRegister) {
        router.push('/partner/login?registered=1')
        return
      }
      router.push('/partner/dashboard')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Permintaan gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030303] px-4 py-20">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#08111F]/90 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff7780]">AV Game Studio · Partner</p>
        <h1 className="mt-3 text-3xl font-black text-white">
          {isRegister ? 'Daftar toko partner' : 'Login partner'}
        </h1>
        <p className="mt-2 text-sm text-white/55">
          {isRegister
            ? 'Lengkapi data toko. Admin akan meninjau pendaftaran sebelum toko tampil.'
            : 'Masuk untuk mengelola produk dan pesanan toko.'}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {isRegister && (
            <>
              <label className="block text-sm font-bold text-white/70">
                Nama toko
                <input required minLength={2} maxLength={60} value={storeName} onChange={(event) => setStoreName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff4655]" />
              </label>
              <label className="block text-sm font-bold text-white/70">
                WhatsApp toko (format internasional, contoh 62812...)
                <input required inputMode="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff4655]" />
              </label>
            </>
          )}
          <label className="block text-sm font-bold text-white/70">
            Email
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff4655]" />
          </label>
          <label className="block text-sm font-bold text-white/70">
            Password {isRegister && '(minimal 10 karakter)'}
            <input required type="password" minLength={isRegister ? 10 : undefined} autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff4655]" />
          </label>

          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}

          <button disabled={loading} className="w-full rounded-xl bg-[#ff4655] px-4 py-3 font-black text-white transition hover:bg-[#ff5c69] disabled:opacity-50">
            {loading ? 'Memproses...' : isRegister ? 'Kirim pendaftaran' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          {isRegister ? 'Sudah punya akun?' : 'Belum punya toko?'}{' '}
          <Link className="font-bold text-[#ff7780] hover:text-white" href={isRegister ? '/partner/login' : '/partner/register'}>
            {isRegister ? 'Login' : 'Daftar partner'}
          </Link>
        </p>
        <Link href="/topup-game" className="mt-4 block text-center text-xs text-white/40 hover:text-white">Kembali ke katalog game</Link>
      </section>
    </main>
  )
}
