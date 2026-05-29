"use client"

import { motion } from 'framer-motion'
import { MessageCircle, Users, Trophy, Zap, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Community() {
  const { t } = useLanguage()

  const stats = [
    { icon: Users, value: '15K+', label: t('community.stats.members') },
    { icon: Trophy, value: '500+', label: t('community.stats.tournaments') },
    { icon: Zap, value: '24/7', label: t('community.stats.active') },
    { icon: MessageCircle, value: '1M+', label: t('community.stats.messages') },
  ]

  const socialLinks = [
    { name: 'Discord', icon: '/icons/discord.svg', url: 'https://discord.gg/vNjDDVf', members: '15,847' },
    { name: 'Instagram', icon: '/icons/instagram.svg', url: 'https://www.instagram.com/avgamestudio', members: '10K+' },
    { name: 'TikTok', icon: '/icons/tiktok.svg', url: 'https://www.tiktok.com/@avgamestudio', members: '12K' },
    { name: 'Roblox', icon: '/icons/roblox.svg', url: 'https://www.roblox.com/communities/390244299/AV-game-studio', members: '5K+' },
    { name: 'YouTube', icon: '/icons/youtube.svg', url: '#', members: '25K' },
    { name: 'Twitter', icon: '/icons/twitter.svg', url: '#', members: '8.2K' },
  ]
  return (
    <section id="community" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Grid Lines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 175, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 175, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00AFFF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest text-[#00AFFF] border border-[#00AFFF]/30 mb-4">
              {t('community.badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 px-2">
              <span className="text-white">{t('community.title1')}</span>
              <br />
              <span className="neon-text">{t('community.title2')}</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              {t('community.subtitle')}
            </p>

            {/* Discord CTA */}
            <motion.a
              href="https://discord.gg/vNjDDVf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] transition-colors group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span className="font-bold">{t('community.discord_btn')}</span>
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.a>

            {/* Live Status */}
            <div className="mt-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-white/60">
                <span className="text-green-400 font-semibold">2,847</span> {t('community.online_status')}
              </span>
            </div>
          </motion.div>

          {/* Right Content - Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* HUD Frame */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#00AFFF]/50" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#00AFFF]/50" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#00AFFF]/50" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#00AFFF]/50" />

              <div className="glass-strong rounded-2xl p-8 border border-[#00AFFF]/20">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 rounded-xl bg-[#111827]/50 border border-[#1e293b]"
                    >
                      <stat.icon className="w-6 h-6 text-[#00AFFF] mx-auto mb-2" />
                      <div className="text-2xl font-black neon-text">{stat.value}</div>
                      <div className="text-xs text-white/50 tracking-wider">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#111827]/30 border border-[#1e293b] hover:border-[#00AFFF]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1e293b] flex items-center justify-center">
                          <span className="text-lg font-bold text-[#00AFFF]">{social.name[0]}</span>
                        </div>
                        <span className="font-medium text-white/80">{social.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <span>{social.members}</span>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
