"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, ExternalLink, X } from 'lucide-react'
import Image from 'next/image'

const portfolioItems = [
  {
    id: 1,
    title: 'Neon District',
    category: 'Open World',
    image: '/portfolio/neon-district.jpg',
    description: 'A sprawling cyberpunk cityscape with dynamic day/night cycles and interactive NPCs.',
  },
  {
    id: 2,
    title: 'Galactic Warfare',
    category: 'Shooter',
    image: '/portfolio/galactic-warfare.jpg',
    description: 'Space combat game featuring customizable ships and epic fleet battles.',
  },
  {
    id: 3,
    title: 'Shadow Realms',
    category: 'RPG',
    image: '/portfolio/shadow-realms.jpg',
    description: 'Dark fantasy RPG with skill trees, quests, and procedural dungeons.',
  },
  {
    id: 4,
    title: 'Speed Legends',
    category: 'Racing',
    image: '/portfolio/speed-legends.jpg',
    description: 'High-octane racing with drift mechanics and vehicle customization.',
  },
  {
    id: 5,
    title: 'Apocalypse Rising',
    category: 'Survival',
    image: '/portfolio/apocalypse-rising.jpg',
    description: 'Post-apocalyptic survival with base building and PvP elements.',
  },
  {
    id: 6,
    title: 'Party Paradise',
    category: 'Social',
    image: '/portfolio/party-paradise.jpg',
    description: 'Social hangout space with minigames and customizable avatars.',
  },
]

const categories = ['All', 'Open World', 'Shooter', 'RPG', 'Racing', 'Survival', 'Social']

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#08111F] to-[#030303]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest text-[#00AFFF] border border-[#00AFFF]/30 mb-4">
            OUR WORK
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="neon-text">PORTFOLIO</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Showcase of our premium Roblox experiences and game development projects
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#00AFFF] text-[#030303]'
                  : 'glass border border-[#00AFFF]/20 text-white/60 hover:text-white hover:border-[#00AFFF]/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full bg-[#00AFFF]/20 backdrop-blur-sm border border-[#00AFFF]/50 flex items-center justify-center"
                    >
                      <Eye className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs text-[#00AFFF] tracking-wider">{item.category}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 border border-[#00AFFF]/0 group-hover:border-[#00AFFF]/50 rounded-xl transition-colors" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full glass-strong rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full glass border border-[#00AFFF]/30 hover:border-[#00AFFF] transition-colors"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#08111F] to-transparent" />
              </div>

              <div className="p-8">
                <span className="text-sm text-[#00AFFF] tracking-wider">{selectedItem.category}</span>
                <h3 className="text-3xl font-bold text-white mt-2 mb-4">{selectedItem.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6">{selectedItem.description}</p>
                
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] font-bold"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Project
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
