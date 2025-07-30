'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ShineBorderProps {
  children: React.ReactNode
  className?: string
  duration?: number
}

export const ShineBorder: React.FC<ShineBorderProps> = ({
  children,
  className = '',
  duration = 2
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      {children}
    </div>
  )
} 