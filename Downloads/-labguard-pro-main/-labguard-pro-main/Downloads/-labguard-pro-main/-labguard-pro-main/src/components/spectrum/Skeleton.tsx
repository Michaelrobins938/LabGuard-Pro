'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: ''
  }

  const style = {
    width: width,
    height: height || (variant === 'text' ? '1em' : undefined)
  }

  return (
    <motion.div
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${animationClasses[animation]} 
        ${className}
      `}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
  )
}

// Card Skeleton
interface CardSkeletonProps {
  className?: string
  showImage?: boolean
  showTitle?: boolean
  showDescription?: boolean
  showActions?: boolean
}

export function CardSkeleton({
  className = '',
  showImage = true,
  showTitle = true,
  showDescription = true,
  showActions = true
}: CardSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {showImage && (
        <Skeleton 
          variant="rectangular" 
          height="200px" 
          className="w-full"
        />
      )}
      
      <div className="p-4 space-y-3">
        {showTitle && (
          <Skeleton 
            variant="text" 
            width="60%" 
            height="24px"
          />
        )}
        
        {showDescription && (
          <div className="space-y-2">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="90%" />
          </div>
        )}
        
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Skeleton variant="rounded" width="80px" height="32px" />
            <Skeleton variant="rounded" width="60px" height="32px" />
          </div>
        )}
      </div>
    </div>
  )
}

// Table Skeleton
interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
  showHeader?: boolean
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = '',
  showHeader = true
}: TableSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {showHeader && (
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="px-4 py-3 text-left">
                    <Skeleton variant="text" width="80%" height="16px" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <Skeleton 
                      variant="text" 
                      width={colIndex === 0 ? "60%" : "80%"} 
                      height="16px" 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// List Skeleton
interface ListSkeletonProps {
  items?: number
  className?: string
  showAvatar?: boolean
  showSubtitle?: boolean
}

export function ListSkeleton({
  items = 5,
  className = '',
  showAvatar = true,
  showSubtitle = true
}: ListSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="p-4 flex items-center gap-3">
            {showAvatar && (
              <Skeleton variant="circular" width="40px" height="40px" />
            )}
            
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height="16px" />
              {showSubtitle && (
                <Skeleton variant="text" width="40%" height="14px" />
              )}
            </div>
            
            <Skeleton variant="rounded" width="60px" height="24px" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Form Skeleton
interface FormSkeletonProps {
  fields?: number
  className?: string
  showTitle?: boolean
  showDescription?: boolean
}

export function FormSkeleton({
  fields = 4,
  className = '',
  showTitle = true,
  showDescription = true
}: FormSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {showTitle && (
        <div className="mb-6">
          <Skeleton variant="text" width="40%" height="24px" className="mb-2" />
          {showDescription && (
            <Skeleton variant="text" width="80%" height="16px" />
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton variant="text" width="30%" height="16px" />
            <Skeleton variant="rounded" width="100%" height="40px" />
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 pt-6">
        <Skeleton variant="rounded" width="100px" height="40px" />
        <Skeleton variant="rounded" width="80px" height="40px" />
      </div>
    </div>
  )
}

// Dashboard Skeleton
interface DashboardSkeletonProps {
  className?: string
  showStats?: boolean
  showChart?: boolean
  showTable?: boolean
}

export function DashboardSkeleton({
  className = '',
  showStats = true,
  showChart = true,
  showTable = true
}: DashboardSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton variant="circular" width="40px" height="40px" />
                <Skeleton variant="text" width="60px" height="16px" />
              </div>
              <Skeleton variant="text" width="40%" height="24px" className="mb-2" />
              <Skeleton variant="text" width="60%" height="16px" />
            </div>
          ))}
        </div>
      )}
      
      {/* Chart */}
      {showChart && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <Skeleton variant="text" width="30%" height="24px" className="mb-4" />
          <Skeleton variant="rounded" width="100%" height="300px" />
        </div>
      )}
      
      {/* Table */}
      {showTable && (
        <TableSkeleton rows={5} columns={4} />
      )}
    </div>
  )
}

// Profile Skeleton
interface ProfileSkeletonProps {
  className?: string
  showAvatar?: boolean
  showBio?: boolean
  showStats?: boolean
}

export function ProfileSkeleton({
  className = '',
  showAvatar = true,
  showBio = true,
  showStats = true
}: ProfileSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {showAvatar && (
          <div className="flex-shrink-0">
            <Skeleton variant="circular" width="120px" height="120px" />
          </div>
        )}
        
        <div className="flex-1 space-y-4">
          <div>
            <Skeleton variant="text" width="40%" height="28px" className="mb-2" />
            <Skeleton variant="text" width="60%" height="16px" />
          </div>
          
          {showBio && (
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="80%" />
            </div>
          )}
          
          {showStats && (
            <div className="flex gap-6 pt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center">
                  <Skeleton variant="text" width="40px" height="24px" className="mb-1" />
                  <Skeleton variant="text" width="60px" height="14px" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Navigation Skeleton
interface NavigationSkeletonProps {
  className?: string
  items?: number
}

export function NavigationSkeleton({
  className = '',
  items = 6
}: NavigationSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4">
        <Skeleton variant="text" width="40%" height="20px" className="mb-4" />
        <div className="space-y-2">
          {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-2">
              <Skeleton variant="circular" width="20px" height="20px" />
              <Skeleton variant="text" width="60%" height="16px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 