'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  variant?: 'default' | 'with-actions' | 'with-breadcrumb' | 'simple'
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  children,
  className,
  variant = 'default',
  breadcrumbs,
  actions
}: PageHeaderProps) {
  if (variant === 'simple') {
    return (
      <div className={cn("space-y-2", className)}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'with-breadcrumb') {
    return (
      <div className={cn("space-y-4", className)}>
        {breadcrumbs && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
        {children}
      </div>
    )
  }

  if (variant === 'with-actions') {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
        {children}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

// Breadcrumb components
export function Breadcrumb({ children }: { children: ReactNode }) {
  return <nav className="flex" aria-label="Breadcrumb">{children}</nav>
}

export function BreadcrumbList({ children }: { children: ReactNode }) {
  return <ol className="flex items-center space-x-2">{children}</ol>
}

export function BreadcrumbItem({ children }: { children: ReactNode }) {
  return <li>{children}</li>
}

export function BreadcrumbLink({ 
  children, 
  href,
  className 
}: { 
  children: ReactNode
  href: string
  className?: string 
}) {
  return (
    <a 
      href={href}
      className={cn(
        "text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors",
        className
      )}
    >
      {children}
    </a>
  )
}

export function BreadcrumbPage({ 
  children,
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <span className={cn(
      "text-sm font-medium text-gray-900 dark:text-white",
      className
    )}>
      {children}
    </span>
  )
}

export function BreadcrumbSeparator() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    </svg>
  )
} 