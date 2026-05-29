"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '@/context/TransitionContext'

export function SceneTransition() {
  const { isTransitioning } = useTransition()

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
        >
          {/* Elegant Backdrop with Glass Effect */}
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: ["-100%", "0%", "100%"] }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-[#ff4655]/5 backdrop-blur-md border-y border-[#ff4655]/20"
          >
            {/* Subtle Scanning Light Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff4655]/10 to-transparent" />
            <motion.div 
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 0.8, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 shadow-[0_0_15px_#ff4655]"
            />
          </motion.div>

          {/* Minimalist Tech Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(#ff4655 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
