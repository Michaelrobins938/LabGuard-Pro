'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  X, 
  AlertTriangle,
  XCircle
} from 'lucide-react'

interface AlertProps {
  title?: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  dismissible?: boolean
  autoDismiss?: boolean
  autoDismissDelay?: number
  onDismiss?: () => void
  className?: string
}

const alertVariants = {
  info: {
    icon: Info,
    colors: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      iconColor: 'text-blue-500'
    }
  },
  success: {
    icon: CheckCircle,
    colors: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      iconColor: 'text-green-500'
    }
  },
  warning: {
    icon: AlertTriangle,
    colors: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      iconColor: 'text-yellow-500'
    }
  },
  error: {
    icon: XCircle,
    colors: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-500'
    }
  }
}

export function Alert({
  title,
  message,
  variant = 'info',
  dismissible = false,
  autoDismiss = false,
  autoDismissDelay = 5000,
  onDismiss,
  className = ''
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const config = alertVariants[variant]
  const Icon = config.icon

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, autoDismissDelay)

      return () => clearTimeout(timer)
    }
  }, [autoDismiss, autoDismissDelay, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`
            relative p-4 rounded-lg border ${config.colors.bg} ${config.colors.border} 
            ${config.colors.text} ${className}
          `}
        >
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.colors.iconColor}`} />
            
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="font-semibold mb-1">{title}</h4>
              )}
              <p className="text-sm leading-relaxed">{message}</p>
            </div>

            {dismissible && (
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress bar for auto-dismiss */}
          {autoDismiss && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: autoDismissDelay / 1000, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-lg"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Alert Container for multiple alerts
interface AlertContainerProps {
  children: React.ReactNode
  className?: string
}

export function AlertContainer({ children, className = '' }: AlertContainerProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  )
} 