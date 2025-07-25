'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'positive' | 'negative' | 'neutral'
    period: string
  }
  icon?: ReactNode
  description?: string
  className?: string
  variant?: 'default' | 'with-chart' | 'with-icon' | 'simple'
}

export function Metric({
  title,
  value,
  change,
  icon,
  description,
  className,
  variant = 'default'
}: MetricProps) {
  const getChangeIcon = () => {
    if (!change) return null
    switch (change.type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getChangeColor = () => {
    if (!change) return ''
    switch (change.type) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400'
      case 'negative':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (variant === 'simple') {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {change && (
          <div className="flex items-center space-x-1">
            {getChangeIcon()}
            <span className={cn("text-sm font-medium", getChangeColor())}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              vs {change.period}
            </span>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'with-icon') {
    return (
      <div className={cn("glass-card p-6", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          </div>
          {change && (
            <div className="flex items-center space-x-1">
              {getChangeIcon()}
              <span className={cn("text-sm font-medium", getChangeColor())}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'with-chart') {
    return (
      <div className={cn("glass-card p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          </div>
          {change && (
            <div className="flex items-center space-x-1">
              {getChangeIcon()}
              <span className={cn("text-sm font-medium", getChangeColor())}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        
        {/* Mini Chart */}
        <div className="flex items-end space-x-1 h-12">
          {[65, 70, 75, 80, 85, 90, 95, 98].map((height, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-teal-500 to-cyan-500 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        
        {description && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        {change && (
          <div className="flex items-center space-x-1">
            {getChangeIcon()}
            <span className={cn("text-sm font-medium", getChangeColor())}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              vs {change.period}
            </span>
          </div>
        )}
      </div>
      
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </p>
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  )
}

interface MetricsGridProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
}

export function MetricsGrid({ children, className, cols = 4 }: MetricsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn("grid gap-6", gridCols[cols], className)}>
      {children}
    </div>
  )
} 