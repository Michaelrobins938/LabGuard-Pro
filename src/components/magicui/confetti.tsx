'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  className?: string
}

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
}

export const Confetti: React.FC<ConfettiProps> = ({ className = '' }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    const newPieces: ConfettiPiece[] = []

    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    setPieces(newPieces)
  }, [])

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: piece.color,
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`
          }}
          animate={{
            y: [piece.y, window.innerHeight + 100],
            x: [piece.x, piece.x + (Math.random() - 0.5) * 200],
            rotation: [piece.rotation, piece.rotation + 360],
            opacity: [1, 0]
          }}
          transition={{
            duration: 3,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  )
} 