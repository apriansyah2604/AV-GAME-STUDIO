"use client"

import { motion } from 'framer-motion'
import { Play, Users, Star, Clock, ExternalLink } from 'lucide-react'
import Image from 'next/image'

const featuredMaps = [
  {
    id: 1,
    title: 'CYBER CITY 2077',
    category: 'Open World RPG',
    image: '/maps/cyber-city.jpg',
    players: '250K+',
    rating: '4.9',
    status: 'LIVE',
    description: 'A massive cyberpunk metropolis with dynamic weather and NPC systems.',
  },
  {
    id: 2,
    title: 'BATTLE ARENA',
    category: 'Competitive FPS',
    image: '/maps/battle-arena.jpg',
    players: '180K+',
    rating: '4.8',
    status: 'POPULAR',
    description: 'Fast-paced competitive shooter with ranked matchmaking.',
  },
  {
    id: 3,
    title: 'SKYLINE RACING',
    category: 'Racing Simulator',
    image: '/maps/skyline-racing.jpg',
    players: '320K+',
    rating: '4.9',
    status: 'FEATURED',
    description: 'High-speed racing through futuristic cityscapes with custom vehicles.',
  },
  {
    id: 4,
    title: 'HORROR MANSION',
    category: 'Survival Horror',
    image: '/maps/horror-mansion.jpg',
    players: '150K+',
    rating: '4.7',
    status: 'NEW',
    description: 'Atmospheric horror experience with advanced lighting and sound design.',
  },
]

export function FeaturedMaps() {
  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#08111F] to-[#030303]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 175, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 175, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest text-[#00AFFF] border border-[#00AFFF]/30 mb-4">
            FEATURED PROJECTS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="neon-text">PREMIUM</span>{' '}
            <span className="text-white">MAPS</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Explore our collection of AAA-quality Roblox experiences built with cutting-edge technology
          </p>
        </motion.div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredMaps.map((map, index) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-xl overflow-hidden glass border border-[#00AFFF]/10 hover:border-[#00AFFF]/50 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={map.image}
                  alt={map.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/50 to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    map.status === 'LIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    map.status === 'POPULAR' ? 'bg-[#00AFFF]/20 text-[#00AFFF] border border-[#00AFFF]/30' :
                    map.status === 'FEATURED' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {map.status}
                  </span>
                </div>

                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#00AFFF]/20 backdrop-blur-sm border border-[#00AFFF]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-[#00AFFF] tracking-wider">{map.category}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{map.title}</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-lg glass border border-[#00AFFF]/20 hover:border-[#00AFFF] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-[#00AFFF]" />
                  </motion.button>
                </div>

                <p className="text-sm text-white/50 mb-4">{map.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-white/60">
                    <Users className="w-4 h-4 text-[#00AFFF]" />
                    <span>{map.players}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    <span>{map.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <Clock className="w-4 h-4 text-[#00E5FF]" />
                    <span>Updated</span>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00AFFF]/10 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-lg border border-[#00AFFF]/50 text-[#00AFFF] font-bold tracking-wider hover:bg-[#00AFFF]/10 transition-colors"
          >
            VIEW ALL PROJECTS
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
