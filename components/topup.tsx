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
  Loader2,
  Upload,
  QrCode,
  Smartphone
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function TopUp() {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [robloxUsername, setRobloxUsername] = useState('')
  const [checkStatus, setCheckStatus] = useState<'idle' | 'loading' | 'member' | 'not_member' | 'error'>('idle')
  const [content, setContent] = useState<any>(null)
  
  // State untuk alur pembayaran baru
  const [isOrdering, setIsOrdering] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [orderUsername, setOrderUsername] = useState('')
  const [orderStep, setOrderStep] = useState<'form' | 'payment' | 'processing' | 'success' | 'failed'>('form')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setIsMounted(true)
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
  }, [])

  if (!isMounted) return null

  const handleOrderClick = (item: any) => {
    setSelectedPackage(item)
    setOrderUsername(robloxUsername)
    setOrderStep('form')
    setIsOrdering(true)
  }

  const handleProcessPayment = async () => {
    if (!orderUsername) {
      toast.error('Silakan masukkan username Roblox Anda')
      return
    }
    
    setOrderStep('payment')
    setErrorMessage('')
    
    try {
      // 1. Cek Saldo Grup Roblox Terlebih Dahulu (Real-time)
      const amountValue = parseInt(selectedPackage.name.match(/\d+/)?.[0] || "0");
      const priceValue = parseInt(selectedPackage.price.replace(/[^0-9]/g, ""));

      const fundsRes = await fetch('/api/check-funds');
      const fundsData = await fundsRes.json();

      if (fundsData.success) {
        if (fundsData.funds < amountValue) {
          setOrderStep('failed');
          const msg = `Stok sedang kosong. Saldo grup saat ini (${fundsData.funds}) tidak mencukupi untuk paket ${amountValue} Robux.`;
          setErrorMessage(msg);
          toast.error(msg);
          return;
        }
      } else {
        // JIKA GAGAL CEK SALDO, BLOKIR TRANSAKSI (SANGAT KETAT)
        setOrderStep('failed');
        const msg = `Gagal memverifikasi stok Robux. Silakan coba beberapa saat lagi atau hubungi Admin.`;
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      // 2. Panggil API Checkout untuk mendapatkan Token Midtrans Snap
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: orderUsername,
          amount: amountValue,
          packageName: selectedPackage.name,
          price: priceValue
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.token) {
        // CATAT PESANAN KE ADMIN SEBAGAI PENDING
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: orderUsername,
              packageName: selectedPackage.name,
              price: selectedPackage.price,
              orderId: data.orderId,
              status: 'pending'
            })
          });
        } catch (err) {
          console.error('Failed to log pending order:', err);
        }

        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: async function(result: any) {
            console.log('Success:', result);
            
            // UPDATE STATUS KE COMPLETED DI ADMIN
            try {
              await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: data.orderId, status: 'completed' })
              });
            } catch (err) {
              console.error('Failed to update order status:', err);
            }

            setOrderStep('success');
            toast.success('Pembayaran Berhasil! Robux akan segera dikirim.');
          },
          onPending: function(result: any) {
            console.log('Pending:', result);
            setOrderStep('payment');
            toast.info('Menunggu pembayaran...');
          },
          onError: function(result: any) {
            console.error('Error:', result);
            setOrderStep('failed');
            setErrorMessage('Pembayaran Gagal.');
            toast.error('Pembayaran Gagal.');
          },
          onClose: function() {
            console.log('Customer closed the popup without finishing the payment');
            if (orderStep !== 'success') {
              setIsOrdering(false);
            }
          }
        });
      } else {
        setOrderStep('failed')
        setErrorMessage(data.message || 'Gagal membuat transaksi.')
        toast.error(data.message || 'Gagal membuat transaksi.')
      }
    } catch (err) {
      console.error('Checkout Error:', err)
      setOrderStep('failed')
      setErrorMessage('Terjadi kesalahan sistem.')
      toast.error('Terjadi kesalahan sistem.')
    }
  }

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

  const robuxPackages = content?.robux_packages?.length ? content.robux_packages : t('robux_packages')
  const avatarServices = content?.avatar_services?.length ? content.avatar_services : t('avatar_services')
  const marketCategories = t('market_categories')

  const marketplaceStats = [
    { label: t('topup.stats.fast'), value: t('topup.stats.fast_val') },
    { label: t('topup.stats.safe'), value: t('topup.stats.safe_val') },
    { label: t('topup.stats.price'), value: t('topup.stats.price_val') },
    { label: t('topup.stats.fit'), value: t('topup.stats.fit_val') },
  ]
  return (
    <section id="topup" className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#1a0a0c] to-[#030303]" />
      <div className="absolute left-1/2 top-24 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[#ff4655]/10 blur-3xl" />
      <div className="absolute right-10 top-20 h-48 w-48 rounded-full bg-[#ff4655]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-8 max-w-3xl text-center"
        >
          <span className="mb-4 inline-block rounded-none border border-[#ff4655]/30 px-4 py-1 text-xs tracking-normal text-[#ff4655] font-black uppercase italic">
            {t('topup.badge')}
          </span>
          <h2 className="mb-4 text-3xl font-black sm:text-5xl lg:text-6xl uppercase">
            <span className="text-white">{t('topup.title1')}</span>{' '}
            <span className="neon-text">{t('topup.title2')}</span>
          </h2>
          <p className="text-white/55 font-medium">
            {t('topup.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 overflow-hidden rounded-none border border-[#ff4655]/20 bg-[#0c0506]/80 backdrop-blur-xl"
        >
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-none border border-[#ff4655]/20 bg-[#ff4655]/10 px-4 py-2 text-xs tracking-normal text-[#ff4655] font-black uppercase">
                <Store className="h-4 w-4" />
                {t('topup.market_badge')}
              </div>
              <h3 className="text-3xl font-black text-white sm:text-4xl uppercase">
                {t('topup.market_title')}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 font-medium">
                {t('topup.market_desc')}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                {marketCategories.map((category: string, index: number) => (
                  <div
                    key={category}
                    className={`rounded-none px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-tight ${
                      index === 0
                        ? 'bg-[#ff4655] text-white skew-x-[-12deg]'
                        : 'border border-white/10 bg-white/5 text-white/60'
                    }`}
                  >
                    <span className={index === 0 ? '-skew-x-[-12deg] inline-block' : ''}>{category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-none border border-white/5 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center gap-3 rounded-none border border-white/10 bg-black/40 px-4 py-4">
                <Search className="h-5 w-5 text-[#ff4655]" />
                <span className="text-sm text-white/45 font-bold uppercase">{t('topup.search_placeholder') || '...'}</span>
              </div>
              <div className="rounded-none border border-[#ff4655]/20 bg-[#ff4655]/5 p-4 sm:p-5">
                <div className="mb-2 text-xs tracking-normal text-[#ff4655] font-black uppercase">{t('topup.promo_flow')}</div>
                <div className="text-xl font-black text-white uppercase italic">{t('topup.promo_title')}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/70 font-medium">
                  {t('topup.promo_desc')}
                </p>
              </div>

              <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
                {marketplaceStats.map((stat: any) => (
                  <div
                    key={stat.label}
                    className="rounded-none border border-white/5 bg-white/5 p-3 sm:p-4"
                  >
                    <div className="text-[11px] font-black tracking-normal text-white/40 uppercase">{stat.label}</div>
                    <div className="mt-1 text-sm font-black text-white line-clamp-1 uppercase">{stat.value}</div>
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
                <h3 className="text-2xl font-black text-white uppercase">{t('topup.etalase_title')}</h3>
                <p className="mt-2 text-sm text-white/45 font-medium">
                  {t('topup.etalase_desc')}
                </p>
              </div>
              <div className="hidden rounded-none border border-[#ff4655]/30 bg-[#ff4655]/5 px-4 py-2 text-xs tracking-normal text-[#ff4655] font-black uppercase md:block">
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
                  className={`relative overflow-hidden rounded-none border ${
                    item.featured
                      ? 'border-[#ff4655]/40 bg-[#120809]'
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${item.featured ? 'from-[#ff4655]/10' : 'from-white/5'} to-transparent`} />
                  <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div>
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-none skew-x-[-12deg] ${
                              item.featured
                                ? 'bg-[#ff4655]'
                                : 'border border-white/10 bg-white/5'
                            }`}
                          >
                            <Image
                              src="/icon robux.png"
                              alt="Robux Icon"
                              width={48}
                              height={48}
                              className={`h-10 w-10 object-contain -skew-x-[-12deg] ${item.featured ? 'brightness-0 invert' : 'brightness-110'}`}
                            />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-2xl font-black text-white uppercase">{item.name}</h4>
                              {item.featured && (
                                <span className="rounded-none bg-[#ff4655]/20 px-3 py-1 text-[10px] font-black tracking-normal text-[#ff4655] uppercase italic">
                                  {t('topup.hot_item')}
                                </span>
                              )}
                            </div>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60 font-medium">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-none border border-[#ff4655]/30 px-3 py-1 text-[10px] font-black tracking-normal text-[#ff4655] uppercase">
                            {item.badge}
                          </span>
                          <span className="rounded-none border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black tracking-normal text-emerald-400 uppercase">
                            {item.stock}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-none border border-white/5 bg-white/5 p-4">
                          <div className="text-[10px] font-black text-white/30 uppercase tracking-normal">Nominal</div>
                          <div className="mt-2 text-lg font-black text-white uppercase">{item.name}</div>
                        </div>
                        <div className="rounded-none border border-white/5 bg-white/5 p-4">
                          <div className="text-[10px] font-black text-white/30 uppercase tracking-normal">Status</div>
                          <div className="mt-2 text-sm font-black text-[#ff4655] uppercase">{item.meta}</div>
                        </div>
                        <div className="rounded-none border border-white/5 bg-white/5 p-4">
                          <div className="text-[10px] font-black text-white/30 uppercase tracking-normal">Flow</div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-white/70 font-black uppercase">
                            <Clock3 className="h-4 w-4 text-[#ff4655]" />
                            Otomatis
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-between rounded-none border border-white/5 bg-black/40 p-5">
                      <div>
                        <div
                          className={`text-3xl font-black uppercase ${
                            item.featured ? 'text-[#ff4655]' : 'text-white'
                          }`}
                        >
                          {item.price}
                        </div>
                        <div className="mt-1 text-[10px] font-black text-white/30 uppercase tracking-normal">{t('topup.final_price')}</div>
                        <div className="mt-4 rounded-none border border-white/5 bg-white/5 px-3 py-3 text-sm text-white/60 font-medium">
                          {t('topup.order_desc')}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => handleOrderClick(item)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-none py-4 text-sm font-black uppercase tracking-normal transition-all ${
                          item.featured
                            ? 'bg-[#ff4655] text-white skew-x-[-12deg]'
                            : 'border-2 border-white/20 text-white hover:border-[#ff4655] hover:bg-[#ff4655]/5'
                        }`}
                      >
                        <span className={item.featured ? '-skew-x-[-12deg] inline-block flex items-center gap-2' : 'flex items-center gap-2'}>
                          {t('topup.order_btn')}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </motion.button>
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
              className="glass-strong rounded-none border border-white/10 p-8"
            >
              <div className="mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-none bg-[#ff4655] skew-x-[-12deg]">
                  <Users className="h-8 w-8 text-white -skew-x-[-12deg]" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">{t('topup.community_check.title')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50 font-medium">
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
                  className="flex w-full items-center justify-center gap-2 rounded-none border-2 border-white/20 bg-white/5 py-4 text-sm font-black text-white uppercase hover:border-[#ff4655] transition-all"
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
                    className="w-full rounded-none bg-black/40 border border-white/10 px-5 py-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#ff4655] transition-all font-bold"
                  />
                  <button
                    onClick={handleCheckMembership}
                    disabled={checkStatus === 'loading'}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-none bg-[#ff4655] text-white text-xs font-black uppercase hover:brightness-110 transition-all disabled:opacity-50"
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
                    className={`rounded-none p-4 flex items-center gap-3 text-sm font-black uppercase ${
                      checkStatus === 'member'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : checkStatus === 'error'
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                        : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {checkStatus === 'member' ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
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
                
                <p className="text-[10px] text-center text-white/30 uppercase tracking-normal font-black">
                  {t('topup.community_check.membership_info')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-none border border-white/10 p-8"
            >
              <div className="mb-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-none bg-white/5 border border-[#ff4655]/30">
                  <Shirt className="h-8 w-8 text-[#ff4655]" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">{t('topup.avatar_services.title')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50 font-medium">
                  {t('topup.avatar_services.desc')}
                </p>
              </div>

              <div className="space-y-5">
                {avatarServices.map((service: any) => (
                  <div
                    key={service.title}
                    className="rounded-none border border-white/5 bg-white/5 p-5"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-black text-white uppercase">{service.title}</h4>
                        <span className="mt-1 inline-block rounded-none border border-[#ff4655]/30 px-2.5 py-1 text-[10px] font-black tracking-normal text-[#ff4655] uppercase">
                          {service.badge}
                        </span>
                      </div>
                      <span className="text-sm font-black text-[#ff4655] uppercase">{service.price}</span>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-white/50 font-medium">{service.description}</p>
                    <motion.a
                      href={`https://wa.me/62895327025015?text=${encodeURIComponent(service.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 text-sm font-black text-[#ff4655] uppercase transition-colors hover:text-white"
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
              className="rounded-none border border-white/5 bg-white/5 p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#ff4655]" />
                <div className="text-sm font-black tracking-normal text-[#ff4655] uppercase">{t('topup.info_transaksi.title')}</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-none border border-white/5 bg-black/40 p-4">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-[#ff4655]" />
                  <div>
                    <div className="font-black text-white uppercase">{t('topup.info_transaksi.flow_title')}</div>
                    <p className="mt-1 text-sm text-white/50 font-medium">
                      {t('topup.info_transaksi.flow_desc')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-none border border-white/5 bg-black/40 p-4">
                  <Clock3 className="mt-0.5 h-5 w-5 text-[#ff4655]" />
                  <div>
                    <div className="font-black text-white uppercase">{t('topup.info_transaksi.easy_title')}</div>
                    <p className="mt-1 text-sm text-white/50 font-medium">
                      {t('topup.info_transaksi.easy_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Overlay Pembayaran Profesional */}
      {isOrdering && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0c0506] border border-[#ff4655]/20 p-8 relative overflow-hidden"
          >
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4655]/5 blur-3xl" />
            
            {/* Tombol Tutup */}
            <button 
              onClick={() => setIsOrdering(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>

            {orderStep === 'form' && (
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#ff4655]/10 border border-[#ff4655]/20 flex items-center justify-center">
                    <Image src="/icon robux.png" alt="Robux" width={32} height={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Detail Pesanan</h3>
                    <p className="text-sm text-[#ff4655] font-bold">{selectedPackage?.name} - {selectedPackage?.price}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-normal">Username Roblox Anda</label>
                    <input
                      type="text"
                      value={orderUsername}
                      onChange={(e) => setOrderUsername(e.target.value)}
                      placeholder="Masukkan Username..."
                      className="w-full bg-black/40 border border-white/10 px-5 py-4 text-sm text-white placeholder-white/20 outline-none focus:border-[#ff4655] transition-all font-bold"
                    />
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 text-[11px] text-white/50 leading-relaxed font-medium">
                    <span className="text-[#ff4655] font-black">INFO:</span> Anda akan diarahkan ke jendela pembayaran Midtrans. Silakan pilih metode **GoPay** atau **QRIS** untuk pembayaran instan. Robux akan dikirim otomatis setelah pembayaran berhasil.
                  </div>

                  <motion.button
                    onClick={handleProcessPayment}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#ff4655] text-white py-4 font-black uppercase tracking-normal skew-x-[-12deg]"
                  >
                    <span className="-skew-x-[-12deg] inline-block">Lanjut ke Pembayaran</span>
                  </motion.button>
                </div>
              </div>
            )}

            {(orderStep === 'payment' || orderStep === 'processing') && (
              <div className="text-center py-12 relative z-10">
                <Loader2 className="h-16 w-16 text-[#ff4655] animate-spin mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white uppercase mb-2">
                  {orderStep === 'payment' ? 'Menyiapkan Pembayaran' : 'Memproses Transaksi'}
                </h3>
                <p className="text-white/50 font-medium">Mohon tunggu sebentar, sistem sedang bekerja...</p>
              </div>
            )}

            {orderStep === 'success' && (
              <div className="text-center py-8 relative z-10">
                <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-2">Transaksi Berhasil!</h3>
                <p className="text-white/50 font-medium mb-8">Robux telah dikirim otomatis ke <span className="text-white">{orderUsername}</span>.</p>
                <button 
                  onClick={() => setIsOrdering(false)}
                  className="w-full border border-white/10 bg-white/5 text-white py-4 font-black uppercase"
                >
                  Tutup
                </button>
              </div>
            )}

            {orderStep === 'failed' && (
              <div className="text-center py-8 relative z-10">
                <div className="h-20 w-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-2">Transaksi Gagal</h3>
                <p className="text-white/50 font-medium mb-4">{errorMessage || 'Terjadi kendala saat memproses pengiriman.'}</p>
                <p className="text-white/30 text-xs mb-8 font-medium">Silakan hubungi Admin via WhatsApp untuk bantuan manual jika saldo Anda sudah terpotong.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setOrderStep('form')}
                    className="flex-1 border border-white/10 bg-white/5 text-white py-4 font-black uppercase"
                  >
                    Coba Lagi
                  </button>
                  <a 
                    href={`https://wa.me/62895327025015?text=Halo%20Admin,%20transaksi%20otomatis%20saya%20gagal.%20Username:%20${orderUsername}`}
                    target="_blank"
                    className="flex-1 bg-[#ff4655] text-white py-4 font-black uppercase text-center"
                  >
                    Hubungi WA
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  )
}
