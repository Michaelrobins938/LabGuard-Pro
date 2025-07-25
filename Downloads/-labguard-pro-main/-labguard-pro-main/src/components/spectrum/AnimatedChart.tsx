'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DataPoint {
  x: number
  y: number
  label?: string
  color?: string
}

interface AnimatedChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  type?: 'line' | 'area' | 'bar'
  animate?: boolean
  showGrid?: boolean
  showPoints?: boolean
  gradient?: boolean
  className?: string
}

export function AnimatedChart({
  data,
  width = 400,
  height = 200,
  type = 'line',
  animate = true,
  showGrid = true,
  showPoints = true,
  gradient = true,
  className = ''
}: AnimatedChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  // Calculate chart dimensions and scales
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const maxX = Math.max(...data.map(d => d.x))
  const minX = Math.min(...data.map(d => d.x))
  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))

  const scaleX = (value: number) => 
    ((value - minX) / (maxX - minX)) * chartWidth + padding

  const scaleY = (value: number) => 
    height - padding - ((value - minY) / (maxY - minY)) * chartHeight

  // Generate path for line/area
  const generatePath = () => {
    if (data.length < 2) return ''
    
    const points = data.map(d => `${scaleX(d.x)},${scaleY(d.y)}`)
    return `M ${points.join(' L ')}`
  }

  // Generate area path
  const generateAreaPath = () => {
    if (data.length < 2) return ''
    
    const points = data.map(d => `${scaleX(d.x)},${scaleY(d.y)}`)
    const areaPoints = [
      ...points,
      `${scaleX(data[data.length - 1].x)},${height - padding}`,
      `${scaleX(data[0].x)},${height - padding}`
    ]
    return `M ${areaPoints.join(' L ')} Z`
  }

  // Grid lines
  const gridLines = showGrid ? (
    <>
      {/* Vertical grid lines */}
      {Array.from({ length: 5 }, (_, i) => {
        const x = padding + (chartWidth / 4) * i
        return (
          <line
            key={`v-${i}`}
            x1={x}
            y1={padding}
            x2={x}
            y2={height - padding}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        )
      })}
      {/* Horizontal grid lines */}
      {Array.from({ length: 5 }, (_, i) => {
        const y = padding + (chartHeight / 4) * i
        return (
          <line
            key={`h-${i}`}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        )
      })}
    </>
  ) : null

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        className="w-full h-auto"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          {gradient && (
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0.05} />
            </linearGradient>
          )}
        </defs>

        {/* Grid */}
        {gridLines}

        {/* Chart area */}
        <g>
          {/* Area fill */}
          {type === 'area' && (
            <motion.path
              d={generateAreaPath()}
              fill="url(#chartGradient)"
              initial={animate ? { pathLength: 0 } : {}}
              animate={animate ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}

          {/* Line or area stroke */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0 } : {}}
            animate={animate ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data points */}
          {showPoints && data.map((point, index) => (
            <motion.circle
              key={index}
              cx={scaleX(point.x)}
              cy={scaleY(point.y)}
              r={hoveredPoint === index ? 6 : 4}
              fill={point.color || "currentColor"}
              stroke="white"
              strokeWidth={2}
              initial={animate ? { scale: 0, opacity: 0 } : {}}
              animate={animate ? { scale: 1, opacity: 1 } : {}}
              transition={{ 
                duration: 0.3, 
                delay: animate ? index * 0.1 : 0,
                ease: "easeOut"
              }}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer transition-all duration-200"
            />
          ))}
        </g>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <rect
              x={scaleX(data[hoveredPoint].x) - 30}
              y={scaleY(data[hoveredPoint].y) - 40}
              width={60}
              height={30}
              fill="rgba(0, 0, 0, 0.8)"
              rx={4}
            />
            <text
              x={scaleX(data[hoveredPoint].x)}
              y={scaleY(data[hoveredPoint].y) - 20}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="500"
            >
              {data[hoveredPoint].label || `${data[hoveredPoint].y}`}
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  )
}

// Bar Chart variant
interface BarChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  animate?: boolean
  showGrid?: boolean
  className?: string
}

export function AnimatedBarChart({
  data,
  width = 400,
  height = 200,
  animate = true,
  showGrid = true,
  className = ''
}: BarChartProps) {
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  const barWidth = chartWidth / data.length * 0.8
  const barSpacing = chartWidth / data.length * 0.2

  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))

  const scaleY = (value: number) => 
    ((value - minY) / (maxY - minY)) * chartHeight

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        className="w-full h-auto"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Grid lines */}
        {showGrid && Array.from({ length: 5 }, (_, i) => {
          const y = padding + (chartHeight / 4) * i
          return (
            <line
              key={`h-${i}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          )
        })}

        {/* Bars */}
        {data.map((point, index) => {
          const barHeight = scaleY(point.y)
          const x = padding + (chartWidth / data.length) * index + barSpacing / 2
          const y = height - padding - barHeight

          return (
            <motion.rect
              key={index}
              x={x}
              y={height - padding}
              width={barWidth}
              height={0}
              fill={point.color || "currentColor"}
              initial={animate ? { height: 0 } : {}}
              animate={animate ? { height: barHeight } : {}}
              transition={{ 
                duration: 0.8, 
                delay: animate ? index * 0.1 : 0,
                ease: "easeOut"
              }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          )
        })}
      </svg>
    </div>
  )
} 