'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Alert, AlertContainer } from './Alert'
import { AnimatedChart, AnimatedBarChart } from './AnimatedChart'
import { AnimatedTestimonials, TestimonialGrid } from './AnimatedTestimonials'
import { EventBadge, CountdownBadge, LocationBadge, OfferBadge } from './EventBadge'
import { InfiniteScroll } from './InfiniteScroll'
import { MultiStepForm, TextInputStep, SelectStep, ConfirmationStep } from './MultiStepForm'
import { Skeleton, CardSkeleton, TableSkeleton, DashboardSkeleton } from './Skeleton'

// Sample data for charts
const chartData = [
  { x: 1, y: 65, label: 'Jan', color: '#3B82F6' },
  { x: 2, y: 78, label: 'Feb', color: '#8B5CF6' },
  { x: 3, y: 90, label: 'Mar', color: '#10B981' },
  { x: 4, y: 85, label: 'Apr', color: '#F59E0B' },
  { x: 5, y: 95, label: 'May', color: '#EF4444' },
  { x: 6, y: 88, label: 'Jun', color: '#06B6D4' }
]

// Sample testimonials
const testimonials = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Lab Director',
    company: 'Stanford Research Lab',
    content: 'LabGuard Pro has revolutionized our laboratory operations. The AI assistant helps us maintain 100% compliance while reducing manual work by 80%.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    role: 'Research Scientist',
    company: 'MIT Biotechnology Lab',
    content: 'The automated compliance monitoring has saved us countless hours. The platform is intuitive and the support team is incredibly responsive.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    role: 'Clinical Lab Manager',
    company: 'Mayo Clinic',
    content: 'We\'ve seen a 60% reduction in compliance violations since implementing LabGuard Pro. The real-time alerts are game-changing.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
]

// Sample data for infinite scroll
const sampleItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Laboratory Equipment ${i + 1}`,
  description: `Advanced laboratory equipment for research and clinical applications.`,
  status: i % 3 === 0 ? 'Calibrated' : i % 3 === 1 ? 'Pending' : 'Overdue'
}))

export function SpectrumUIDemo() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'success', message: 'Equipment calibration completed successfully', dismissible: true },
    { id: 2, type: 'warning', message: 'QC test due in 24 hours', dismissible: true },
    { id: 3, type: 'info', message: 'New AI assistant features available', dismissible: true }
  ])

  const [items, setItems] = useState(sampleItems.slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newItems = sampleItems.slice(items.length, items.length + 5)
    setItems(prev => [...prev, ...newItems])
    
    if (items.length + newItems.length >= sampleItems.length) {
      setHasMore(false)
    }
    setLoading(false)
  }

  const handleAlertDismiss = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Form submitted successfully!')
  }

  const formSteps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself and your laboratory',
      component: TextInputStep,
      validation: (data: any) => {
        const errors: Record<string, string> = {}
        if (!data.fullName) errors.fullName = 'Full name is required'
        if (!data.email) errors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid'
        return errors
      }
    },
    {
      id: 'laboratory',
      title: 'Laboratory Details',
      description: 'Information about your laboratory setup',
      component: SelectStep,
      validation: (data: any) => {
        const errors: Record<string, string> = {}
        if (!data.labType) errors.labType = 'Laboratory type is required'
        if (!data.teamSize) errors.teamSize = 'Team size is required'
        return errors
      }
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Review your information before submitting',
      component: ConfirmationStep
    }
  ]

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Spectrum UI Components
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive collection of animated, interactive UI components designed for modern laboratory management applications.
          </p>
        </motion.div>

        {/* Alerts Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Alert Components</h2>
          <AlertContainer>
            {alerts.map(alert => (
              <Alert
                key={alert.id}
                variant={alert.type as any}
                message={alert.message}
                dismissible={alert.dismissible}
                onDismiss={() => handleAlertDismiss(alert.id)}
                autoDismiss={alert.type === 'info'}
                autoDismissDelay={5000}
              />
            ))}
          </AlertContainer>
        </motion.section>

        {/* Event Badges Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Event Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EventBadge type="new" text="New Feature" />
            <EventBadge type="hot" text="Trending" />
            <EventBadge type="featured" text="Featured" />
            <EventBadge type="beta" text="Beta Release" />
            <CountdownBadge 
              endDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} 
              text="Limited Time" 
            />
            <LocationBadge location="San Francisco" attendees={150} />
            <OfferBadge offer="Special Discount" discount="20% OFF" />
            <EventBadge type="live" text="Live Demo" />
          </div>
        </motion.section>

        {/* Animated Charts Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Animated Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Line Chart</h3>
              <AnimatedChart 
                data={chartData} 
                width={400} 
                height={200} 
                type="line"
                className="text-blue-400"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Area Chart</h3>
              <AnimatedChart 
                data={chartData} 
                width={400} 
                height={200} 
                type="area"
                className="text-purple-400"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Bar Chart</h3>
              <AnimatedBarChart 
                data={chartData} 
                width={400} 
                height={200}
                className="text-green-400"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Interactive Chart</h3>
              <AnimatedChart 
                data={chartData} 
                width={400} 
                height={200} 
                type="line"
                showPoints={true}
                className="text-orange-400"
              />
            </div>
          </div>
        </motion.section>

        {/* Animated Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Animated Testimonials</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <AnimatedTestimonials 
              testimonials={testimonials}
              autoPlay={true}
              interval={4000}
              showNavigation={true}
              showDots={true}
            />
          </div>
        </motion.section>

        {/* Multi-Step Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Multi-Step Form</h2>
          <MultiStepForm
            steps={formSteps}
            onSubmit={handleFormSubmit}
            showProgress={true}
            showStepNumbers={true}
            submitButtonText="Create Account"
            loadingText="Creating Account..."
          />
        </motion.section>

        {/* Infinite Scroll Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Infinite Scroll</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <InfiniteScroll
              items={items}
              renderItem={(item) => (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                    item.status === 'Calibrated' ? 'bg-green-500/20 text-green-300' :
                    item.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
              )}
              loadMore={loadMore}
              hasMore={hasMore}
              loading={loading}
              threshold={100}
              className="max-h-96"
            />
          </div>
        </motion.section>

        {/* Skeleton Loading Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Skeleton Loading</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Card Skeleton</h3>
              <CardSkeleton />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Table Skeleton</h3>
              <TableSkeleton rows={3} columns={3} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Dashboard Skeleton</h3>
              <DashboardSkeleton showStats={true} showChart={true} showTable={false} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Form Skeleton</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <FormSkeleton fields={3} />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Testimonial Grid Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Testimonial Grid</h2>
          <TestimonialGrid testimonials={testimonials} columns={3} />
        </motion.section>
      </div>
    </div>
  )
} 