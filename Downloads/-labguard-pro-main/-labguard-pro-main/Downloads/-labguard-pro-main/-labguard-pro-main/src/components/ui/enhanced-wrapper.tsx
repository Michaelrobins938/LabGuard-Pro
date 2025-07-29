import { ReactNode } from 'react'

interface EnhancedWrapperProps {
  children: ReactNode
  className?: string
  section?: boolean
}

export function EnhancedWrapper({ children, className = '', section = false }: EnhancedWrapperProps) {
  const baseClass = section ? 'enhanced-section' : ''
  
  return (
    <div className={`${baseClass} ${className} fade-in-up`}>
      {children}
    </div>
  )
} 