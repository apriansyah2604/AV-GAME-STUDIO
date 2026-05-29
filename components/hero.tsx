"use client"

import { motion } from 'framer-motion'
import { ChevronDown, Rocket, ShoppingCart, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useTransition } from '@/context/TransitionContext'

export function Hero() {
  const { t } = useLanguage()
  const { triggerTransition } = useTransition()

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    triggerTransition(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
      }
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#030303]">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 175, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 175, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00AFFF]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-3xl" />
        
        {/* Scan Lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00AFFF]/5 to-transparent opacity-30 animate-pulse" />
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
              className="absolute w-full h-full border-2 border-[#00AFFF]/30"
              style={{
                transform: `rotateX(${i * 60}deg) rotateY(${i * 60}deg) translateZ(100px)`,
                boxShadow: 'inset 0 0 30px rgba(0, 175, 255, 0.1)',
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
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#00AFFF]/50" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-[#00AFFF]/50" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-[#00AFFF]/50" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#00AFFF]/50" />

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#00AFFF]/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-xs font-medium tracking-wider text-white/80">
              {t('hero.status')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1] px-2"
          >
            <span className="block neon-text">{t('hero.title1')}</span>
            <span className="block bg-gradient-to-r from-[#00AFFF] via-white to-[#00E5FF] bg-clip-text text-transparent pb-2">
              {t('hero.title2')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light tracking-wide px-4"
          >
            {t('hero.subtitle')}
            <span className="block mt-2 text-xs sm:text-sm text-[#00AFFF]/80">
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
            className="group relative px-6 py-4 rounded-xl overflow-hidden text-center sm:px-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] animate-pulse-glow" />
            <div className="absolute inset-[1px] rounded-xl bg-[#030303] group-hover:bg-transparent transition-colors duration-300" />
            <span className="relative flex items-center justify-center gap-2 font-bold tracking-wider text-white group-hover:text-[#030303] transition-colors text-xs sm:text-base">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('hero.explore')}
            </span>
          </motion.a>

          <motion.a
            href="#pricing"
            onClick={(e) => handleCtaClick(e, '#pricing')}
            className="group relative px-6 py-4 rounded-xl overflow-hidden bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-center shadow-[0_0_20px_rgba(0,175,255,0.3)] sm:px-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative flex items-center justify-center gap-2 font-bold tracking-wider text-[#030303] text-xs sm:text-base">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('hero.order')}
            </span>
          </motion.a>

          <motion.a
            href="#community"
            onClick={(e) => handleCtaClick(e, '#community')}
            className="group relative px-6 py-4 rounded-xl glass border border-[#00AFFF]/30 hover:border-[#00AFFF] transition-colors text-center sm:px-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative flex items-center justify-center gap-2 font-bold tracking-wider text-white/80 group-hover:text-white transition-colors text-xs sm:text-base">
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
              <div className="text-2xl sm:text-4xl font-black neon-text">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-white/50 tracking-widest mt-1 uppercase">{stat.label}</div>
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
          <span className="text-xs tracking-widest text-white/40">SCROLL</span>
          <ChevronDown className="w-5 h-5 text-[#00AFFF]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
