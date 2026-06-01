"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ChevronDown, ArrowRight, Instagram, Music2 } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { useTransition } from '@/context/TransitionContext'

export function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const { triggerTransition } = useTransition()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    triggerTransition(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' }); // behavior auto because animation handles the feel
      }
    });
  };

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.portfolio'), href: '#portfolio' },
    { name: t('nav.gallery'), href: '#gallery' },
    { name: t('nav.assets'), href: '#assets' },
    { name: t('nav.topup'), href: '#topup' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.contact'), href: '#contact' },
  ]

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-strong shadow-lg shadow-[#ff4655]/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
               href="#home"
               onClick={(e) => handleNavLinkClick(e, '#home')}
               className="flex items-center gap-3 group"
               whileHover={{ scale: 1.02 }}
             >
               <div className="relative">
                 <Image
                   src="/logo.png"
                   alt="AV Game Studio"
                   width={48}
                   height={48}
                   className="w-12 h-12 object-contain"
                 />
                 <div className="absolute inset-0 blur-lg bg-[#ff4655]/20 group-hover:bg-[#ff4655]/40 transition-colors" />
               </div>
               <span className="text-xl font-black uppercase hidden sm:block tracking-tight">
                  AV GAME <span className="text-[#ff4655]">STUDIO</span>
                </span>
             </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    className="relative px-2 py-1 text-sm font-black uppercase text-white/70 hover:text-[#ff4655] transition-colors group tracking-normal"
                  >
                    {link.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4655]"
                    whileHover={{ width: '100%' }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.a
                href="#topup"
                onClick={(e) => handleNavLinkClick(e, '#topup')}
                className="hidden md:flex relative px-6 py-2 rounded-none overflow-hidden group items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-[#ff4655] skew-x-[-12deg]" />
                <span className="relative font-black tracking-normal text-white uppercase text-sm skew-x-[12deg]">
                  {t('nav.topup_btn')}
                </span>
              </motion.a>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-white/20 bg-white/5 hover:border-[#ff4655] transition-colors text-xs font-black tracking-normal text-white/80"
                >
                  <Globe className="w-4 h-4 text-[#ff4655]" />
                  <span>{language.toUpperCase()}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 rounded-none glass-strong border border-[#ff4655]/20 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setLanguage('id')
                          setIsLangOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-xs font-black text-left hover:bg-[#ff4655]/10 transition-colors uppercase ${language === 'id' ? 'text-[#ff4655]' : 'text-white/60'}`}
                      >
                        INDONESIA
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('en')
                          setIsLangOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-xs font-black text-left hover:bg-[#ff4655]/10 transition-colors uppercase ${language === 'en' ? 'text-[#ff4655]' : 'text-white/60'}`}
                      >
                        ENGLISH
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-none glass"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#ff4655]" />
              ) : (
                <Menu className="w-6 h-6 text-[#ff4655]" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#030303]/98 backdrop-blur-2xl" />
            
            {/* Animated Grid Background for Mobile Menu */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,70,85,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,70,85,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative h-full flex flex-col px-6 pt-24 pb-10">
              {/* Mobile Header (Close Button) */}
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-none glass-strong border border-[#ff4655]/20"
                >
                  <X className="w-6 h-6 text-[#ff4655]" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto space-y-2 py-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block px-4 py-4 text-2xl font-black tracking-tight text-white/80 hover:text-[#ff4655] transition-colors uppercase"
                  >
                    <span className="flex items-center justify-between">
                      {link.name}
                      <ArrowRight className="w-5 h-5 text-[#ff4655]/30" />
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Mobile Footer Area */}
              <div className="mt-auto space-y-8 pt-8 border-t border-[#ff4655]/10">
                {/* Top Up CTA Mobile */}
                <motion.a
                  href="#topup"
                  onClick={(e) => handleNavLinkClick(e, '#topup')}
                  className="flex relative px-6 py-4 rounded-none overflow-hidden group items-center justify-center w-full"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-[#ff4655] skew-x-[-12deg]" />
                  <span className="relative font-black tracking-normal text-white uppercase text-lg skew-x-[12deg]">
                    {t('nav.topup_btn')}
                  </span>
                </motion.a>

                {/* Language Switcher */}
                <div>
                  <p className="text-[10px] font-black tracking-normal text-[#ff4655] mb-4 uppercase opacity-50">Select Region</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setLanguage('id')
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-none border text-xs font-black transition-all flex items-center justify-center gap-2 ${
                        language === 'id'
                          ? 'bg-[#ff4655]/10 border-[#ff4655] text-[#ff4655]'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      INDONESIA
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en')
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-3 rounded-none border text-xs font-black transition-all flex items-center justify-center gap-2 ${
                        language === 'en'
                          ? 'bg-[#ff4655]/10 border-[#ff4655] text-[#ff4655]'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      ENGLISH
                    </button>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-4 justify-center">
                  <a 
                    href="https://www.instagram.com/avgamestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-none glass border border-white/10 flex items-center justify-center text-white/40 hover:text-[#ff4655] transition-colors skew-x-[-12deg]"
                  >
                    <Instagram className="w-5 h-5 -skew-x-[-12deg]" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@avgamestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-none glass border border-white/10 flex items-center justify-center text-white/40 hover:text-[#ff4655] transition-colors skew-x-[-12deg]"
                  >
                    <Music2 className="w-5 h-5 -skew-x-[-12deg]" />
                  </a>
                  <a 
                    href="https://discord.gg/vNjDDVf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-none glass border border-white/10 flex items-center justify-center text-white/40 hover:text-[#ff4655] transition-colors skew-x-[-12deg]"
                  >
                    <Globe className="w-5 h-5 -skew-x-[-12deg]" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
