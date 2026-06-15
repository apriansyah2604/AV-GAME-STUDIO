"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Gamepad2, Rocket, ShoppingCart, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useTransition } from '@/context/TransitionContext'
import { ADMIN_WHATSAPP } from '@/lib/utils'

export function Hero() {
  const { t } = useLanguage()
  const { triggerTransition } = useTransition()
  const [isTopUpMenuOpen, setIsTopUpMenuOpen] = useState(false)

  const topUpGames = [
    {
      name: 'Roblox Robux',
      label: 'Top Up Robux (Proses Admin)',
      href: '#topup',
    },
    {
      name: 'Mobile Legends',
      label: 'Request top up diamond',
      href: `https://wa.me/${ADMIN_WHATSAPP}?text=Halo%20AV%20GAME%20STUDIO,%20saya%20ingin%20top%20up%20Mobile%20Legends.`,
    },
    {
      name: 'Free Fire',
      label: 'Request top up diamond',
      href: `https://wa.me/${ADMIN_WHATSAPP}?text=Halo%20AV%20GAME%20STUDIO,%20saya%20ingin%20top%20up%20Free%20Fire.`,
    },
    {
      name: 'PUBG Mobile',
      label: 'Request top up UC',
      href: `https://wa.me/${ADMIN_WHATSAPP}?text=Halo%20AV%20GAME%20STUDIO,%20saya%20ingin%20top%20up%20PUBG%20Mobile.`,
    },
  ]

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsTopUpMenuOpen(false)
    triggerTransition(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
      }
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" suppressHydrationWarning>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#030303]">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 70, 85, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 70, 85, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff4655]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#ff4655]/5 rounded-full blur-3xl" />
        
        {/* Scan Lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff4655]/5 to-transparent opacity-30 animate-pulse" />
      </div>

      {/* 3D Floating Cube */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-20 pointer-events-none"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full border-2 border-[#ff4655]/30"
              style={{
                transform: `rotateX(${i * 60}deg) rotateY(${i * 60}deg) translateZ(100px)`,
                boxShadow: 'inset 0 0 30px rgba(255, 70, 85, 0.1)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* HUD Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative inline-block"
        >
          {/* Corner Decorations */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#ff4655]/50" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-[#ff4655]/50" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-[#ff4655]/50" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#ff4655]/50" />

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none glass border border-[#ff4655]/30 mb-8"
          >
            <span className="w-2 h-2 rounded-none bg-[#ff4655] animate-pulse" />
            <span className="text-sm font-black tracking-normal text-white/80 uppercase">
              {t('hero.status')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight mb-6 leading-[0.9] px-2 uppercase"
          >
            <span className="block neon-text">{t('hero.title1')}</span>
            <span className="block bg-gradient-to-r from-[#ff4655] via-white to-[#ff4655] bg-clip-text text-transparent pb-2">
              {t('hero.title2')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-medium tracking-normal px-4 leading-relaxed"
          >
            {t('hero.subtitle')}
            <span className="block mt-2 text-sm text-[#ff4655] font-black uppercase">
              {t('hero.subtitle2')}
            </span>
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 px-4 sm:px-0"
        >
          <motion.a
            href="#projects"
            onClick={(e) => handleCtaClick(e, '#projects')}
            className="group relative px-6 py-4 rounded-none overflow-hidden text-center sm:px-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-[#ff4655] skew-x-[-12deg]" />
            <span className="relative flex items-center justify-center gap-2 font-black tracking-normal text-white uppercase text-sm sm:text-xl skew-x-[12deg]">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
              {t('hero.explore')}
            </span>
          </motion.a>

          <motion.a
            href="#pricing"
            onClick={(e) => handleCtaClick(e, '#pricing')}
            className="group relative px-6 py-4 rounded-none overflow-hidden text-center sm:px-8 border-2 border-white/20"
            whileHover={{ scale: 1.05, borderColor: '#ff4655' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-white/5 skew-x-[-12deg] group-hover:bg-[#ff4655] transition-colors" />
            <span className="relative flex items-center justify-center gap-2 font-black tracking-normal text-white uppercase text-sm sm:text-xl skew-x-[12deg]">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {t('hero.order')}
            </span>
          </motion.a>

          <div className="relative">
            <motion.button
              type="button"
              onClick={() => setIsTopUpMenuOpen((open) => !open)}
              className="group relative w-full px-6 py-4 rounded-none overflow-hidden text-center sm:px-8 border-2 border-[#ff4655]/40"
              whileHover={{ scale: 1.05, borderColor: '#ff4655' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-[#ff4655]/10 skew-x-[-12deg] group-hover:bg-[#ff4655]/20 transition-colors" />
              <span className="relative flex items-center justify-center gap-2 font-black tracking-normal text-white uppercase text-sm sm:text-xl skew-x-[12deg]">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff4655]" />
                Top Up Game
                <ChevronDown className={`w-4 h-4 transition-transform ${isTopUpMenuOpen ? 'rotate-180' : ''}`} />
              </span>
            </motion.button>

            {isTopUpMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden border border-[#ff4655]/25 bg-[#090405]/95 text-left shadow-2xl shadow-[#ff4655]/10 backdrop-blur-xl sm:min-w-80"
              >
                {topUpGames.map((game) => (
                  <a
                    key={game.name}
                    href={game.href}
                    target={game.href.startsWith('http') ? '_blank' : undefined}
                    rel={game.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (game.href.startsWith('#')) {
                        handleCtaClick(e, game.href)
                      } else {
                        setIsTopUpMenuOpen(false)
                      }
                    }}
                    className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 transition-colors last:border-b-0 hover:bg-[#ff4655]/10"
                  >
                    <span>
                      <span className="block text-sm font-black uppercase text-white">{game.name}</span>
                      <span className="mt-1 block text-[10px] font-bold uppercase tracking-normal text-white/40">{game.label}</span>
                    </span>
                    <ShoppingCart className="h-4 w-4 shrink-0 text-[#ff4655]" />
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          <motion.a
            href="#community"
            onClick={(e) => handleCtaClick(e, '#community')}
            className="group relative px-6 py-4 rounded-none glass border border-white/10 hover:border-[#ff4655] transition-colors text-center sm:px-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative flex items-center justify-center gap-2 font-black tracking-normal text-white/80 group-hover:text-white transition-colors text-xs sm:text-base uppercase">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('hero.community')}
            </span>
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-2"
        >
          {[
            { value: '50+', label: t('hero.stats.projects') },
            { value: '1M+', label: t('hero.stats.players') },
            { value: '99%', label: t('hero.stats.satisfaction') },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-4xl font-black neon-text uppercase">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/50 tracking-normal mt-1 uppercase font-black">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-widest text-white/40 font-black">SCROLL</span>
          <ChevronDown className="w-5 h-5 text-[#ff4655]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
