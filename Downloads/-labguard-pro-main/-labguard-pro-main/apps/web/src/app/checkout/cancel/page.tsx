'use client'

import Link from 'next/link'
import { XCircle, ArrowLeft, HelpCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cancel Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your payment was cancelled. No charges were made to your account. 
            You can try again anytime or contact our support team for assistance.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Try Again
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Ready to get started? Return to our pricing page and select your plan.
              </p>
              <Link href="/pricing">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  View Pricing Plans
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Our support team is here to help with any questions or issues.
              </p>
              <div className="space-y-2">
                <Link href="/support">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Issues */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Common Payment Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Payment Method Issues</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Insufficient funds in your account</li>
                  <li>• Expired credit card</li>
                  <li>• Bank declined the transaction</li>
                  <li>• Incorrect billing information</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Technical Issues</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Browser compatibility issues</li>
                  <li>• Network connectivity problems</li>
                  <li>• Security software blocking payment</li>
                  <li>• Session timeout</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Alternative Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Contact Sales</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Speak with our sales team for custom pricing and enterprise solutions
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Contact Sales
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 font-bold">14</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Free Trial</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Start with a 14-day free trial, no credit card required
                </p>
                <Link href="/trial">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-400 font-bold">?</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Learn More</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Explore our features and see how LabGuard Pro can help your lab
                </p>
                <Link href="/features">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    View Features
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Contact */}
        <div className="text-center mt-8">
          <p className="text-gray-300 mb-4">
            Still having trouble? We're here to help 24/7
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Link href="/support" className="text-blue-400 hover:text-blue-300">
              Live Chat
            </Link>
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              Email Support
            </Link>
            <Link href="/phone" className="text-blue-400 hover:text-blue-300">
              Call Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}