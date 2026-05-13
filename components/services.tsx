"use client"

import { motion } from 'framer-motion'
import { Map, Code2, Music, Palette, Sparkles, Gauge, Users2 } from 'lucide-react'

const services = [
  {
    icon: Map,
    title: 'Roblox Map Development',
    description: 'Custom world building with immersive environments, detailed terrain, and optimized assets for seamless gameplay.',
    features: ['World Design', 'Asset Creation', 'Environment Art'],
  },
  {
    icon: Code2,
    title: 'Advanced Scripting',
    description: 'Professional Lua scripting for complex game mechanics, AI systems, and multiplayer functionality.',
    features: ['Game Logic', 'AI Systems', 'Networking'],
  },
  {
    icon: Music,
    title: 'DJ Music Systems',
    description: 'Interactive audio systems with custom soundtracks, dynamic music, and immersive sound design.',
    features: ['Sound Design', 'Music Integration', 'Audio FX'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Modern, intuitive interfaces with smooth animations and responsive layouts for all devices.',
    features: ['Interface Design', 'Animation', 'Mobile Ready'],
  },
  {
    icon: Sparkles,
    title: 'VFX & Lighting',
    description: 'Cinematic visual effects and dynamic lighting systems that bring your world to life.',
    features: ['Particle FX', 'Dynamic Lights', 'Atmosphere'],
  },
  {
    icon: Gauge,
    title: 'Optimization',
    description: 'Performance tuning for smooth gameplay on all devices, from mobile to high-end PCs.',
    features: ['FPS Boost', 'Memory Opt', 'Load Times'],
  },
  {
    icon: Users2,
    title: 'Community Systems',
    description: 'Leaderboards, achievements, social features, and engagement tools to grow your player base.',
    features: ['Leaderboards', 'Achievements', 'Social'],
  },
]

export function Services() {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#00AFFF]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest text-[#00AFFF] border border-[#00AFFF]/30 mb-4">
            WHAT WE DO
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="text-white">OUR</span>{' '}
            <span className="neon-text">SERVICES</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Comprehensive game development solutions powered by cutting-edge technology
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-xl glass border border-[#00AFFF]/10 hover:border-[#00AFFF]/50 transition-all duration-500 h-full">
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-xl animate-neon-border" />
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00AFFF]/20 to-[#00E5FF]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-[#00AFFF]" />
                  </div>
                  <div className="absolute -inset-2 bg-[#00AFFF]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00AFFF] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-white/50 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full text-xs bg-[#111827] text-white/60 border border-[#1e293b]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00AFFF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
