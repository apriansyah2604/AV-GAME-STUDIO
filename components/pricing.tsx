"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Zap, Crown, Rocket } from 'lucide-react'
import { useState } from 'react'

const pricingPlans = [
  {
    name: 'Starter',
    icon: Rocket,
    price: {
      USD: '$35',
      IDR: 'Rp 500rb'
    },
    description: 'Perfect for small assets and mini-map projects',
    popular: false,
    features: [
      'Basic Map Design',
      'Simple Scripting',
      'Standard UI Kit',
      '3 Revisions',
      '5 Day Delivery',
      'Basic Support',
    ],
  },
  {
    name: 'Premium',
    icon: Zap,
    price: {
      USD: '$99',
      IDR: 'Rp 1.5Jt'
    },
    description: 'The sweet spot for full game map development',
    popular: true,
    features: [
      'Advanced Map Design',
      'Complex Scripting',
      'Custom UI/UX',
      'VFX & Lighting',
      '10 Revisions',
      '10 Day Delivery',
      'Priority Support',
      'Source Files',
    ],
  },
  {
    name: 'Ultimate Studio',
    icon: Crown,
    price: {
      USD: '$650',
      IDR: 'Rp 10Jt'
    },
    description: 'Professional AAA quality for major projects',
    popular: false,
    features: [
      'AAA Map Development',
      'Advanced AI Systems',
      'Premium UI/UX Design',
      'Cinematic VFX',
      'Full Optimization',
      'Unlimited Revisions',
      '21 Day Delivery',
      '24/7 Support',
      'Full Source Code',
      'Marketing Assets',
    ],
  },
]

export function Pricing() {
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('IDR')

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08111F] via-[#030303] to-[#030303]" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00AFFF]/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest text-[#00AFFF] border border-[#00AFFF]/30 mb-4">
              PRICING
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-white">CHOOSE YOUR</span>{' '}
              <span className="neon-text">PLAN</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-10">
              Flexible pricing options for every project size and budget
            </p>
          </motion.div>

          {/* Currency Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center p-1 rounded-xl bg-[#111827] border border-[#1e293b]"
          >
            <button
              onClick={() => setCurrency('IDR')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                currency === 'IDR'
                  ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              IDR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              USD
            </button>
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] text-xs font-bold tracking-wider">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Animated Border for Popular */}
              {plan.popular && (
                <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
              )}

              <div className="relative p-8">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#00AFFF] to-[#00E5FF]'
                    : 'bg-[#111827] border border-[#1e293b]'
                }`}>
                  <plan.icon className={`w-7 h-7 ${plan.popular ? 'text-[#030303]' : 'text-[#00AFFF]'}`} />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-white/50 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8 h-16 flex items-baseline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currency}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-5xl font-black ${plan.popular ? 'neon-text' : 'text-white'}`}
                    >
                      {plan.price[currency]}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-white/40 ml-2">/ project</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
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

                {/* CTA Button */}
                <motion.a
                  href={`https://wa.me/62895327025015?text=${encodeURIComponent(
                    `Halo AV GAME STUDIO, saya tertarik dengan paket ${plan.name} (${plan.price[currency]}). Bisakah kita mendiskusikan proyek saya?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold tracking-wider transition-all flex items-center justify-center ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] hover:shadow-lg hover:shadow-[#00AFFF]/30'
                      : 'border border-[#00AFFF]/30 text-white hover:bg-[#00AFFF]/10 hover:border-[#00AFFF]'
                  }`}
                >
                  GET STARTED
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
          <p className="text-white/50 mb-4">
            Need a custom solution? Let&apos;s discuss your project requirements.
          </p>
          <motion.a
            href={`https://wa.me/62895327025015?text=${encodeURIComponent(
              'Halo AV GAME STUDIO, saya ingin berkonsultasi mengenai proyek kustom saya.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 text-[#00AFFF] font-semibold hover:text-[#00E5FF] transition-colors"
          >
            Contact for Custom Quote
            <span className="text-lg">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
