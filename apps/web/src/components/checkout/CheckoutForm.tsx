'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Lock, Shield, CreditCard } from 'lucide-react'

interface CheckoutFormProps {
  plan: any
  isYearly: boolean
  isDemoMode?: boolean
}

export function CheckoutForm({ plan, isYearly, isDemoMode = false }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isDemoMode) {
      // Demo mode - simulate successful payment
      toast.success('Demo mode: Payment simulation successful!')
      router.push('/checkout/success')
      return
    }

    if (!stripe || !elements) {
      toast.error('Stripe not initialized')
      return
    }

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // Confirm payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                country: 'US'
              }
            }
          }
        }
      })

      if (result.error) {
        console.error('Payment error:', result.error)
        toast.error(result.error.message || 'Payment failed')
        return
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!')
        router.push('/checkout/success')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center mb-6">
          <CreditCard className="w-6 h-6 text-blue-400 mr-3" />
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Payment Information</h2>
        </div>
        
        {/* Customer Information */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-300 mb-2 block">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mobile-input"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-300 mb-2 block">
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mobile-input"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2 block">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mobile-input"
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="text-sm font-medium text-gray-300 mb-2 block">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                className="mobile-input"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-300 mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="mobile-input"
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        {/* Payment Element */}
        {!isDemoMode && (
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-300 mb-2 block">
              Payment Method
            </Label>
            <div className="mobile-input min-h-[60px] flex items-center">
              <PaymentElement />
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Demo Mode</h4>
                <p className="text-gray-300 text-xs">This is a demonstration. No actual payment will be processed.</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full mobile-button-primary text-lg py-4 h-auto mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              {isDemoMode ? 'Complete Demo Purchase' : `Pay ${formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}`}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center justify-center mt-6 text-xs text-gray-400">
          <Shield className="w-4 h-4 mr-2" />
          Your payment is secured with bank-level encryption
        </div>
      </div>
    </form>
  )
}