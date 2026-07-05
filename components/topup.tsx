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
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useEffect } from 'react'

export function TopUp() {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [robloxUsername, setRobloxUsername] = useState('')
  const [checkStatus, setCheckStatus] = useState<'idle' | 'loading' | 'member' | 'not_member' | 'error'>('idle')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleCheckMembership = async () => {
    if (!robloxUsername) return
    setCheckStatus('loading')
    
    try {
      const response = await fetch('/api/check-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: robloxUsername }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCheckStatus(data.isMember ? 'member' : 'not_member');
      } else {
        setCheckStatus('error');
      }
    } catch (err) {
      console.error('Membership Check Error:', err);
      // Fallback for simulation if needed
      setTimeout(() => {
        const memberUsernames = ['avgame', 'aprideveloper', 'apriansyahav', 'admin']
        if (memberUsernames.includes(robloxUsername.toLowerCase())) {
          setCheckStatus('member')
        } else {
          setCheckStatus('not_member')
        }
      }, 1000)
    }
  }

  const robuxPackages = t('robux_packages')
  const avatarServices = t('avatar_services')
  const marketCategories = t('market_categories')

  const marketplaceStats = [
    { label: t('topup.stats.fast'), value: t('topup.stats.fast_val') },
    { label: t('topup.stats.safe'), value: t('topup.stats.safe_val') },
    { label: t('topup.stats.price'), value: t('topup.stats.price_val') },
    { label: t('topup.stats.fit'), value: t('topup.stats.fit_val') },
  ]
  return (
    <section id="topup" className="relative overflow-hidden py-24 sm:py-32">
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
            {t('topup.badge')}
          </span>
          <h2 className="mb-4 text-3xl font-black sm:text-4xl lg:text-5xl">
            <span className="text-white">{t('topup.title1')}</span>{' '}
            <span className="neon-text">{t('topup.title2')}
            </span>
          </h2>
          <p className="text-white/55 text-sm sm:text-base">
            {t('topup.subtitle')}
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 overflow-hidden rounded-[2rem] border border-[#00AFFF]/15 bg-[#08111F]/75 backdrop-blur-xl"
          >
            <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00AFFF]/20 bg-[#00AFFF]/10 px-3 py-1.5 text-[10px] tracking-[0.25em] text-[#00E5FF] sm:text-xs">
                  <Store className="h-3.5 w-3.5" />
                  {t('topup.market_badge')}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  {t('topup.market_title')}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
                  {t('topup.market_desc')}
                </p>
                <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                  {marketCategories.map((category: string, index: number) => (
                    <div
                      key={category}
                      className={`rounded-full px-3 py-1.5 text-xs sm:text-sm ${
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

              <div className="space-y-4 rounded-[1.5rem] border border-[#00AFFF]/15 bg-[#0b1421]/70 p-4 sm:p-5">
                <div className="flex items-center gap-3 rounded-2xl border border-[#1e293b] bg-[#09111c] px-3 py-3">
                  <Search className="h-4 w-4 text-[#00AFFF]" />
                  <span className="text-xs sm:text-sm text-white/45">{t('topup.search_placeholder') || '...'}</span>
                </div>
                <div className="rounded-2xl border border-[#00AFFF]/15 bg-gradient-to-r from-[#00AFFF]/10 to-[#00E5FF]/10 p-4 sm:p-5">
                  <div className="mb-2 text-[10px] tracking-[0.25em] text-[#00E5FF]/80 sm:text-xs">{t('topup.promo_flow')}</div>
                  <div className="text-base sm:text-lg font-black text-white">{t('topup.promo_title')}</div>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/55">
                    {t('topup.promo_desc')}
                  </p>
                </div>

                <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
                  {marketplaceStats.map((stat: any) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-2.5 sm:p-3"
                    >
                      <div className="text-[9px] sm:text-[10px] tracking-widest text-white/35 uppercase">{stat.label}</div>
                      <div className="mt-1 text-xs sm:text-sm font-bold text-white line-clamp-1">{stat.value}</div>
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
                <h3 className="text-xl sm:text-2xl font-bold text-white">{t('topup.etalase_title')}</h3>
                <p className="mt-2 text-sm text-white/45">
                  {t('topup.etalase_desc')}
                </p>
              </div>
              <div className="hidden rounded-full border border-[#00AFFF]/20 bg-[#08111F]/70 px-4 py-2 text-xs tracking-[0.25em] text-[#00E5FF]/80 md:block">
                {t('topup.ready_stock')}
              </div>
            </motion.div>

            <div className="space-y-5">
              {robuxPackages.map((item: any, index: number) => (
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
                  <div className="relative grid gap-6 p-4 sm:p-5 lg:p-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div>
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl ${
                              item.featured
                                ? 'bg-gradient-to-br from-[#00AFFF] to-[#00E5FF]'
                                : 'border border-[#1e293b] bg-[#111827]'
                            }`}
                          >
                            <Image
                              src="/icon robux.png"
                              alt="Robux Icon"
                              width={48}
                              height={48}
                              className="h-8 w-8 sm:h-10 sm:w-10 object-contain brightness-110 drop-shadow-[0_0_8px_rgba(0,175,255,0.5)]"
                            />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xl sm:text-2xl font-black text-white">{item.name}</h4>
                              {item.featured && (
                                <span className="rounded-full bg-[#00AFFF]/15 px-3 py-1 text-[10px] font-semibold tracking-[0.24em] text-[#00E5FF]">
                                  {t('topup.hot_item')}
                                </span>
                              )}
                            </div>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
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
                        <div className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-3 sm:p-4">
                          <div className="text-xs tracking-widest text-white/35">Nominal</div>
                          <div className="mt-2 text-lg font-bold text-white">{item.name}</div>
                        </div>
                        <div className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-3 sm:p-4">
                          <div className="text-xs tracking-widest text-white/35">Status</div>
                          <div className="mt-2 text-sm font-semibold text-[#00E5FF]">{item.meta}</div>
                        </div>
                        <div className="rounded-2xl border border-[#1e293b] bg-[#08111F]/80 p-3 sm:p-4">
                          <div className="text-xs tracking-widest text-white/35">Flow</div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
                            <Clock3 className="h-4 w-4 text-[#00AFFF]" />
                            Direct WhatsApp
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#1e293b] bg-[#08111F]/85 p-4 sm:p-5">
                      <div>
                        <div
                          className={`text-2xl sm:text-3xl font-black ${
                            item.featured ? 'neon-text' : 'text-white'
                          }`}
                        >
                          {item.price}
                        </div>
                        <div className="mt-1 text-xs tracking-widest text-white/35">{t('topup.final_price')}</div>
                        <div className="mt-4 rounded-xl border border-[#00AFFF]/15 bg-[#0b1421]/70 px-3 py-3 text-xs sm:text-sm text-white/55">
                          {t('topup.order_desc')}
                        </div>
                      </div>

                      <motion.a
                        href={`https://wa.me/62895327025015?text=${encodeURIComponent(item.message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-xs sm:text-sm font-bold tracking-wider transition-all ${
                          item.featured
                            ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] hover:shadow-lg hover:shadow-[#00AFFF]/30'
                            : 'border border-[#00AFFF]/30 text-white hover:border-[#00AFFF] hover:bg-[#00AFFF]/10'
                        }`}
                      >
                        {t('topup.order_btn')}
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
              className="glass-strong rounded-3xl border border-[#00AFFF]/20 p-6 sm:p-8"
            >
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00AFFF] to-[#00E5FF]">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#030303]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{t('topup.community_check.title')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {t('topup.community_check.desc')}
                </p>
              </div>

              <div className="space-y-4">
                <motion.a
                  href="https://www.roblox.com/communities/390244299/AV-game-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00AFFF]/10 border border-[#00AFFF]/30 py-3 sm:py-4 text-xs sm:text-sm font-bold text-[#00AFFF] hover:bg-[#00AFFF]/20 transition-all"
                >
                  {t('topup.community_check.join_btn')}
                  <ArrowRight className="h-4 w-4" />
                </motion.a>

                <div className="relative">
                  <input
                    type="text"
                    value={robloxUsername}
                    onChange={(e) => setRobloxUsername(e.target.value)}
                    placeholder={t('topup.community_check.input_placeholder')}
                    className="w-full rounded-xl bg-[#0b1421]/70 border border-[#1e293b] px-4 py-4 text-xs sm:text-sm text-white placeholder-white/30 outline-none focus:border-[#00AFFF] transition-all"
                  />
                  <button
                    onClick={handleCheckMembership}
                    disabled={checkStatus === 'loading'}
                    className="absolute right-2 top-2 bottom-2 px-3 sm:px-4 rounded-lg bg-[#00AFFF] text-[#030303] text-xs font-bold hover:bg-[#00E5FF] transition-all disabled:opacity-50"
                  >
                    {checkStatus === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t('topup.community_check.check_btn')
                    )}
                  </button>
                </div>

                {checkStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`rounded-xl p-4 flex items-center gap-3 text-xs sm:text-sm font-medium ${
                      checkStatus === 'member'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : checkStatus === 'error'
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                        : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {checkStatus === 'member' ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    )}
                    <span>
                      {checkStatus === 'member'
                        ? t('topup.community_check.status_member')
                        : checkStatus === 'not_member'
                        ? t('topup.community_check.status_not_member')
                        : t('topup.community_check.status_error')}
                    </span>
                  </motion.div>
                )}
                
                <p className="text-[10px] text-center text-white/30 uppercase tracking-widest">
                  {t('topup.community_check.membership_info')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-3xl border border-[#00AFFF]/20 p-6 sm:p-8"
            >
              <div className="mb-6 sm:mb-8">
                <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00AFFF] to-[#00E5FF]">
                  <Shirt className="h-6 w-6 sm:h-8 sm:w-8 text-[#030303]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{t('topup.avatar_services.title')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {t('topup.avatar_services.desc')}
                </p>
              </div>

              <div className="space-y-5">
                {avatarServices.map((service: any) => (
                  <div
                    key={service.title}
                    className="rounded-2xl border border-[#1e293b] bg-[#0b1421]/70 p-4 sm:p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-white">{service.title}</h4>
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
                      {t('topup.avatar_services.chat')}
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
              className="rounded-3xl border border-[#00AFFF]/15 bg-[#08111F]/85 p-5 sm:p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#00E5FF]" />
                <div className="text-xs sm:text-sm font-bold tracking-[0.24em] text-[#00E5FF]">{t('topup.info_transaksi.title')}</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-[#1e293b] bg-[#0b1421]/70 p-3 sm:p-4">
                  <BadgeCheck className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 text-[#00AFFF]" />
                  <div>
                    <div className="text-sm font-semibold text-white">{t('topup.info_transaksi.flow_title')}</div>
                    <p className="mt-1 text-xs sm:text-sm text-white/50">
                      {t('topup.info_transaksi.flow_desc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-[#1e293b] bg-[#0b1421]/70 p-3 sm:p-4">
                  <Clock3 className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 text-[#00AFFF]" />
                  <div>
                    <div className="text-sm font-semibold text-white">{t('topup.info_transaksi.easy_title')}</div>
                    <p className="mt-1 text-xs sm:text-sm text-white/50">
                      {t('topup.info_transaksi.easy_desc')}
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
