"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Map, Code2, Music, Palette, Sparkles, Gauge, Users2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Services() {
  const { t } = useLanguage()
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
  }, [])

  const servicesList = content?.services || t('services.list')
  const icons = [Map, Code2, Music, Palette, Sparkles, Gauge, Users2]

  const services = servicesList.map((service: any, index: number) => ({
    ...service,
    icon: icons[index] || Map
  }))
  return (
    <section id="services" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ff4655]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ff4655]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-none border border-[#ff4655]/30 px-4 py-1 text-xs tracking-normal text-[#ff4655] font-black uppercase italic mb-4">
            {t('services.badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 px-2 uppercase tracking-tight">
            <span className="text-white">{t('services.title1')}</span>{' '}
            <span className="neon-text">{t('services.title2')}</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto font-medium">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, index: number) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-none glass border border-[#ff4655]/10 hover:border-[#ff4655]/50 transition-all duration-500 h-full">
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-none animate-neon-border" />
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-none bg-[#111827] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 skew-x-[-12deg]">
                    <service.icon className="w-7 h-7 text-[#ff4655] -skew-x-[-12deg]" />
                  </div>
                  <div className="absolute -inset-2 bg-[#ff4655]/20 rounded-none blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#ff4655] transition-colors uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-white/50 mb-6 leading-relaxed font-medium">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature: string) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-none bg-[#111827] text-white/60 border border-white/5 text-[10px] font-black uppercase tracking-normal"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff4655] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
