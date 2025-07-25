'use client'

import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose your plan
          </h2>
          <p className="text-xl text-gray-600">
            Flexible pricing for laboratories of all sizes
          </p>
        </div>
        
        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $299<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for small laboratories</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Up to 10 equipment items</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">100 AI compliance checks/month</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Basic reporting</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Email support</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">2 team members</span>
              </li>
            </ul>
            
            <Link href="/auth/register?plan=starter" className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold text-center block">
              Get Started
            </Link>
          </div>
          
          {/* Professional Plan (Most Popular) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-blue relative hover:shadow-2xl transition-shadow duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-blue text-white px-6 py-2 rounded-full text-sm font-semibold">Most Popular</span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $599<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Ideal for growing laboratories</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Up to 50 equipment items</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">500 AI compliance checks/month</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Advanced analytics</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">10 team members</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Custom branding</span>
              </li>
            </ul>
            
            <Link href="/auth/register?plan=professional" className="w-full bg-primary-blue text-white py-3 px-6 rounded-lg hover:bg-primary-blue-dark transition-colors duration-200 font-semibold text-center block">
              Get Started
            </Link>
          </div>
          
          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $1,299<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">For large-scale operations</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Unlimited equipment</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">2,000 AI compliance checks/month</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">White-label options</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Dedicated support</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Unlimited team members</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-primary-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">API access</span>
              </li>
            </ul>
            
            <Link href="/auth/register?plan=enterprise" className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold text-center block">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 