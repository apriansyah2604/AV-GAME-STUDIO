'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Store } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

type PartnerProduct = {
  id: string
  name: string
  amount: string
  description: string
  price: number
  partner_accounts: {
    store_name: string
  }
}

type GameDetails = {
  slug: string
  name: string
  product: string
}

export function GameTopUpPrices({ game }: { game: GameDetails }) {
  const { language } = useLanguage()
  const isIndonesian = language === 'id'
  const [products, setProducts] = useState<PartnerProduct[]>([])
  const [customerIdentifier, setCustomerIdentifier] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkoutId, setCheckoutId] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/partner-stores?game=${encodeURIComponent(game.slug)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Gagal memuat katalog partner.')
        setProducts(result.products || [])
      })
      .catch((fetchError: unknown) => {
        if (fetchError instanceof Error && fetchError.name === 'AbortError') return
        setError(fetchError instanceof Error ? fetchError.message : 'Gagal memuat katalog partner.')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [game.slug])

  const handleCheckout = async (productId: string) => {
    if (!customerIdentifier.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setError(isIndonesian
        ? 'Isi ID/username game dan email yang valid terlebih dahulu.'
        : 'Enter your game ID/username and a valid email first.')
      return
    }

    setCheckoutId(productId)
    setError('')
    try {
      const response = await fetch('/api/partner-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerIdentifier: customerIdentifier.trim(),
          customerEmail: customerEmail.trim(),
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.success || !result.redirect_url) {
        throw new Error(result.message || 'Checkout gagal dibuat.')
      }
      window.location.assign(result.redirect_url)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout gagal dibuat.')
      setCheckoutId(null)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] px-4 pb-20 pt-32 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-[#171216] via-[#0b0b0d] to-[#0b0b0d]" />
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ff4655]/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-5xl">
        <Link
          href="/topup-game"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {isIndonesian ? 'Semua game' : 'All games'}
        </Link>

        <div className="mb-8 mt-8">
          <p className="valorant-eyebrow">
            {isIndonesian ? 'Toko partner' : 'Partner stores'}
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase sm:text-5xl">{game.name}</h1>
          <p className="mt-3 text-white/55">
            {isIndonesian
              ? `Pilih paket ${game.product} dari toko partner. Harga ditetapkan masing-masing partner.`
              : `Choose a ${game.product} package from a partner store. Each partner sets their own price.`}
          </p>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-[#08111F]/85 p-4 sm:grid-cols-2 sm:p-5">
          <label className="text-xs font-bold text-white/65">
            {isIndonesian ? 'ID / username game' : 'Game ID / username'}
            <input
              value={customerIdentifier}
              onChange={(event) => setCustomerIdentifier(event.target.value)}
              maxLength={100}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4655]/60"
              placeholder={isIndonesian ? 'Masukkan ID tujuan top up' : 'Enter the account to top up'}
            />
          </label>
          <label className="text-xs font-bold text-white/65">
            Email untuk bukti transaksi
            <input
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              maxLength={254}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#ff4655]/60"
              placeholder="nama@email.com"
            />
          </label>
        </div>

        <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100/90">
          {isIndonesian
            ? 'Pembayaran masuk ke platform. Komisi platform 5%; bagian partner 95% dicatat untuk rekonsiliasi dan payout manual oleh admin. Partner memproses item secara manual setelah pembayaran terverifikasi.'
            : 'Payments go to the platform. The 5% platform fee and 95% partner share are recorded for reconciliation and manual payout by the admin. Partners fulfill orders manually after payment is verified.'}
        </div>

        {error && (
          <p role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-white/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            {isIndonesian ? 'Memuat toko partner...' : 'Loading partner stores...'}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-white/10 bg-[#141416]/90 p-8 text-center">
            <Store className="mx-auto h-10 w-10 text-[#ff7780]" />
            <h2 className="mt-4 text-xl font-black text-white">
              {isIndonesian ? 'Belum ada paket tersedia' : 'No packages available yet'}
            </h2>
            <p className="mt-2 text-sm text-white/55">
              {isIndonesian
                ? 'Partner untuk game ini belum memiliki produk aktif.'
                : 'No partner has active products for this game yet.'}
            </p>
            <Link href="/partner/register" className="mt-5 inline-flex bg-[#ff4655] px-5 py-3 text-sm font-black text-white">
              {isIndonesian ? 'Daftar jadi partner' : 'Become a partner'}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="valorant-game-card relative overflow-hidden border border-white/10 bg-[#141416]/90 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#ff7780]">
                      {product.partner_accounts.store_name}
                    </p>
                    <h2 className="mt-2 text-lg font-black text-white">{product.name}</h2>
                    <p className="mt-1 text-sm text-white/55">{product.amount}</p>
                    {product.description && <p className="mt-2 text-xs text-white/45">{product.description}</p>}
                  </div>
                  <Store className="h-5 w-5 shrink-0 text-white/45" />
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="text-xl font-black text-white">Rp{Number(product.price).toLocaleString('id-ID')}</span>
                  <button
                    type="button"
                    onClick={() => handleCheckout(product.id)}
                    disabled={checkoutId !== null}
                    className="inline-flex min-w-32 items-center justify-center gap-2 bg-[#ff4655] px-4 py-3 text-xs font-black uppercase text-white transition hover:bg-[#ff5c69] disabled:opacity-50"
                  >
                    {checkoutId === product.id && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isIndonesian ? 'Bayar' : 'Pay'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
