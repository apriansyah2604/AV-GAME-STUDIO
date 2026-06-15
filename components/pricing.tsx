"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Zap, Crown, Rocket } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { ADMIN_WHATSAPP } from '@/lib/utils'

export function Pricing() {
  const { t } = useLanguage()
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('IDR')
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
  }, [])

  const plansData = content?.pricing_plans || t('pricing.plans')
  const icons = [Rocket, Zap, Crown]

  const pricingPlans = plansData.map((plan: any, index: number) => ({
    ...plan,
    icon: icons[index] || Rocket,
    price: plan.price || { USD: plan.price_usd, IDR: plan.price_idr },
    popular: plan.popular || false,
  }))

  return (
    <section id="pricing" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0c] via-[#030303] to-[#030303]" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4655]/3 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 rounded-none border border-[#ff4655]/30 px-4 py-1 text-xs tracking-normal text-[#ff4655] font-black uppercase italic mb-4">
              {t('pricing.badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 px-2 tracking-normal uppercase">
              <span className="text-white">{t('pricing.title1')}</span>{' '}
              <span className="neon-text">{t('pricing.title2')}</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-10 font-medium">
              {t('pricing.subtitle')}
            </p>
          </motion.div>

          {/* Currency Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center p-1 rounded-none bg-[#111827] border border-white/10"
          >
            <button
              onClick={() => setCurrency('IDR')}
              className={`px-6 py-2 rounded-none text-sm font-black transition-all ${
                currency === 'IDR'
                  ? 'bg-[#ff4655] text-white skew-x-[-12deg]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <span className={currency === 'IDR' ? '-skew-x-[12deg] inline-block' : ''}>IDR</span>
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded-none text-sm font-black transition-all ${
                currency === 'USD'
                  ? 'bg-[#ff4655] text-white skew-x-[-12deg]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <span className={currency === 'USD' ? '-skew-x-[12deg] inline-block' : ''}>USD</span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan: any, index: number) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-none transition-all duration-500 ${
                plan.popular
                  ? 'bg-[#0c0506] border border-[#ff4655]/50 shadow-[0_0_40px_rgba(255,70,85,0.1)]'
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </div>

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 z-20">
                  <div className="px-5 py-1.5 bg-[#ff4655] text-white text-[9px] font-black tracking-[0.2em] uppercase italic skew-x-[-12deg] shadow-lg shadow-[#ff4655]/20">
                    <span className="skew-x-[12deg] inline-block">{t('pricing.most_popular')}</span>
                  </div>
                </div>
              )}

              <div className="relative p-8 sm:p-10">
                {/* Icon & Label */}
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 rounded-none skew-x-[-12deg] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
                    plan.popular
                      ? 'bg-[#ff4655] shadow-[0_0_20px_rgba(255,70,85,0.3)]'
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <plan.icon className={`w-7 h-7 -skew-x-[-12deg] ${plan.popular ? 'text-white' : 'text-[#ff4655]'}`} />
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-[#ff4655] tracking-widest uppercase italic">Tier {index + 1}</span>
                    <span className="block text-xs font-black text-white/20 uppercase tracking-tighter">Professional</span>
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">{plan.name}</h3>
                <p className="text-xs text-white/40 mb-8 font-bold uppercase tracking-wider leading-relaxed h-10">{plan.description}</p>

                {/* Price */}
                <div className="mb-10 pb-8 border-b border-white/5 flex items-baseline">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currency}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-baseline"
                    >
                      <span className={`text-5xl font-black uppercase tracking-tighter ${plan.popular ? 'text-white' : 'text-white'}`}>
                        {plan.price[currency].split(' ')[0]}
                      </span>
                      <span className={`text-2xl font-black ml-1 uppercase ${plan.popular ? 'text-[#ff4655]' : 'text-[#ff4655]'}`}>
                        {plan.price[currency].split(' ')[1] || ''}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                  <span className="text-white/20 ml-3 font-black uppercase text-[9px] tracking-[0.2em]">{t('pricing.per_project')}</span>
                </div>

                {/* Features */}
                <ul className="space-y-5 mb-10">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-4 group/item">
                      <div className={`mt-0.5 w-5 h-5 rounded-none flex items-center justify-center transition-colors ${
                        plan.popular
                          ? 'bg-[#ff4655]/10 text-[#ff4655]'
                          : 'bg-white/5 text-white/20 group-hover/item:text-[#ff4655]'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-[11px] text-white/60 font-black uppercase tracking-wide group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                    `Halo AV GAME STUDIO, saya tertarik dengan paket ${plan.name} (${plan.price[currency]}). Bisakah kita mendiskusikan proyek saya?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-5 rounded-none font-black tracking-widest transition-all flex items-center justify-center uppercase skew-x-[-12deg] shadow-lg ${
                    plan.popular
                      ? 'bg-[#ff4655] text-white shadow-[#ff4655]/20 hover:shadow-[#ff4655]/40 hover:brightness-110'
                      : 'border border-white/10 text-white hover:border-[#ff4655] hover:bg-[#ff4655]/5'
                  }`}
                >
                  <span className="skew-x-[12deg] inline-block flex items-center gap-3">
                    {plan.popular ? <Crown className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                    GET STARTED
                  </span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-white/50 mb-4 font-medium uppercase">
            Need a custom solution? Let&apos;s discuss your project requirements.
          </p>
          <motion.a
            href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
              'Halo AV GAME STUDIO, saya ingin berkonsultasi mengenai proyek kustom saya.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 text-[#ff4655] font-black hover:text-white transition-colors uppercase"
          >
            Contact for Custom Quote
            <span className="text-lg">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
