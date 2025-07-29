'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle, TrendingUp, DollarSign, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      title: 'Laboratory Director',
      company: 'Regional Medical Center',
      image: '/testimonials/sarah-chen.jpg',
      rating: 5,
      quote: 'LabGuard Pro transformed our compliance workflow. We went from 20 hours of manual paperwork per week to just 2 hours. The AI catches issues we would have missed, preventing a $25K equipment failure last month.',
      results: {
        timeSaved: '18 hours/week',
        costSaved: '$45K annually',
        complianceRate: '99.8%'
      },
      highlight: 'Prevented $25K equipment failure'
    },
    {
      name: 'Michael Rodriguez',
      title: 'Quality Manager',
      company: 'Diagnostics Plus Laboratory',
      image: '/testimonials/michael-rodriguez.jpg',
      rating: 5,
      quote: 'The CAP inspection that used to terrify us is now a breeze. LabGuard Pro had all our documentation ready instantly. The inspector was impressed with our compliance tracking.',
      results: {
        timeSaved: '40 hours/audit',
        complianceRate: '100%',
        auditResult: 'Zero citations'
      },
      highlight: 'Zero citations in CAP audit'
    },
    {
      name: 'Dr. Emily Johnson',
      title: 'Lab Operations Manager',
      company: 'University Medical Lab',
      image: '/testimonials/emily-johnson.jpg',
      rating: 5,
      quote: 'ROI was immediate. The platform paid for itself in the first month by preventing calibration failures. Our technicians love how easy it is to use.',
      results: {
        roi: '300% in first year',
        errorReduction: '95%',
        staffSatisfaction: '98%'
      },
      highlight: '300% ROI in first year'
    },
    {
      name: 'Dr. James Wilson',
      title: 'Laboratory Director',
      company: 'Metro Health System',
      image: '/testimonials/james-wilson.jpg',
      rating: 5,
      quote: 'Managing compliance across 12 lab locations was a nightmare. LabGuard Pro gives us centralized visibility and control. We can spot issues before they become problems.',
      results: {
        locationsManaged: '12 labs',
        costSaved: '$150K annually',
        complianceRate: '99.9%'
      },
      highlight: 'Centralized 12 lab locations'
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentTestimonial]

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            Customer Success
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Loved by <span className="text-blue-600">500+ Laboratory Professionals</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how LabGuard Pro is transforming compliance workflows and saving labs thousands of dollars.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full -ml-12 -mb-12"></div>
          
          <Quote className="absolute top-6 left-6 w-8 h-8 text-blue-200" />
          
          <div className="relative">
            {/* Rating */}
            <div className="flex items-center mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-sm text-gray-600">Perfect Score</span>
            </div>

            {/* Quote */}
            <blockquote className="text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed">
              "{current.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {current.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="ml-4">
                <div className="font-semibold text-gray-900">{current.name}</div>
                <div className="text-sm text-gray-600">{current.title} at {current.company}</div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(current.results).map(([key, value]) => (
                <div key={key} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{value}</div>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlight Badge */}
            <div className="mt-6">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                {current.highlight}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTestimonial}
            className="w-10 h-10 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {/* Dots */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextTestimonial}
            className="w-10 h-10 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Laboratories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">99.8%</div>
            <div className="text-sm text-gray-600">Average Compliance Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">$2.5M</div>
            <div className="text-sm text-gray-600">Total Cost Savings</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">15,000+</div>
            <div className="text-sm text-gray-600">Hours Saved Monthly</div>
          </div>
        </div>
      </div>
    </section>
  )
} 