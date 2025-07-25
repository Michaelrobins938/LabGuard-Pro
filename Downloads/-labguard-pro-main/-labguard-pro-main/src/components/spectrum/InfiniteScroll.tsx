'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface InfiniteScrollProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  loadMore: () => Promise<void>
  hasMore: boolean
  loading: boolean
  threshold?: number
  className?: string
  itemClassName?: string
  loadingComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
  scrollDirection?: 'down' | 'up'
  autoLoad?: boolean
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  threshold = 100,
  className = '',
  itemClassName = '',
  loadingComponent,
  emptyComponent,
  scrollDirection = 'down',
  autoLoad = true
}: InfiniteScrollProps<T>) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Intersection observer for loading trigger
  useEffect(() => {
    if (!autoLoad || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [autoLoad, hasMore, loading, loadMore, threshold])

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollTop)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Manual load more function
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore()
    }
  }, [loading, hasMore, loadMore])

  // Scroll to top/bottom
  const scrollToEdge = (direction: 'top' | 'bottom') => {
    if (containerRef.current) {
      const container = containerRef.current
      const scrollTo = direction === 'top' ? 0 : container.scrollHeight
      
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  // Default loading component
  const defaultLoadingComponent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-8"
    >
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading more...</span>
    </motion.div>
  )

  // Default empty component
  const defaultEmptyComponent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <ChevronDown className="w-8 h-8" />
      </div>
      <p className="text-lg font-medium">No items found</p>
      <p className="text-sm">Start adding content to see it here</p>
    </motion.div>
  )

  return (
    <div className={`relative ${className}`}>
      {/* Scroll to top button */}
      {scrollPosition > 200 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => scrollToEdge('top')}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}

      {/* Main scroll container */}
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[600px] scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="space-y-4">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {emptyComponent || defaultEmptyComponent}
              </motion.div>
            ) : (
              items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  className={itemClassName}
                >
                  {renderItem(item, index)}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Loading trigger element */}
          {hasMore && (
            <div ref={loadingRef} className="py-4">
              {loading ? (
                loadingComponent || defaultLoadingComponent
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleLoadMore}
                  className="w-full py-4 text-center text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Load More
                </motion.button>
              )}
            </div>
          )}

          {/* End of content indicator */}
          {!hasMore && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ChevronDown className="w-4 h-4" />
              </div>
              <p className="text-sm">You've reached the end</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// Horizontal infinite scroll
interface HorizontalInfiniteScrollProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  loadMore: () => Promise<void>
  hasMore: boolean
  loading: boolean
  threshold?: number
  className?: string
  itemClassName?: string
  showScrollButtons?: boolean
}

export function HorizontalInfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  threshold = 100,
  className = '',
  itemClassName = '',
  showScrollButtons = true
}: HorizontalInfiniteScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      {
        rootMargin: `0px ${threshold}px 0px 0px`,
        threshold: 0.1
      }
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, loadMore, threshold])

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const container = containerRef.current
      const scrollAmount = container.clientWidth * 0.8
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Scroll buttons */}
      {showScrollButtons && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-4 min-w-max">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className={`flex-shrink-0 ${itemClassName}`}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}

          {/* Loading trigger */}
          {hasMore && (
            <div ref={loadingRef} className="flex-shrink-0 flex items-center justify-center w-32">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              ) : (
                <button
                  onClick={loadMore}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 