'use client'

import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="enhanced-section" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="enhanced-gradient-text mb-4">
            Choose your plan
          </h2>
          <p className="text-xl text-gray-300">
            Flexible pricing for laboratories of all sizes
          </p>
        </div>
        
        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <div className="enhanced-pricing-card">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-4xl font-bold text-white mb-2">
                $299<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-300">Perfect for small laboratories</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Up to 10 equipment items</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">100 AI compliance checks/month</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Basic reporting</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Email support</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">2 team members</span>
              </li>
            </ul>
            
            <Link href="/auth/register?plan=starter" className="enhanced-button-secondary w-full block text-center">
              Get Started
            </Link>
          </div>
          
          {/* Professional Plan (Most Popular) */}
          <div className="enhanced-pricing-card popular">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="text-4xl font-bold text-white mb-2">
                $599<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-300">Ideal for growing laboratories</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Up to 50 equipment items</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">500 AI compliance checks/month</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Advanced analytics</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Priority support</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">10 team members</span>
              </li>
            </ul>
            
            <Link href="/auth/register?plan=professional" className="enhanced-button-primary w-full block text-center">
              Get Started
            </Link>
          </div>
          
          {/* Enterprise Plan */}
          <div className="enhanced-pricing-card">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-2">
                $1,299<span className="text-lg font-normal text-gray-400">/month</span>
              </div>
              <p className="text-gray-300">For large-scale operations</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Unlimited equipment items</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Unlimited AI compliance checks</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Custom integrations</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Dedicated account manager</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Unlimited team members</span>
              </li>
            </ul>
            
            <Link href="/auth/register?plan=enterprise" className="enhanced-button-secondary w-full block text-center">
              Get Started
            </Link>
          </div>
        </div>

        {/* Common Features */}
        <div className="enhanced-card mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">All Plans Include</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">Stanford Biomni AI</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">SOC 2 Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 