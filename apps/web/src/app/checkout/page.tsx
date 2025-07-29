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

        setClientSecret(response.clientSecret)
      } catch (err: any) {
        console.error('Checkout initialization error:', err)
        setError(err.message || 'Failed to initialize checkout')
        toast.error('Failed to initialize checkout')
      } finally {
        setLoading(false)
      }
    }

    initializeCheckout()
  }, [planId, isYearly])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing secure checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Checkout Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Link 
              href="/pricing" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutHeader />
        
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">Payment Information</h2>
              </div>
              
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm plan={plan} isYearly={isYearly} />
                </Elements>
              )}
            </div>

            <CheckoutSecurity />
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <CheckoutSummary plan={plan} isYearly={isYearly} />
            
            {/* Trust Indicators */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Why Choose LabGuard Pro?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Enterprise Security</h4>
                    <p className="text-gray-300 text-sm">SOC 2 compliant with bank-level encryption</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">99.9% Uptime SLA</h4>
                    <p className="text-gray-300 text-sm">Guaranteed availability for critical operations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">24/7 Support</h4>
                    <p className="text-gray-300 text-sm">Dedicated support team for enterprise customers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">30-Day Money Back</h4>
                    <p className="text-gray-300 text-sm">Risk-free trial with full refund guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}