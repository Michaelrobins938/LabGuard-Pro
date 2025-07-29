'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Lock, CreditCard } from 'lucide-react'

export function CheckoutHeader() {
  return (
    <div className="border-b border-white/10 pb-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/pricing" 
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Shield className="w-4 h-4" />
            <span className="text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Lock className="w-4 h-4" />
            <span className="text-sm">PCI Compliant</span>
          </div>
        </div>
      </div>

      {/* Header Content */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-4">
          <CreditCard className="w-4 h-4" />
          <span className="text-sm font-medium">Secure Checkout</span>
        </div>
        
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Complete Your Purchase
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          You're just moments away from transforming your laboratory operations with 
          AI-powered compliance management.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">1</span>
            </div>
            <span className="ml-2 text-white font-medium">Plan Selection</span>
          </div>
          
          <div className="w-12 h-0.5 bg-gray-600"></div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">2</span>
            </div>
            <span className="ml-2 text-white font-medium">Payment</span>
          </div>
          
          <div className="w-12 h-0.5 bg-gray-600"></div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-sm font-semibold">3</span>
            </div>
            <span className="ml-2 text-gray-400 font-medium">Setup</span>
          </div>
        </div>
      </div>
    </div>
  )
}