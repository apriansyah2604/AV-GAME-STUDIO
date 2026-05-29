"use client"

import { motion } from 'framer-motion'
import { Package, Download, ExternalLink, Tag } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Assets() {
  const { t } = useLanguage()

  const assets = t('assets.items')

  return (
    <section id="assets" className="relative py-20 lg:py-32 overflow-hidden" suppressHydrationWarning>
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 70, 85, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 70, 85, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-none border border-[#ff4655]/30 text-xs tracking-normal text-[#ff4655] font-black uppercase italic mb-4"
          >
            {t('assets.badge')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tight"
          >
            <span className="text-white">{t('assets.title1')}</span>
            <br />
            <span className="neon-text">{t('assets.title2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/50 text-lg font-medium"
          >
            {t('assets.subtitle')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset: any, index: number) => (
            <motion.div
              key={asset.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative glass-strong border border-white/10 p-6 flex flex-col h-full"
            >
              <div className="mb-6 relative aspect-square bg-[#111827] flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-[#ff4655]/30 transition-colors">
                <Package className="w-12 h-12 text-white/20 group-hover:text-[#ff4655]/40 transition-colors" />
                
                {/* Type Label */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 text-[10px] font-black tracking-normal uppercase italic skew-x-[-12deg] ${
                    asset.type === 'free' 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-[#ff4655] text-white'
                  }`}>
                    <span className="skew-x-[12deg] inline-block">
                      {asset.type === 'free' ? t('assets.free_label') : t('assets.paid_label')}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black text-white uppercase mb-2 group-hover:text-[#ff4655] transition-colors">
                  {asset.title}
                </h3>
                <p className="text-sm text-white/50 font-medium mb-4">
                  {asset.desc}
                </p>
              </div>

              <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                {asset.type === 'paid' && (
                  <span className="text-lg font-black text-white">{asset.price}</span>
                )}
                <motion.a
                  href={asset.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-normal transition-all ${
                    asset.type === 'free'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-[#ff4655] text-white hover:brightness-110'
                  }`}
                >
                  {t('assets.get_now')}
                  {asset.type === 'free' ? <Download className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
