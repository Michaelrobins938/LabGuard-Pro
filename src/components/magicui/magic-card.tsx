'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface MagicCardProps {
  children: React.ReactNode
  className?: string
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = ''
}) => {
  return (
    <motion.div
      className={`relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl ${className}`}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 via-purple-500/2 to-cyan-500/2 rounded-2xl animate-pulse" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
} 