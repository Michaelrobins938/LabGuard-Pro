'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface GlobeProps {
  className?: string
}

export const Globe: React.FC<GlobeProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    const dots: Array<{
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      opacity: number
    }> = []

    // Initialize dots on sphere
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      dots.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1
      })
    }

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Rotate sphere
      const rotationX = Math.sin(time * 0.001) * 0.3
      const rotationY = Math.cos(time * 0.001) * 0.3

      dots.forEach((dot, index) => {
        // Apply rotation
        const cosX = Math.cos(rotationX)
        const sinX = Math.sin(rotationX)
        const cosY = Math.cos(rotationY)
        const sinY = Math.sin(rotationY)

        const x1 = dot.x
        const y1 = dot.y * cosX - dot.z * sinX
        const z1 = dot.y * sinX + dot.z * cosX

        const x2 = x1 * cosY - z1 * sinY
        const y2 = y1
        const z2 = x1 * sinY + z1 * cosY

        // Project to 2D
        const scale = 1000 / (1000 + z2)
        const x = centerX + x2 * scale
        const y = centerY + y2 * scale

        // Draw dot
        if (z2 > -radius * 0.5) {
          ctx.beginPath()
          ctx.arc(x, y, 2 * scale, 0, Math.PI * 2)
          ctx.fillStyle = '#3b82f6'
          ctx.globalAlpha = dot.opacity * scale
          ctx.fill()

          // Connect nearby dots
          dots.forEach((otherDot, otherIndex) => {
            if (index === otherIndex) return
            
            const otherCosX = Math.cos(rotationX)
            const otherSinX = Math.sin(rotationX)
            const otherCosY = Math.cos(rotationY)
            const otherSinY = Math.sin(rotationY)

            const otherX1 = otherDot.x
            const otherY1 = otherDot.y * otherCosX - otherDot.z * otherSinX
            const otherZ1 = otherDot.y * otherSinX + otherDot.z * otherCosX

            const otherX2 = otherX1 * otherCosY - otherZ1 * otherSinY
            const otherY2 = otherY1
            const otherZ2 = otherX1 * otherSinY + otherZ1 * otherCosY

            const otherScale = 1000 / (1000 + otherZ2)
            const otherX = centerX + otherX2 * otherScale
            const otherY = centerY + otherY2 * otherScale

            const distance = Math.sqrt(
              Math.pow(x - otherX, 2) + Math.pow(y - otherY, 2)
            )

            if (distance < 50 && z2 > -radius * 0.5 && otherZ2 > -radius * 0.5) {
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(otherX, otherY)
              ctx.strokeStyle = '#3b82f6'
              ctx.globalAlpha = (50 - distance) / 50 * 0.1 * scale * otherScale
              ctx.stroke()
            }
          })
        }
      })

      time += 16
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className={`relative w-full h-96 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <div className="text-2xl font-bold text-white mb-2">Global Laboratory Network</div>
          <div className="text-sm text-gray-400">500+ Laboratories Worldwide</div>
        </motion.div>
      </div>
    </div>
  )
} 