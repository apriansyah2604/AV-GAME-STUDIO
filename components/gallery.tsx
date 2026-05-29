"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { Camera, Heart, Share2, ZoomIn, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Gallery() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/gallery')
      const data = await response.json()
      setPhotos(data)
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to convert Google Drive sharing link to direct link
  const getGoogleDriveLink = (linkOrId: string) => {
    if (!linkOrId) return ''
    // If it's already a direct link or local path
    if (linkOrId.startsWith('/') || (linkOrId.startsWith('http') && !linkOrId.includes('drive.google.com'))) {
      return linkOrId
    }
    // Extract ID from various Google Drive link formats
    const idMatch = linkOrId.match(/(?:id=|\/d\/|folders\/)([\w-]+)/)
    const id = idMatch ? idMatch[1] : linkOrId
    return `https://lh3.googleusercontent.com/d/${id}`
  }

  return (
    <section id="gallery" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#ff4655]/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-none border border-[#ff4655]/30 text-xs tracking-normal text-[#ff4655] font-black uppercase italic mb-4">
            <Camera className="w-3 h-3" />
            {t('gallery.badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 px-2 uppercase tracking-tight">
            <span className="text-white">{t('gallery.title1')}</span>{' '}
            <span className="neon-text">{t('gallery.title2')}</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto font-medium">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[#ff4655] animate-spin" />
          </div>
        ) : (
          /* Masonry-like Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square rounded-none overflow-hidden border border-white/5 bg-[#0c0506]/50 cursor-pointer"
                onClick={() => setSelectedImage(getGoogleDriveLink(photo.src))}
              >
                <Image
                  src={getGoogleDriveLink(photo.src)}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-none bg-[#ff4655] text-white text-[10px] font-black uppercase tracking-normal italic skew-x-[-12deg]">
                        <span className="skew-x-[12deg] inline-block">{photo.category}</span>
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight uppercase">
                      {photo.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/80">
                      <button className="flex items-center gap-2 hover:text-[#ff4655] transition-colors group/btn">
                        <Heart className="w-5 h-5 group-hover/btn:fill-[#ff4655]" />
                        <span className="text-[10px] font-black tracking-normal">2.4K</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#ff4655] transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-[10px] font-black tracking-normal uppercase">SHARE</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 border-2 border-[#ff4655]/0 group-hover:border-[#ff4655]/30 rounded-none transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
            <Image
              src={selectedImage}
              alt="Preview"
              fill
              className="object-contain"
            />
            <button
              className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors flex items-center gap-2 font-black uppercase tracking-normal"
              onClick={() => setSelectedImage(null)}
            >
              <span>Close</span>
              <div className="w-10 h-10 rounded-none border border-white/20 flex items-center justify-center bg-black/40">
                ✕
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </section>
  )
}
