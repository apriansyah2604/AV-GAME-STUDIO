"use client"

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { useTransition } from '@/context/TransitionContext'

export function Footer() {
  const { t } = useLanguage()
  const { triggerTransition } = useTransition()

  const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      triggerTransition(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'auto' });
        }
      });
    }
  };

  const footerLinks = {
    services: [
      { name: t('services.list.0.title'), href: '#services' },
      { name: t('services.list.1.title'), href: '#services' },
      { name: t('services.list.3.title'), href: '#services' },
      { name: t('services.list.4.title'), href: '#services' },
    ],
    company: [
      { name: t('nav.home'), href: '#home' },
      { name: t('nav.portfolio'), href: '#portfolio' },
      { name: t('nav.topup'), href: '#topup' },
      { name: t('nav.pricing'), href: '#pricing' },
      { name: t('nav.contact'), href: '#contact' },
    ],
    social: [
      { name: 'Discord', href: 'https://discord.gg/vNjDDVf' },
      { name: 'Instagram', href: 'https://www.instagram.com/avgamestudio' },
      { name: 'TikTok', href: 'https://www.tiktok.com/@avgamestudio' },
      { name: 'YouTube', href: '#' },
      { name: 'Twitter', href: '#' },
      { name: 'Roblox', href: 'https://www.roblox.com/communities/390244299/AV-game-studio' },
    ],
  }
  return (
    <footer className="relative overflow-hidden">
      {/* Top Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#00AFFF]/50 to-transparent" />
      
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00AFFF]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a 
              href="#home" 
              onClick={(e) => handleFooterLinkClick(e, '#home')}
              className="flex items-center gap-3 mb-6 group"
            >
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="AV Game Studio"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <div className="absolute inset-0 blur-lg bg-[#00AFFF]/30 group-hover:bg-[#00AFFF]/50 transition-colors" />
              </div>
              <span className="text-xl font-bold tracking-wider neon-text">
                AV GAME STUDIO
              </span>
            </a>
            <p className="text-sm text-white/50 leading-relaxed">
              {t('footer.desc')}
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-bold tracking-widest text-[#00AFFF] mb-6">{t('footer.services')}</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => handleFooterLinkClick(e, link.href)}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-sm font-bold tracking-widest text-[#00AFFF] mb-6">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => handleFooterLinkClick(e, link.href)}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-bold tracking-widest text-[#00AFFF] mb-6">{t('footer.connect')}</h4>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#1e293b]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © 2024 AV Game Studio. {t('footer.rights')}
            </p>
            <p className="text-sm text-white/40 flex items-center gap-1">
              {t('footer.made_with')} <Heart className="w-4 h-4 text-red-500 fill-current" /> {t('footer.for_gamers')}
            </p>
          </div>
        </div>
      </div>

      {/* HUD Overlay Elements */}
      <div className="absolute bottom-4 left-4 text-xs text-[#00AFFF]/30 font-mono hidden lg:block">
        SYS://FOOTER_v1.0
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-[#00AFFF]/30 font-mono hidden lg:block">
        STATUS: ONLINE
      </div>
    </footer>
  )
}
