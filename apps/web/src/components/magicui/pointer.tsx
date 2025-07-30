'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PointerProps {
  className?: string
}

export const Pointer: React.FC<PointerProps> = ({ className = '' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <motion.div
      className={`fixed pointer-events-none z-50 ${className}`}
      style={{
        left: position.x - 4,
        top: position.y - 4
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.1 }}
    >
      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
    </motion.div>
  )
}
