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
  Lock,
  Star,
  Gamepad2,
  ChevronRight
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ADMIN_WHATSAPP } from '@/lib/utils'

export function TopUp() {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [content, setContent] = useState<any>(null)
  const [availableFunds, setAvailableFunds] = useState<number | null>(null)
  
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)
    
    fetch('/api/content', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setContent(data)
        
        // Auto-select game if hash exists
        if (typeof window !== 'undefined' && window.location.hash === '#robux') {
          const robloxGame = {
            id: 'roblox-robux',
            name: 'Roblox Robux',
            image: '/icon robux.png',
            category: 'Roblox',
            packages: data.robux_packages || []
          }
          setSelectedGame(robloxGame)
        }
      })

    fetch('/api/check-funds', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.funds === 'number') {
          setAvailableFunds(data.funds)
        } else {
          setAvailableFunds(-1) // Indikator bot offline atau error
        }
      })
      .catch(() => setAvailableFunds(-1))
  }, [])

  if (!isMounted) return null

  const robloxEntry = {
    id: 'roblox-robux',
    name: 'Roblox Robux',
    image: '/icon robux.png',
    category: 'Roblox',
    description: 'Top Up Robux aman dan resmi melalui proses admin.',
    packages: content?.robux_packages || []
  }

  const gameList = [robloxEntry, ...(content?.game_list || [])]
    .filter((game: any) => {
      const matchesCategory = activeCategory === 'Semua' || game.category === activeCategory;
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (game.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })

  const marketCategories = t('market_categories')

  const handleGameSelect = (game: any) => {
    setSelectedGame(game)
    setSearchQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section id="topup" className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#1a0a0c] to-[#030303]" />
      <div className="absolute left-1/2 top-24 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[#ff4655]/10 blur-3xl" />
      <div className="absolute right-10 top-20 h-48 w-48 rounded-full bg-[#ff4655]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-none border border-[#ff4655]/30 bg-[#ff4655]/10 text-[#ff4655] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
            {t('topup.badge')}
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic mb-6">
            TOP UP <span className="text-[#ff4655]">CENTER</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/40 text-sm md:text-lg font-medium leading-relaxed">
            Pilih game favoritmu dan temukan penawaran terbaik untuk pengisian saldo game instan dan terpercaya.
          </p>
        </motion.div>

        {/* Minimalist Navigation Row */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {!selectedGame ? (
              marketCategories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-none px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                    activeCategory === category
                      ? 'bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.3)] skew-x-[-12deg]'
                      : 'border border-white/10 bg-white/5 text-white/40 hover:border-[#ff4655]/50'
                  }`}
                >
                  <span className={activeCategory === category ? '-skew-x-[-12deg] inline-block' : ''}>{category}</span>
                </button>
              ))
            ) : (
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-3 rounded-none px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all border border-[#ff4655]/50 bg-[#ff4655]/10 text-[#ff4655] hover:bg-[#ff4655]/20 skew-x-[-12deg]"
              >
                <ChevronRight className="w-4 h-4 rotate-180 -skew-x-[-12deg]" />
                <span className="-skew-x-[-12deg]">Kembali ke Daftar Game</span>
              </button>
            )}
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff4655]" />
            <input 
              type="text"
              placeholder={selectedGame ? `Cari di ${selectedGame.name}...` : "Cari game..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-none py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff4655]/50 transition-all uppercase font-bold"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{t('topup.etalase_title')}</h3>
              <p className="mt-2 text-sm text-white/45 font-medium">
                {t('topup.etalase_desc')}
              </p>
            </div>
            <div className="hidden rounded-none border border-[#ff4655]/30 bg-[#ff4655]/5 px-5 py-2.5 text-xs tracking-normal text-[#ff4655] font-black uppercase md:block skew-x-[-12deg]">
              <span className="-skew-x-[-12deg] inline-block">
                {selectedGame?.id === 'roblox-robux' 
                  ? (availableFunds !== null && availableFunds >= 0 
                      ? `Stok: ${availableFunds.toLocaleString()} Robux` 
                      : (availableFunds === -1 ? 'Bot Offline / Error' : 'Mengecek Stok...'))
                  : t('topup.ready_stock')}
              </span>
            </div>
          </motion.div>

          <div className={selectedGame ? "space-y-5" : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"}>
            {selectedGame ? (
              (selectedGame.packages || []).map((pkg: any, index: number) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative overflow-hidden rounded-none border border-white/5 bg-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#ff4655]/30 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-none bg-gradient-to-br from-[#ff4655] to-[#ff4655]/50 flex items-center justify-center skew-x-[-12deg] shadow-lg">
                      {selectedGame.id === 'roblox-robux' ? (
                        <img
                          src="/icon robux.png"
                          alt="Robux"
                          className="w-10 h-10 object-contain -skew-x-[-12deg] brightness-0 invert"
                        />
                      ) : (
                        <Gamepad2 className="w-8 h-8 text-white -skew-x-[-12deg]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{pkg.name}</h4>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">{selectedGame.name} Top Up</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <div className="text-2xl font-black text-[#ff4655] uppercase tracking-tighter">{pkg.price}</div>
                      <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                        {selectedGame.id === 'roblox-robux' ? 'Proses Admin' : 'Harga Instant'}
                      </div>
                    </div>

                    <motion.a
                      href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                        `Halo AV GAME STUDIO, saya ingin top up ${selectedGame.name} paket ${pkg.name} dengan harga ${pkg.price}. Mohon info pembayarannya.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-[#ff4655] text-white font-black uppercase italic tracking-tighter skew-x-[-12deg] shadow-lg shadow-[#ff4655]/20 flex items-center gap-2 group-hover:brightness-110 transition-all"
                    >
                      <span className="-skew-x-[-12deg] flex items-center gap-2">
                        BELI SEKARANG
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </motion.a>
                  </div>
                </motion.div>
              ))
            ) : (
              gameList.map((game: any, index: number) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleGameSelect(game)}
                  className="group relative bg-[#121212] border border-white/5 hover:border-[#ff4655]/50 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={game.image || '/placeholder.jpg'}
                      alt={game.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e: any) => {
                        e.target.src = '/placeholder.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-2 left-2">
                       <span className="px-2 py-0.5 bg-[#ff4655] text-[10px] font-black text-white uppercase">
                         {game.category}
                       </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-black uppercase text-sm mb-1 group-hover:text-[#ff4655] transition-colors truncate">
                      {game.name}
                    </h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">
                      {game.description?.substring(0, 30)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] text-white/60 font-bold">4.9</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#ff4655] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-[#ff4655] w-0 group-hover:w-full transition-all duration-300" />
                </motion.div>
              ))
            )}
          </div>

          {/* Info Transaksi Section - Moved to Bottom and Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="flex items-start gap-4 rounded-none border border-white/5 bg-white/5 p-6 hover:border-[#ff4655]/30 transition-all group">
              <div className="p-3 bg-[#ff4655]/10 border border-[#ff4655]/20 text-[#ff4655] skew-x-[-12deg] group-hover:bg-[#ff4655] group-hover:text-white transition-all">
                <ShieldCheck className="h-6 w-6 -skew-x-[-12deg]" />
              </div>
              <div>
                <div className="font-black text-white uppercase tracking-tight mb-1">{t('topup.info_transaksi.title')}</div>
                <p className="text-xs text-white/40 font-medium leading-relaxed uppercase">Sistem keamanan terenkripsi dan terpercaya.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 rounded-none border border-white/5 bg-white/5 p-6 hover:border-[#ff4655]/30 transition-all group">
              <div className="p-3 bg-[#ff4655]/10 border border-[#ff4655]/20 text-[#ff4655] skew-x-[-12deg] group-hover:bg-[#ff4655] group-hover:text-white transition-all">
                <BadgeCheck className="h-6 w-6 -skew-x-[-12deg]" />
              </div>
              <div>
                <div className="font-black text-white uppercase tracking-tight mb-1">{t('topup.info_transaksi.flow_title')}</div>
                <p className="text-xs text-white/40 font-medium leading-relaxed uppercase">{t('topup.info_transaksi.flow_desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-none border border-white/5 bg-white/5 p-6 hover:border-[#ff4655]/30 transition-all group">
              <div className="p-3 bg-[#ff4655]/10 border border-[#ff4655]/20 text-[#ff4655] skew-x-[-12deg] group-hover:bg-[#ff4655] group-hover:text-white transition-all">
                <Clock3 className="h-6 w-6 -skew-x-[-12deg]" />
              </div>
              <div>
                <div className="font-black text-white uppercase tracking-tight mb-1">{t('topup.info_transaksi.easy_title')}</div>
                <p className="text-xs text-white/40 font-medium leading-relaxed uppercase">{t('topup.info_transaksi.easy_desc')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
