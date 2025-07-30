'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedCircularProgressBarProps {
  value: number
  max: number
  min: number
  gaugePrimaryColor?: string
  gaugeSecondaryColor?: string
  className?: string
}

export const AnimatedCircularProgressBar: React.FC<AnimatedCircularProgressBarProps> = ({
  value,
  max,
  min,
  gaugePrimaryColor = '#3b82f6',
  gaugeSecondaryColor = '#1e293b',
  className = ''
}) => {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const progress = ((value - min) / (max - min)) * 100
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`w-16 h-16 ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
        {/* Background circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke={gaugeSecondaryColor}
          strokeWidth="4"
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx="25"
          cy="25"
          r={radius}
          stroke={gaugePrimaryColor}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
} 