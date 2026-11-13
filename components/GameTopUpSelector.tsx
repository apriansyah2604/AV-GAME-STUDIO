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
    <main className="relative min-h-screen overflow-hidden bg-[#030303] px-4 pb-20 pt-32 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07101d] via-[#030303] to-[#030303]" />
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ff4655]/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ff4655]/30 bg-[#ff4655]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ff7780]">
            <Gamepad2 className="h-4 w-4" />
            {isIndonesian ? 'Pilih Game' : 'Choose a Game'}
          </span>
          <h1 className="mt-5 text-3xl font-black uppercase sm:text-5xl">
            {isIndonesian ? 'Mau Top Up Game Apa?' : 'Which Game Do You Play?'}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
            {isIndonesian
              ? 'Pilih game untuk membuka halaman top up atau menghubungi seller.'
              : 'Choose a game to open its top-up page or contact the seller.'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {games.map((game) => {
            const href = `/topup-game/${game.slug}`

            return (
              <Link
                key={game.name}
                href={href}
                className="group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#08111F]/80 p-5 transition hover:-translate-y-1 hover:border-[#ff4655]/50"
              >
                <Image
                  src={`/games/${game.image}`}
                  alt={`${game.name} thumbnail`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5 transition group-hover:from-black/90" />
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm">
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
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-5 text-center sm:flex-row sm:text-left">
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
            <Link href="/partner/login" className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">
              {isIndonesian ? 'Login partner' : 'Partner login'}
            </Link>
            <Link href="/partner/register" className="rounded-xl bg-[#ff4655] px-4 py-3 text-sm font-black text-white hover:bg-[#ff5c69]">
              {isIndonesian ? 'Daftar toko' : 'Register store'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
