'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  reverse?: boolean
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  className = '',
  duration = 20,
  reverse = false
}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: reverse ? [0, -50] : [-50, 0]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'linear'
          }
        }}
      >
        <div className="flex items-center">
          {children}
        </div>
        <div className="flex items-center">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
