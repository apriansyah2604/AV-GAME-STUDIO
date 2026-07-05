"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Zap, Crown, Rocket } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export function Pricing() {
  const { t } = useLanguage()
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('IDR')

  const plansData = t('pricing.plans')
  const icons = [Rocket, Zap, Crown]

  const pricingPlans = [
    {
      ...plansData[0],
      icon: icons[0],
      price: { USD: '$35', IDR: 'Rp 500rb' },
      popular: false,
    },
    {
      ...plansData[1],
      icon: icons[1],
      price: { USD: '$99', IDR: 'Rp 1.5Jt' },
      popular: true,
    },
    {
      ...plansData[2],
      icon: icons[2],
      price: { USD: '$650', IDR: 'Rp 10Jt' },
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#08111F] via-[#030303] to-[#030303]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00AFFF]/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest text-[#00AFFF] border border-[#00AFFF]/30 mb-4">
              {t('pricing.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              <span className="text-white">{t('pricing.title1')}</span>{' '}
              <span className="neon-text">{t('pricing.title2')}
              </span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-8 sm:mb-10 text-sm sm:text-base">
              {t('pricing.subtitle')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center p-1 rounded-xl bg-[#111827] border border-[#1e293b]"
          >
            <button
              onClick={() => setCurrency('IDR')}
              className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currency === 'IDR'
                  ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              IDR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              USD
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular
                  ? 'glass-strong border-2 border-[#00AFFF]'
                  : 'glass border border-[#00AFFF]/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] text-xs font-bold tracking-wider">
                    {t('pricing.most_popular')}
                  </span>
                </div>
              )}

              {plan.popular && (
                <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
              )}

              <div className="relative p-6 sm:p-8">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-6 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#00AFFF] to-[#00E5FF]'
                    : 'bg-[#111827] border border-[#1e293b]'
                }`}>
                  <plan.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${plan.popular ? 'text-[#030303]' : 'text-[#00AFFF]'}`} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-white/50 mb-6">{plan.description}</p>

                <div className="mb-8 h-12 sm:h-16 flex items-baseline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currency}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-3xl sm:text-4xl lg:text-5xl font-black ${plan.popular ? 'neon-text' : 'text-white'}`}
                    >
                      {plan.price[currency]}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-white/40 ml-2 text-xs sm:text-sm">{t('pricing.per_project')}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular
                          ? 'bg-[#00AFFF]/20 text-[#00AFFF]'
                          : 'bg-[#111827] text-[#00AFFF]'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={`https://wa.me/62895327025015?text=${encodeURIComponent(
                    `Halo AV GAME STUDIO, saya tertarik dengan paket ${plan.name} (${plan.price[currency]}). Bisakah kita mendiskusikan proyek saya?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold tracking-wider transition-all flex items-center justify-center text-xs sm:text-sm ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] hover:shadow-lg hover:shadow-[#00AFFF]/30'
                      : 'border border-[#00AFFF]/30 text-white hover:border-[#00AFFF] hover:bg-[#00AFFF]/10'
                  }`}
                >
                  GET STARTED
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p className="text-white/50 mb-4 text-sm">
            Need a custom solution? Let's discuss your project requirements.
          </p>
          <motion.a
            href={`https://wa.me/62895327025015?text=${encodeURIComponent(
              'Halo AV GAME STUDIO, saya ingin berkonsultasi mengenai proyek kustom saya.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 text-[#00AFFF] font-semibold hover:text-[#00E5FF] transition-colors text-sm"
          >
            Contact for Custom Quote
            <span className="text-lg">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
