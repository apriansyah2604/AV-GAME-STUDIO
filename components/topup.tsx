"use client"

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Search,
  ShieldCheck,
  Shirt,
  Store,
} from 'lucide-react'

const robuxPackages = [
  {
    name: '100 Robux',
    price: 'Rp 15.000',
    description: 'Pilihan hemat untuk top up kecil, trial buy, atau kebutuhan item ringan.',
    badge: 'FAST',
    meta: 'Proses 5-15 menit',
    stock: 'Ready',
    message:
      'Halo AV GAME STUDIO, saya ingin top up 100 Robux dengan harga Rp 15.000. Mohon info proses dan pembayarannya ya.',
  },
  {
    name: '300 Robux',
    price: 'Rp 50.000',
    description: 'Nominal favorit untuk gamepass, UGC basic, dan kebutuhan top up harian.',
    badge: 'BEST SELLER',
    meta: 'Paling sering dipesan',
    stock: 'Ready',
    message:
      'Halo AV GAME STUDIO, saya ingin top up 300 Robux dengan harga Rp 50.000. Mohon info proses dan pembayarannya ya.',
    featured: true,
  },
  {
    name: '1000 Robux',
    price: 'Rp 150.000',
    description: 'Cocok untuk pembelian item premium, bundle avatar, dan kebutuhan creator.',
    badge: 'SAVE MORE',
    meta: 'Paket hemat besar',
    stock: 'Ready',
    message:
      'Halo AV GAME STUDIO, saya ingin top up 1000 Robux dengan harga Rp 150.000. Mohon info proses dan pembayarannya ya.',
  },
  {
    name: '2000 Robux',
    price: 'Rp 290.000',
    description: 'Pilihan terbaik untuk top up skala besar dengan harga lebih bersahabat.',
    badge: 'BIG VALUE',
    meta: 'Untuk player aktif',
    stock: 'Ready',
    message:
      'Halo AV GAME STUDIO, saya ingin top up 2000 Robux dengan harga Rp 290.000. Mohon info proses dan pembayarannya ya.',
  },
]

const avatarServices = [
  {
    title: 'Pembuatan Jaket Komunitas',
    description: 'Desain dan pembuatan jaket khusus untuk komunitas atau grup Roblox-mu.',
    price: 'Rp 300.000',
    badge: 'PREMIUM',
    message:
      'Halo AV GAME STUDIO, saya ingin memesan jasa pembuatan Jaket Komunitas seharga Rp 300.000. Mohon info detailnya ya.',
  },
  {
    title: 'Pembuatan Kaos',
    description: 'Jasa pembuatan kaos (shirt/pants) custom dengan desain unik dan berkualitas.',
    price: 'Rp 350.000',
    badge: 'FAVORITE',
    message:
      'Halo AV GAME STUDIO, saya ingin memesan jasa pembuatan Kaos seharga Rp 350.000. Mohon info detailnya ya.',
  },
  {
    title: 'Pembuatan Item Custom',
    description: 'Pembuatan item UGC atau aksesoris custom sesuai dengan keinginanmu.',
    price: 'Rp 500.000',
    badge: 'CUSTOM',
    message:
      'Halo AV GAME STUDIO, saya ingin memesan jasa pembuatan Item Custom seharga Rp 500.000. Mohon info detailnya ya.',
  },
]

const marketCategories = ['Semua', '100 Robux', '300 Robux', '1000 Robux', '2000 Robux']

const marketplaceStats = [
  { label: 'Proses Cepat', value: 'Langsung Masuk' },
  { label: 'Aman', value: '100% Terpercaya' },
  { label: 'Harga', value: 'Termurah' },
  { label: 'Cocok', value: 'Semua Player' },
]

