'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Download, Mail, Users, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent')
    
    if (paymentIntentId) {
      // Verify payment and get order details
      verifyPayment(paymentIntentId)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const verifyPayment = async (paymentIntentId: string) => {
    try {
      // In a real implementation, you would verify the payment with your backend
      // For now, we'll simulate a successful verification
      setOrderDetails({
        orderId: `ORD-${Date.now()}`,
        plan: 'Professional',
        amount: '$599.00',
        status: 'Active',
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      })
    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Failed to verify payment')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome to LabGuard Pro!
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your subscription is now active. You're ready to transform your laboratory 
            operations with AI-powered compliance management.
          </p>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Order Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Order Details</h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="text-white">{orderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="text-white">{orderDetails.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="text-white">{orderDetails.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-400">{orderDetails.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Billing:</span>
                      <span className="text-white">{orderDetails.nextBilling}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">What's Next?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Check your email for login credentials</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Invite your team members</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Set up your equipment inventory</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Configure compliance settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <ArrowRight className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            <Download className="w-5 h-5 mr-2" />
            Download Invoice
          </Button>
          
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            <Mail className="w-5 h-5 mr-2" />
            Resend Email
          </Button>
        </div>

        {/* Getting Started Guide */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Getting Started Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Setup Your Lab</h4>
                <p className="text-gray-300 text-sm">
                  Add your laboratory information and configure basic settings
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Add Equipment</h4>
                <p className="text-gray-300 text-sm">
                  Import your equipment inventory and set up calibration schedules
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400 font-bold">3</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Invite Team</h4>
                <p className="text-gray-300 text-sm">
                  Invite your team members and assign roles and permissions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="text-center mt-8">
          <p className="text-gray-300 mb-4">
            Need help getting started? Our support team is available 24/7
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Link href="/support" className="text-blue-400 hover:text-blue-300">
              Contact Support
            </Link>
            <Link href="/docs" className="text-blue-400 hover:text-blue-300">
              Documentation
            </Link>
            <Link href="/demo" className="text-blue-400 hover:text-blue-300">
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}