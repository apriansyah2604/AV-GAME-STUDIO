"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

export function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.portfolio'), href: '#portfolio' },
    { name: t('nav.topup'), href: '#topup' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.contact'), href: '#contact' },
  ]

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
            ? 'glass-strong shadow-lg shadow-[#00AFFF]/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#home"
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
                <div className="absolute inset-0 blur-lg bg-[#00AFFF]/30 group-hover:bg-[#00AFFF]/50 transition-colors" />
              </div>
              <span className="text-xl font-bold tracking-wider neon-text">
                AV GAME STUDIO
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-[#00AFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId="navbar-hover"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#00AFFF]/20 bg-[#00AFFF]/5 hover:bg-[#00AFFF]/10 transition-colors text-xs font-bold tracking-wider text-white/80"
                >
                  <Globe className="w-4 h-4 text-[#00AFFF]" />
                  <span>{language.toUpperCase()}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-32 rounded-xl glass-strong border border-[#00AFFF]/20 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setLanguage('id')
                          setIsLangOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-xs font-bold text-left hover:bg-[#00AFFF]/10 transition-colors ${language === 'id' ? 'text-[#00AFFF]' : 'text-white/60'}`}
                      >
                        INDONESIA
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('en')
                          setIsLangOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-xs font-bold text-left hover:bg-[#00AFFF]/10 transition-colors ${language === 'en' ? 'text-[#00AFFF]' : 'text-white/60'}`}
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
              className="lg:hidden p-2 rounded-lg glass"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#00AFFF]" />
              ) : (
                <Menu className="w-6 h-6 text-[#00AFFF]" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden pt-20"
          >
            <div className="absolute inset-0 bg-[#030303]/95 backdrop-blur-xl" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-lg font-semibold text-white/70 hover:text-[#00AFFF] hover:bg-[#00AFFF]/5 rounded-xl transition-all"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile Language Switcher */}
              <div className="px-4 py-4 border-t border-[#00AFFF]/10">
                <p className="text-xs font-bold tracking-widest text-white/30 mb-4 uppercase">Select Language</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setLanguage('id')
                      setIsMobileMenuOpen(false)
                    }}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                      language === 'id'
                        ? 'bg-[#00AFFF] border-[#00AFFF] text-[#030303]'
                        : 'bg-[#00AFFF]/5 border-[#00AFFF]/20 text-white/60'
                    }`}
                  >
                    INDONESIA
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en')
                      setIsMobileMenuOpen(false)
                    }}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                      language === 'en'
                        ? 'bg-[#00AFFF] border-[#00AFFF] text-[#030303]'
                        : 'bg-[#00AFFF]/5 border-[#00AFFF]/20 text-white/60'
                    }`}
                  >
                    ENGLISH
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
