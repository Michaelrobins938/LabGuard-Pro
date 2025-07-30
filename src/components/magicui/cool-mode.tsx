'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface CoolModeProps {
  children: React.ReactNode
}

export const CoolMode: React.FC<CoolModeProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      className="relative"
    >
      {children}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
        />
      )}
    </motion.div>
  )
} 