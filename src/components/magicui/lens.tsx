'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface LensProps {
  children: React.ReactNode
  className?: string
}

export const Lens: React.FC<LensProps> = ({ children, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm"
        />
      )}
    </motion.div>
  )
} 