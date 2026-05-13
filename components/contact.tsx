"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Mail, MessageSquare, Gamepad2, CheckCircle } from 'lucide-react'

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 175, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 175, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#00AFFF]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs tracking-widest text-[#00AFFF] border border-[#00AFFF]/30 mb-4">
              GET IN TOUCH
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              <span className="text-white">START YOUR</span>
              <br />
              <span className="neon-text">PROJECT</span>
            </h2>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              Ready to bring your vision to life? Contact us and let&apos;s create 
              something extraordinary together. Our team is ready to help.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass border border-[#00AFFF]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#00AFFF]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/50">Discord</div>
                  <div className="text-white font-medium">AV_GameStudio</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass border border-[#00AFFF]/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#00AFFF]" />
                </div>
                <div>
                  <div className="text-sm text-white/50">Email</div>
                  <div className="text-white font-medium">contact@avgamestudio.com</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass border border-[#00AFFF]/20 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-[#00AFFF]" />
                </div>
                <div>
                  <div className="text-sm text-white/50">Roblox</div>
                  <div className="text-white font-medium">@AVGameStudio</div>
                </div>
              </div>
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
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#00AFFF]/50" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#00AFFF]/50" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#00AFFF]/50" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#00AFFF]/50" />

              <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 border border-[#00AFFF]/20">
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00AFFF]/50" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#111827]/50 border border-[#1e293b] focus:border-[#00AFFF] text-white placeholder-white/30 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00AFFF]/50" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#111827]/50 border border-[#1e293b] focus:border-[#00AFFF] text-white placeholder-white/30 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Project Type</label>
                    <select
                      className="w-full px-4 py-4 rounded-xl bg-[#111827]/50 border border-[#1e293b] focus:border-[#00AFFF] text-white outline-none transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-[#111827]">Select project type</option>
                      <option value="map" className="bg-[#111827]">Map Development</option>
                      <option value="scripting" className="bg-[#111827]">Scripting</option>
                      <option value="ui" className="bg-[#111827]">UI/UX Design</option>
                      <option value="vfx" className="bg-[#111827]">VFX & Lighting</option>
                      <option value="full" className="bg-[#111827]">Full Package</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Project Details</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#00AFFF]/50" />
                      <textarea
                        placeholder="Describe your project..."
                        rows={4}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#111827]/50 border border-[#1e293b] focus:border-[#00AFFF] text-white placeholder-white/30 outline-none transition-colors resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitted}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00AFFF] to-[#00E5FF] text-[#030303] font-bold tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#00AFFF]/30 transition-all disabled:opacity-50"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        MESSAGE SENT!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        SEND MESSAGE
                      </>
                    )}
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
