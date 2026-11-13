'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Gamepad2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const games = [
  { slug: 'roblox', name: 'Roblox', product: 'Robux', image: 'roblox.jpg' },
  { slug: 'mobile-legends', name: 'Mobile Legends: Bang Bang', product: 'Diamonds', image: 'mobile legend.jpg' },
  { slug: 'free-fire', name: 'Free Fire', product: 'Diamonds', image: 'free fire.jpg' },
  { slug: 'pubg-mobile', name: 'PUBG Mobile', product: 'UC', image: 'pubgm.jpg' },
  { slug: 'genshin-impact', name: 'Genshin Impact', product: 'Genesis Crystals', image: 'gensin impat.jpg' },
  { slug: 'valorant', name: 'Valorant', product: 'VP', image: 'valoran.jpg' },
  { slug: 'honor-of-kings', name: 'Honor of Kings', product: 'Tokens', image: 'honor of king.jpg' },
  { slug: 'call-of-duty-mobile', name: 'Call of Duty: Mobile', product: 'CP', image: 'call of duty.jpg' },
]

export function GameTopUpSelector() {
  const { language } = useLanguage()
  const isIndonesian = language === 'id'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] px-4 pb-20 pt-32 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-[#171216] via-[#0b0b0d] to-[#0b0b0d]" />
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ff4655]/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="valorant-eyebrow">
            <Gamepad2 className="h-4 w-4" />
            {isIndonesian ? 'Pilih misi' : 'Select your mission'}
          </span>
          <h1 className="mt-5 text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
            {isIndonesian ? 'Pilih game.' : 'Choose your game.'}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            {isIndonesian
              ? 'Temukan paket pilihanmu. Transaksi top up tersedia dari toko partner terverifikasi.'
              : 'Find your next top-up. Packages are available from verified partner stores.'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game, index) => {
            const href = `/topup-game/${game.slug}`

            return (
              <Link
                key={game.name}
                href={href}
                className="valorant-game-card group relative flex min-h-64 flex-col justify-end overflow-hidden border border-white/10 bg-[#141416]/90 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#ff4655]/60"
              >
                <Image
                  src={`/games/${game.image}`}
                  alt={`${game.name} thumbnail`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5 transition group-hover:from-black/90" />
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/50 text-white backdrop-blur-sm">
                  <span className="absolute -left-2 -top-2 text-[9px] font-black tracking-widest text-[#ff6874]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:text-[#ff6873]" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-lg font-black text-white sm:text-xl">{game.name}</h2>
                  <p className="mt-1 text-xs text-white/70">
                    {isIndonesian ? `Lihat toko dan paket ${game.product}` : `View ${game.product} stores and packages`}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border border-[#ff4655]/20 bg-[#141416]/80 p-5 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-black text-white">
              {isIndonesian ? 'Punya toko top up?' : 'Have a top-up store?'}
            </h2>
            <p className="mt-1 text-sm text-white/55">
              {isIndonesian
                ? 'Daftar sebagai partner. Toko akan tampil setelah disetujui admin.'
                : 'Register as a partner. Your store appears after admin approval.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/partner/login" className="border border-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">
              {isIndonesian ? 'Login partner' : 'Partner login'}
            </Link>
            <Link href="/partner/register" className="bg-[#ff4655] px-4 py-3 text-sm font-black text-white hover:bg-[#ff5c69]">
              {isIndonesian ? 'Daftar toko' : 'Register store'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