export function TopUp() {
  return (
    <section id="topup" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#07101d] to-[#030303]" />
      <div className="absolute left-1/2 top-24 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[#00AFFF]/10 blur-3xl" />
      <div className="absolute right-10 top-20 h-48 w-48 rounded-full bg-[#00E5FF]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-3xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#00AFFF]/30 px-4 py-1 text-xs tracking-widest text-[#00AFFF]">
            JUAL ROBUX TERPERCAYA
          </span>
          <h2 className="mb-4 text-4xl font-black sm:text-5xl lg:text-6xl">
            <span className="text-white">JUAL ROBUX</span>{' '}
            <span className="neon-text">TERMURAH</span>
          </h2>
          <p className="text-white/55">
            Top up Robux aman, cepat, dan terpercaya.
            mengikuti poster promo yang Anda kirim.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 overflow-hidden rounded-[2rem] border border-[#00AFFF]/15 bg-[#08111F]/75 backdrop-blur-xl"
        >
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00AFFF]/20 bg-[#00AFFF]/10 px-4 py-2 text-xs tracking-[0.25em] text-[#00E5FF]">
                <Store className="h-4 w-4" />
                ROBUX MARKET
              </div>
              <h3 className="text-3xl font-black text-white sm:text-4xl">
                Dapatkan Robux-mu sekarang juga
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
                Tinggal pilih nominal, klik order, lalu lanjut chat ke WhatsApp. Flow tetap
                sederhana, cepat, dan langsung diproses.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {marketCategories.map((category, index) => (
                  <div
                    key={category}
                    className={`rounded-full px-4 py-2 text-sm ${
                      index === 0
                        ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] font-semibold text-[#030303]'
                        : 'border border-[#00AFFF]/20 bg-[#0b1421]/80 text-white/65'
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[1.5rem] border border-[#00AFFF]/15 bg-[#0b1421]/70 p-5">
              <div className="flex items-center gap-3 rounded-2xl border border-[#1e293b] bg-[#09111c] px-4 py-4">
                <Search className="h-5 w-5 text-[#00AFFF]" />
                <span className="text-sm text-white/45">Pilih nominal Robux favoritmu...</span>
              </div>
              <div className="rounded-2xl border border-[#00AFFF]/15 bg-gradient-to-r from-[#00AFFF]/10 to-[#00E5FF]/10 p-5">
                <div className="mb-2 text-xs tracking-[0.25em] text-[#00E5FF]/80">PROMO FLOW</div>
                <div className="text-lg font-black text-white">Aman, cepat, dan terpercaya</div>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Pilih nominal Robux, chat WhatsApp, kirim username Roblox, lalu transaksi
                  langsung diproses tanpa checkout tambahan.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {marketplaceStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-4"
                  >
                    <div className="text-xs tracking-widest text-white/35">{stat.label}</div>
                    <div className="mt-2 text-sm font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="text-2xl font-bold text-white">Etalase Robux</h3>
                <p className="mt-2 text-sm text-white/45">
                  Nominal dan harga sudah disamakan dengan desain poster promo yang Anda kirim.
                </p>
              </div>
              <div className="hidden rounded-full border border-[#00AFFF]/20 bg-[#08111F]/70 px-4 py-2 text-xs tracking-[0.25em] text-[#00E5FF]/80 md:block">
                READY STOCK
              </div>
            </motion.div>

            <div className="space-y-5">
              {robuxPackages.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`relative overflow-hidden rounded-3xl border ${
                    item.featured
                      ? 'border-[#00AFFF]/35 bg-[#08111F]/92'
                      : 'border-[#1e293b] bg-[#09111c]/88'
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#00AFFF]/12 to-transparent" />
                  <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div>
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                              item.featured
                                ? 'bg-gradient-to-br from-[#00AFFF] to-[#00E5FF]'
                                : 'border border-[#1e293b] bg-[#111827]'
                            }`}
                          >
                            <Image
                              src="/robux-icon.png"
                              alt="Robux Icon"
                              width={48}
                              height={48}
                              className="h-10 w-10 object-contain brightness-110 drop-shadow-[0_0_8px_rgba(0,175,255,0.5)]"
                            />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-2xl font-black text-white">{item.name}</h4>
                              {item.featured && (
                                <span className="rounded-full bg-[#00AFFF]/15 px-3 py-1 text-[10px] font-semibold tracking-[0.24em] text-[#00E5FF]">
                                  HOT ITEM
                                </span>
                              )}
                            </div>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-[#00AFFF]/20 px-3 py-1 text-[10px] font-bold tracking-[0.24em] text-[#00E5FF]">
                            {item.badge}
                          </span>
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold tracking-[0.24em] text-emerald-300">
                            {item.stock}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-4">
                          <div className="text-xs tracking-widest text-white/35">Nominal</div>
                          <div className="mt-2 text-lg font-bold text-white">{item.name}</div>
                        </div>
                        <div className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-4">
                          <div className="text-xs tracking-widest text-white/35">Status</div>
                          <div className="mt-2 text-sm font-semibold text-[#00E5FF]">{item.meta}</div>
                        </div>
                        <div className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-4">
                          <div className="text-xs tracking-widest text-white/35">Flow</div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                            <Clock3 className="h-4 w-4 text-[#00AFFF]" />
                            Direct WhatsApp
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#1e293b] bg-[#08111F]/85 p-5">
                      <div>
                        <div
                          className={`text-3xl font-black ${
                            item.featured ? 'neon-text' : 'text-white'
                          }`}
                        >
                          {item.price}
                        </div>
                        <div className="mt-1 text-xs tracking-widest text-white/35">Harga final</div>
                        <div className="mt-4 rounded-xl border border-[#00AFFF]/15 bg-[#0b1421]/70 px-3 py-3 text-sm text-white/55">
                          Order cepat, kirim username Roblox dan detail pembayaran lewat WhatsApp.
                        </div>
                      </div>

                      <motion.a
                        href={`https://wa.me/62895327025015?text=${encodeURIComponent(item.message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold tracking-wider transition-all ${
                          item.featured
                            ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] hover:shadow-lg hover:shadow-[#00AFFF]/30'
                            : 'border border-[#00AFFF]/30 text-white hover:border-[#00AFFF] hover:bg-[#00AFFF]/10'
                        }`}
                      >
                        ORDER VIA WA
                        <ArrowRight className="h-4 w-4" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-3xl border border-[#00AFFF]/20 p-8"
            >
              <div className="mb-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00AFFF] to-[#00E5FF]">
                  <Shirt className="h-8 w-8 text-[#030303]" />
                </div>
                <h3 className="text-2xl font-black text-white">Avatar Item Services</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  Panel kanan dibuat seperti sidebar marketplace berisi jasa tambahan dan informasi
                  transaksi.
                </p>
              </div>

              <div className="space-y-5">
                {avatarServices.map((service) => (
                  <div
                    key={service.title}
                    className="rounded-2xl border border-[#1e293b] bg-[#0b1421]/70 p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{service.title}</h4>
                        <span className="mt-1 inline-block rounded-full border border-[#00AFFF]/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#00E5FF]">
                          {service.badge}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#00E5FF]">{service.price}</span>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-white/50">{service.description}</p>
                    <motion.a
                      href={`https://wa.me/62895327025015?text=${encodeURIComponent(service.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#00AFFF] transition-colors hover:text-[#00E5FF]"
                    >
                      Chat WhatsApp
                      <ArrowRight className="h-4 w-4" />
                    </motion.a>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-[#00AFFF]/15 bg-[#08111F]/85 p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#00E5FF]" />
                <div className="text-sm font-bold tracking-[0.24em] text-[#00E5FF]">INFO TRANSAKSI</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-[#1e293b] bg-[#0b1421]/70 p-4">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-[#00AFFF]" />
                  <div>
                    <div className="font-semibold text-white">Flow tetap langsung ke WhatsApp</div>
                    <p className="mt-1 text-sm text-white/50">
                      Tidak ada checkout tambahan, jadi lebih cepat untuk closing transaksi.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-[#1e293b] bg-[#0b1421]/70 p-4">
                  <Clock3 className="mt-0.5 h-5 w-5 text-[#00AFFF]" />
                  <div>
                    <div className="font-semibold text-white">Order mudah diproses</div>
                    <p className="mt-1 text-sm text-white/50">
                      User tinggal kirim username Roblox, nominal, dan metode pembayaran.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
