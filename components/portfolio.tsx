"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, ExternalLink, X } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

export function Portfolio() {
  const { t } = useLanguage()
  const portfolioTranslations = t('portfolio.items')
  
  const portfolioItems = [
    {
      id: 1,
      title: portfolioTranslations[0].title,
      category: 'Open World',
      image: '/portfolio/neon-district.jpg',
      description: portfolioTranslations[0].desc,
    },
    {
      id: 2,
      title: portfolioTranslations[1].title,
      category: 'Shooter',
      image: '/portfolio/galactic-warfare.jpg',
      description: portfolioTranslations[1].desc,
    },
    {
      id: 3,
      title: portfolioTranslations[2].title,
      category: 'RPG',
      image: '/portfolio/shadow-realms.jpg',
      description: portfolioTranslations[2].desc,
    },
    {
      id: 4,
      title: portfolioTranslations[3].title,
      category: 'Racing',
      image: '/portfolio/speed-legends.jpg',
      description: portfolioTranslations[3].desc,
    },
    {
      id: 5,
      title: portfolioTranslations[4].title,
      category: 'Survival',
      image: '/portfolio/apocalypse-rising.jpg',
      description: portfolioTranslations[4].desc,
    },
    {
      id: 6,
      title: portfolioTranslations[5].title,
      category: 'Social',
      image: '/portfolio/party-paradise.jpg',
      description: portfolioTranslations[5].desc,
    },
  ]

  const categories = t('portfolio.categories')
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)

  const filteredItems = activeCategory === categories[0]
    ? portfolioItems 
    : portfolioItems.filter(item => {
        // Map English category names to translated names for filtering
        const catMap: {[key: string]: string} = {
          'Open World': categories[1],
          'Shooter': categories[2],
          'RPG': categories[3],
          'Racing': categories[4],
          'Survival': categories[5],
          'Social': categories[6]
        }
        return catMap[item.category] === activeCategory
      })

  return (
    <section id="portfolio" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0c0506] to-[#030303]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-none border border-[#ff4655]/30 text-xs tracking-normal text-[#ff4655] font-black uppercase italic mb-4">
            {t('portfolio.badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 px-2 uppercase tracking-tight">
            <span className="neon-text">{t('portfolio.title')}</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto font-medium">
            {t('portfolio.subtitle')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-none text-xs font-black transition-all duration-300 uppercase skew-x-[-12deg] ${
                activeCategory === category
                  ? 'bg-[#ff4655] text-white'
                  : 'glass border border-white/10 text-white/60 hover:text-white hover:border-[#ff4655]/50'
              }`}
            >
              <span className="skew-x-[12deg] inline-block">{category}</span>
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item: any) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-none overflow-hidden cursor-pointer border border-white/5"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-none bg-[#ff4655]/20 backdrop-blur-sm border border-[#ff4655]/50 flex items-center justify-center skew-x-[-12deg]"
                    >
                      <Eye className="w-6 h-6 text-white -skew-x-[-12deg]" />
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[10px] font-black text-[#ff4655] tracking-normal uppercase italic">{item.category}</span>
                  <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tight">{item.title}</h3>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 border border-[#ff4655]/0 group-hover:border-[#ff4655]/30 rounded-none transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/95 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full glass-strong rounded-none border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-3 rounded-none glass border border-white/20 hover:border-[#ff4655] transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="relative aspect-video">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0506] to-transparent" />
              </div>

              <div className="p-8">
                <span className="text-[10px] font-black text-[#ff4655] tracking-normal uppercase italic">{selectedItem.category}</span>
                <h3 className="text-3xl font-black text-white mt-2 mb-4 uppercase tracking-tight">{selectedItem.title}</h3>
                <p className="text-white/60 leading-relaxed mb-8 font-medium">{selectedItem.description}</p>
                
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-none bg-[#ff4655] text-white font-black uppercase skew-x-[-12deg]"
                >
                  <span className="skew-x-[12deg] flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    {t('portfolio.view_project')}
                  </span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
