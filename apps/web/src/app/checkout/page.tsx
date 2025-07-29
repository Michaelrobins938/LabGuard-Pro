'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader'
import { CheckoutSecurity } from '@/components/checkout/CheckoutSecurity'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'
import { Shield, Lock, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [plan, setPlan] = useState<any>(null)

  const planId = searchParams.get('plan')
  const isYearly = searchParams.get('yearly') === 'true'

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true)
        
        if (!planId) {
          setError('No plan selected')
          return
        }

        // Check if Stripe is configured
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          // Demo mode - show checkout interface without payment processing
          const plansResponse = await apiService.billing.getPlans()
          const selectedPlan = plansResponse.plans.find((p: any) => p.id === planId)
          
          if (!selectedPlan) {
            setError('Invalid plan selected')
            return
          }

          setPlan(selectedPlan)
          setClientSecret('demo_mode')
          return
        }

        // Get plan details
        const plansResponse = await apiService.billing.getPlans()
        const selectedPlan = plansResponse.plans.find((p: any) => p.id === planId)
        
        if (!selectedPlan) {
          setError('Invalid plan selected')
          return
        }

        setPlan(selectedPlan)

        // Create payment intent
        const response = await apiService.billing.createPaymentIntent({
          planId,
          isYearly,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout/cancel`
        })

        if (!response.clientSecret) {
          throw new Error('Failed to create payment intent')
        }

        setClientSecret(response.clientSecret)
      } catch (err: any) {
        console.error('Checkout initialization error:', err)
        
        // Provide more specific error messages
        if (err.message?.includes('Network Error') || err.message?.includes('fetch')) {
          setError('Network error. Please check your connection and try again.')
        } else if (err.message?.includes('500') || err.message?.includes('Internal Server Error')) {
          setError('Server error. Please try again later or contact support.')
        } else {
          setError(err.message || 'Failed to initialize checkout')
        }
        
        toast.error('Failed to initialize checkout')
      } finally {
        setLoading(false)
      }
    }

    initializeCheckout()
  }, [planId, isYearly])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Initializing secure checkout...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we set up your payment</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="glass-card p-6 sm:p-8 rounded-2xl">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Checkout Error</h2>
            <p className="text-gray-300 mb-8 text-sm sm:text-base">{error}</p>
            <Link 
              href="/pricing" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors mobile-button-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Checkout Form */}
          <div className="space-y-6">
            <CheckoutHeader />
            
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  plan={plan} 
                  isYearly={isYearly} 
                  isDemoMode={clientSecret === 'demo_mode'}
                />
              </Elements>
            )}
          </div>

          {/* Right Column - Summary & Security */}
          <div className="space-y-6">
            <CheckoutSummary plan={plan} isYearly={isYearly} />
            <CheckoutSecurity />
          </div>
        </div>
      </div>
    </div>
  )
}