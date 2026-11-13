"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Star, Clock, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

export function FeaturedMaps() {
  const { t } = useLanguage()
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
  }, [])

  const mapsData = content?.featured_maps || [
    {
      id: 1,
      title: t('featured_maps.maps.0.title'),
      category: t('featured_maps.categories.adventure'),
      image: 'https://tr.rbxcdn.com/180DAY-6dcef4ca18c43364e9bc8fd92f95f989/512/512/Image/Png/noFilter',
      players: '180K+',
      rating: '4.9',
      status: t('featured_maps.status.featured'),
      description: t('featured_maps.maps.0.desc'),
      robloxUrl: 'https://www.roblox.com/games/93190255569512',
    },
    {
      id: 2,
      title: t('featured_maps.maps.1.title'),
      category: t('featured_maps.categories.extreme'),
      image: 'https://tr.rbxcdn.com/180DAY-90993fa9d5266fec6b29fa915cbadc3e/512/512/Image/Png/noFilter',
      players: '120K+',
      rating: '4.8',
      status: t('featured_maps.status.new'),
      description: t('featured_maps.maps.1.desc'),
      robloxUrl: 'https://www.roblox.com/games/135786186771204',
    },
    {
      id: 3,
      title: t('featured_maps.maps.2.title'),
      category: t('featured_maps.categories.social'),
      image: 'https://tr.rbxcdn.com/180DAY-59017a76e7a67bd4621f1950f532534b/512/512/Image/Png/noFilter',
      players: '250K+',
      rating: '4.8',
      status: t('featured_maps.status.popular'),
      description: t('featured_maps.maps.2.desc'),
      robloxUrl: 'https://www.roblox.com/games/108744060901139',
    },
    {
      id: 4,
      title: 'ARENA BAKU HANTAM',
      category: t('featured_maps.categories.fighting'),
      image: 'https://tr.rbxcdn.com/180DAY-72342328c9b34d09210045eb4a1cac62/512/512/Image/Png/noFilter',
      players: '320K+',
      rating: '4.9',
      status: t('featured_maps.status.live'),
      description: t('featured_maps.maps.3.desc'),
      robloxUrl: 'https://www.roblox.com/games/134794987581522',
    },
    {
      id: 5,
      title: t('featured_maps.maps.4.title'),
      category: t('featured_maps.categories.social'),
      image: 'https://tr.rbxcdn.com/180DAY-46f90c01844387819e6d3cced40425da/512/512/Image/Png/noFilter',
      players: '200K+',
      rating: '4.7',
      status: t('featured_maps.status.popular'),
      description: t('featured_maps.maps.4.desc'),
      robloxUrl: 'https://www.roblox.com/games/110701523429897',
    },
    {
      id: 6,
      title: t('featured_maps.maps.5.title'),
      category: t('featured_maps.categories.farming'),
      image: 'https://tr.rbxcdn.com/180DAY-798a413d0a80f98409e124c49d565ada/512/512/Image/Png/noFilter',
      players: '200K+',
      rating: '4.7',
      status: t('featured_maps.status.popular'),
      description: t('featured_maps.maps.5.desc'),
      robloxUrl: 'https://www.roblox.com/games/92999311463755',
    },
    {
      id: 7,
      title: t('featured_maps.maps.6.title'),
      category: t('featured_maps.categories.parkour'),
      image: 'https://tr.rbxcdn.com/180DAY-e0f8bb0e879c7f7d94665c743210de0a/512/512/Image/Png/noFilter',
      players: '280K+',
      rating: '4.8',
      status: t('featured_maps.status.featured'),
      description: t('featured_maps.maps.6.desc'),
      robloxUrl: 'https://www.roblox.com/games/113416088111827',
    },
    {
      id: 8,
      title: 'ORANG HILANG',
      category: t('featured_maps.categories.mystery'),
      image: 'https://tr.rbxcdn.com/180DAY-cc2ec9f9296f829f2586d9f3820a529d/512/512/Image/Png/noFilter',
      players: '150K+',
      rating: '4.9',
      status: t('featured_maps.status.new'),
      description: t('featured_maps.maps.7.desc'),
      robloxUrl: 'https://www.roblox.com/games/117329679880313',
    },
    {
      id: 9,
      title: t('featured_maps.maps.8.title'),
      category: t('featured_maps.categories.adventure'),
      image: 'https://tr.rbxcdn.com/180DAY-9b3461379dd8f778d5732080b3a04832/512/512/Image/Png/noFilter',
      players: '100K+',
      rating: '4.8',
      status: t('featured_maps.status.new'),
      description: t('featured_maps.maps.8.desc'),
      robloxUrl: 'https://www.roblox.com/games/96611763729085',
    },
    {
      id: 10,
      title: t('featured_maps.maps.9.title'),
      category: t('featured_maps.categories.adventure'),
      image: 'https://tr.rbxcdn.com/180DAY-8b59f9b1db0aff45ba2977aab018d39a/512/512/Image/Png/noFilter',
      players: '85K+',
      rating: '4.9',
      status: t('featured_maps.status.new'),
      description: t('featured_maps.maps.9.desc'),
      robloxUrl: 'https://www.roblox.com/games/108573422641026',
    },
    {
      id: 11,
      title: 'TEMPAT NONGKRONG [VOICE CHAT]',
      category: t('featured_maps.categories.social'),
      image: 'https://tr.rbxcdn.com/180DAY-98d07fe3a66d690c2d76155b42dd52c8/512/512/Image/Png/noFilter',
      players: '—',
      rating: '—',
      status: t('featured_maps.status.new'),
      description: t('featured_maps.maps.4.desc'),
      robloxUrl: 'https://www.roblox.com/games/137887065004078',
    },
    {
      id: 12,
      title: 'BOGOR PARTY',
      category: t('featured_maps.categories.social'),
      image: 'https://t7.rbxcdn.com/180DAY-88edbd4c22e4a1b7ef17bb94d78ebde1',
      players: '—',
      rating: '—',
      status: t('featured_maps.status.new'),
      description: t('featured_maps.maps.2.desc'),
      robloxUrl: 'https://www.roblox.com/games/87991029880891',
    },
    {
      id: 13,
      title: 'GO KART INDO',
      category: t('featured_maps.categories.racing'),
      image: 'https://tr.rbxcdn.com/180DAY-983edf5b97e48b77c38f9faca32bf608/512/512/Image/Png/noFilter',
      players: '—',
      rating: '—',
      status: t('featured_maps.status.new'),
      description: t('featured_maps.maps.6.desc'),
      robloxUrl: 'https://www.roblox.com/games/90814120027704',
    },
  ]

  return (
    <section id="projects" className="relative py-20 lg:py-32 overflow-hidden" suppressHydrationWarning>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0c0506] to-[#030303]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 70, 85, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 70, 85, 0.1) 1px, transparent 1px)
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
          <span className="inline-block px-4 py-1 rounded-none border border-[#ff4655]/30 text-xs tracking-normal text-[#ff4655] font-black uppercase italic mb-4">
            {t('featured_maps.badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 px-2 tracking-tight uppercase">
            <span className="neon-text">{t('featured_maps.title1')}</span>{' '}
            <span className="text-white">{t('featured_maps.title2')}</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto font-medium">
            {t('featured_maps.subtitle')}
          </p>
        </motion.div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mapsData.map((map: any, index: number) => (
            <motion.a
              key={map.id || index}
              href={map.robloxUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-none overflow-hidden glass border border-white/5 hover:border-[#ff4655]/50 transition-all duration-500 cursor-pointer block"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden" suppressHydrationWarning>
                <Image
                  src={map.image}
                  alt={map.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-none text-[10px] font-black tracking-normal uppercase italic ${
                    map.status === 'LANGSUNG' || map.status === 'LIVE' ? 'bg-emerald-500 text-white skew-x-[-12deg]' :
                    map.status === 'POPULER' || map.status === 'POPULAR' ? 'bg-[#ff4655] text-white skew-x-[-12deg]' :
                    map.status === 'UNGGULAN' || map.status === 'FEATURED' ? 'bg-yellow-500 text-black skew-x-[-12deg]' :
                    'bg-white text-black skew-x-[-12deg]'
                  }`}>
                    <span className="skew-x-[12deg] inline-block">{map.status}</span>
                  </span>
                </div>

                {/* Play Button Icon Overlay */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-none bg-[#ff4655] border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity skew-x-[-12deg]"
                >
                  <Play className="w-8 h-8 text-white ml-1 -skew-x-[-12deg]" fill="currentColor" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black tracking-normal text-[#ff4655] uppercase">
                    {map.category}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-none bg-white/5 border border-white/10">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-[10px] font-black text-white">{map.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-2 tracking-tight leading-tight group-hover:text-[#ff4655] transition-colors line-clamp-2 uppercase">
                  {map.title}
                </h3>

                <p className="text-sm text-white/50 mb-6 line-clamp-2 leading-relaxed font-medium">
                  {map.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-white/30" />
                    <span className="text-sm font-black text-white/70 uppercase">{map.players}</span>
                    <span className="text-[10px] text-white/30 uppercase tracking-tight font-black">{t('featured_maps.stats.players')}</span>
                  </div>

                  <motion.div
                     whileHover={{ x: 5 }}
                     className="flex items-center gap-2 text-xs font-black text-[#ff4655] group/btn uppercase tracking-normal italic"
                   >
                     {t('featured_maps.play_now')}
                     <Play className="w-3 h-3 fill-current" />
                   </motion.div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff4655]/10 to-transparent" />
              </div>
            </motion.a>
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
            className="px-8 py-4 rounded-none border border-[#ff4655]/50 text-[#ff4655] font-black tracking-normal hover:bg-[#ff4655]/10 transition-colors uppercase italic skew-x-[-12deg]"
          >
            <span className="skew-x-[12deg] inline-block">VIEW ALL PROJECTS</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
