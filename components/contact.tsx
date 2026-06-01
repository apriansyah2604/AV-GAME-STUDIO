"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Mail, MessageSquare, Gamepad2, CheckCircle, Instagram, Music2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { ADMIN_WHATSAPP } from '@/lib/utils'

export function Contact() {
  const { t, language } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    details: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const message = language === 'id' 
      ? `Halo AV GAME STUDIO!
    
Saya ingin memesan jasa/berkonsultasi:
Nama: ${formData.name}
Email: ${formData.email}
Tipe Proyek: ${formData.projectType}
Detail Proyek: ${formData.details}

Terima kasih!`
      : `Hello AV GAME STUDIO!
    
I would like to order a service/consult:
Name: ${formData.name}
Email: ${formData.email}
Project Type: ${formData.projectType}
Project Details: ${formData.details}

Thank you!`

    const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`
    
    window.open(waUrl, '_blank')
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section id="contact" className="relative py-20 lg:py-32 overflow-hidden">
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
      
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#ff4655]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 rounded-none border border-[#ff4655]/30 text-xs tracking-normal text-[#ff4655] font-black uppercase italic mb-4">
              {t('contact.badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 px-2 uppercase tracking-tight">
              <span className="text-white">{t('contact.title1')}</span>
              <br />
              <span className="neon-text">{t('contact.title2')}</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed font-medium">
              {t('contact.subtitle')}
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href={`https://wa.me/${ADMIN_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-none glass border border-[#ff4655]/20 flex items-center justify-center skew-x-[-12deg]">
                  <svg className="w-5 h-5 text-[#ff4655] -skew-x-[-12deg]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-normal italic">WhatsApp</div>
                  <div className="text-white font-black uppercase text-xs tracking-normal">+62 895-3270-25015</div>
                </div>
              </a>

              <a 
                href="https://discord.gg/vNjDDVf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-none glass border border-[#ff4655]/20 flex items-center justify-center skew-x-[-12deg]">
                  <svg className="w-5 h-5 text-[#ff4655] -skew-x-[-12deg]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-normal italic">Discord</div>
                  <div className="text-white font-black uppercase text-xs tracking-normal">AV GAME STUDIO</div>
                </div>
              </a>

              <a 
                href="mailto:apriansyahvirus@gmail.com"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-none glass border border-[#ff4655]/20 flex items-center justify-center skew-x-[-12deg]">
                  <Mail className="w-5 h-5 text-[#ff4655] -skew-x-[-12deg]" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-normal italic">Email</div>
                  <div className="text-white font-black uppercase text-xs tracking-normal">apriansyahvirus@gmail.com</div>
                </div>
              </a>

              <a 
                href="https://www.roblox.com/id/users/6200304820/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-none glass border border-[#ff4655]/20 flex items-center justify-center skew-x-[-12deg]">
                  <Gamepad2 className="w-5 h-5 text-[#ff4655] -skew-x-[-12deg]" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-normal italic">Roblox</div>
                  <div className="text-white font-black uppercase text-xs tracking-normal">@AVGameStudio</div>
                </div>
              </a>

              <a 
                href="https://www.instagram.com/avgamestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-none glass border border-[#ff4655]/20 flex items-center justify-center skew-x-[-12deg]">
                  <Instagram className="w-5 h-5 text-[#ff4655] -skew-x-[-12deg]" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-normal italic">Instagram</div>
                  <div className="text-white font-black uppercase text-xs tracking-normal">@avgamestudio</div>
                </div>
              </a>

              <a 
                href="https://www.tiktok.com/@avgamestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
              >
                <div className="w-12 h-12 rounded-none glass border border-[#ff4655]/20 flex items-center justify-center skew-x-[-12deg]">
                  <Music2 className="w-5 h-5 text-[#ff4655] -skew-x-[-12deg]" />
                </div>
                <div>
                  <div className="text-[10px] text-white/40 font-black uppercase tracking-normal italic">TikTok</div>
                  <div className="text-white font-black uppercase text-xs tracking-normal">@avgamestudio</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Content - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* HUD Frame */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#ff4655]/50" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#ff4655]/50" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#ff4655]/50" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#ff4655]/50" />

              <form onSubmit={handleSubmit} className="glass-strong rounded-none p-8 border border-white/10">
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase italic tracking-normal">{t('contact.form.name')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff4655]/50" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('contact.form.name_placeholder')}
                        className="w-full pl-12 pr-4 py-4 rounded-none bg-[#111827]/50 border border-white/5 focus:border-[#ff4655] text-white placeholder-white/20 outline-none transition-colors font-bold text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase italic tracking-normal">{t('contact.form.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff4655]/50" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('contact.form.email_placeholder')}
                        className="w-full pl-12 pr-4 py-4 rounded-none bg-[#111827]/50 border border-white/5 focus:border-[#ff4655] text-white placeholder-white/20 outline-none transition-colors font-bold text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase italic tracking-normal">{t('contact.form.project_type')}</label>
                    <div className="relative">
                      <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff4655]/50" />
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-4 rounded-none bg-[#111827]/50 border border-white/5 focus:border-[#ff4655] text-white outline-none transition-colors appearance-none cursor-pointer font-bold text-xs"
                        required
                      >
                        <option value="" disabled className="bg-[#030303]">{t('contact.form.project_placeholder')}</option>
                        {t('contact.types').map((type: string) => (
                          <option key={type} value={type} className="bg-[#030303]">{type}</option>
                        ))}
                      </select>
                      <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff4655]/50 pointer-events-none" />
                    </div>
                  </div>

                  {/* Details Field */}
                  <div>
                    <label className="block text-[10px] font-black text-white/40 mb-2 uppercase italic tracking-normal">{t('contact.form.details')}</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#ff4655]/50" />
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder={t('contact.form.details_placeholder')}
                        rows={4}
                        className="w-full pl-12 pr-4 py-4 rounded-none bg-[#111827]/50 border border-white/5 focus:border-[#ff4655] text-white placeholder-white/20 outline-none transition-colors resize-none font-medium text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-none font-black tracking-normal flex items-center justify-center gap-2 transition-all uppercase skew-x-[-12deg] ${
                      isSubmitted 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-[#ff4655] text-white'
                    }`}
                  >
                    <span className="skew-x-[12deg] flex items-center gap-2">
                      {isSubmitted ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          {t('contact.form.success')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t('contact.form.submit')}
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
