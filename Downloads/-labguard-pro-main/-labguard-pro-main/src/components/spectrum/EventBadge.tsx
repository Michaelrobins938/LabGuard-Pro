'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  TrendingUp,
  Zap,
  Award,
  Gift,
  Fire
} from 'lucide-react'

interface EventBadgeProps {
  type: 'event' | 'live' | 'featured' | 'new' | 'hot' | 'limited' | 'exclusive' | 'beta'
  text: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const badgeVariants = {
  event: {
    colors: 'bg-blue-500 text-white',
    icon: Calendar,
    animation: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } }
  },
  live: {
    colors: 'bg-red-500 text-white',
    icon: Clock,
    animation: { 
      scale: [1, 1.1, 1], 
      boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)'],
      transition: { duration: 1.5, repeat: Infinity } 
    }
  },
  featured: {
    colors: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    icon: Star,
    animation: { rotate: [0, 5, -5, 0], transition: { duration: 2, repeat: Infinity } }
  },
  new: {
    colors: 'bg-green-500 text-white',
    icon: TrendingUp,
    animation: { opacity: [1, 0.7, 1], transition: { duration: 1.5, repeat: Infinity } }
  },
  hot: {
    colors: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    icon: Fire,
    animation: { 
      scale: [1, 1.05, 1], 
      rotate: [0, 2, -2, 0],
      transition: { duration: 1, repeat: Infinity } 
    }
  },
  limited: {
    colors: 'bg-yellow-500 text-white',
    icon: Clock,
    animation: { 
      scale: [1, 1.02, 1], 
      transition: { duration: 1, repeat: Infinity } 
    }
  },
  exclusive: {
    colors: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
    icon: Award,
    animation: { 
      boxShadow: ['0 0 0 0 rgba(99, 102, 241, 0.4)', '0 0 0 6px rgba(99, 102, 241, 0)', '0 0 0 0 rgba(99, 102, 241, 0)'],
      transition: { duration: 2, repeat: Infinity } 
    }
  },
  beta: {
    colors: 'bg-gray-500 text-white',
    icon: Zap,
    animation: { 
      opacity: [1, 0.8, 1], 
      scale: [1, 1.02, 1],
      transition: { duration: 1.5, repeat: Infinity } 
    }
  }
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export function EventBadge({
  type,
  text,
  size = 'md',
  animated = true,
  className = ''
}: EventBadgeProps) {
  const config = badgeVariants[type]
  const Icon = config.icon

  const BadgeContent = (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${config.colors} ${sizeClasses[size]} ${className}
    `}>
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <span>{text}</span>
    </div>
  )

  if (animated) {
    return (
      <motion.div
        animate={config.animation}
        className="inline-block"
      >
        {BadgeContent}
      </motion.div>
    )
  }

  return BadgeContent
}

// Event Badge with countdown
interface CountdownBadgeProps {
  endDate: Date
  text: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CountdownBadge({
  endDate,
  text,
  size = 'md',
  className = ''
}: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24

  return (
    <motion.div
      animate={isUrgent ? { 
        scale: [1, 1.05, 1], 
        boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 6px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)'],
        transition: { duration: 1.5, repeat: Infinity } 
      } : {}}
      className="inline-block"
    >
      <div className={`
        inline-flex items-center gap-2 rounded-full font-medium
        ${isUrgent ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}
        ${sizeClasses[size]} ${className}
      `}>
        <Clock className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <span>{text}</span>
        <span className="font-mono">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  )
}

// Event Badge with location
interface LocationBadgeProps {
  location: string
  attendees?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LocationBadge({
  location,
  attendees,
  size = 'md',
  className = ''
}: LocationBadgeProps) {
  return (
    <div className={`
      inline-flex items-center gap-2 rounded-full font-medium
      bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
      ${sizeClasses[size]} ${className}
    `}>
      <MapPin className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <span>{location}</span>
      {attendees && (
        <>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <Users className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
          <span>{attendees}</span>
        </>
      )}
    </div>
  )
}

// Event Badge with gift/offer
interface OfferBadgeProps {
  offer: string
  discount?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function OfferBadge({
  offer,
  discount,
  size = 'md',
  className = ''
}: OfferBadgeProps) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.02, 1], 
        transition: { duration: 1, repeat: Infinity } 
      }}
      className="inline-block"
    >
      <div className={`
        inline-flex items-center gap-2 rounded-full font-medium
        bg-gradient-to-r from-green-500 to-emerald-500 text-white
        ${sizeClasses[size]} ${className}
      `}>
        <Gift className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <span>{offer}</span>
        {discount && (
          <>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <span className="font-bold">{discount}</span>
          </>
        )}
      </div>
    </motion.div>
  )
} 