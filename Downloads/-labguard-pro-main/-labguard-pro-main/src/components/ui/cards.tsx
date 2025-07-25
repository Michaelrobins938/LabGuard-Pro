'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  onClick?: () => void
}

export function Card({ children, className, variant = 'default', onClick }: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card backdrop-blur-sm bg-white/10 border-white/20'
      case 'gradient':
        return 'bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20'
      case 'elevated':
        return 'bg-white dark:bg-gray-900 shadow-xl border-0'
      default:
        return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
    }
  }

  return (
    <div 
      className={cn(
        "rounded-xl p-6 transition-all duration-300 hover:shadow-lg",
        getVariantStyles(),
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white",
      className
    )}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn(
      "text-sm text-gray-600 dark:text-gray-400",
      className
    )}>
      {children}
    </p>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("pt-0", className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("flex items-center pt-4", className)}>
      {children}
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'positive' | 'negative' | 'neutral'
  }
  icon?: ReactNode
  description?: string
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  description, 
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("group hover:scale-105 transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {change && (
            <div className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              change.type === 'positive' 
                ? "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20" 
                : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
            )}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

// Feature Card Component
interface FeatureCardProps {
  title: string
  description: string
  icon?: ReactNode
  className?: string
  onClick?: () => void
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  className,
  onClick 
}: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-xl transition-all duration-300 group",
        onClick && "hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

// Stats Card Component
interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    type: 'up' | 'down' | 'neutral'
  }
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5" />
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </div>
            {trend && (
              <div className={cn(
                "flex items-center space-x-1 text-sm font-medium",
                trend.type === 'up' 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : trend.type === 'down'
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400"
              )}>
                <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <CardDescription className="mt-2">
              {subtitle}
            </CardDescription>
          )}
        </CardContent>
      </div>
    </Card>
  )
} 