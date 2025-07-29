'use client'

import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Zap,
  Star,
  Shield,
  Brain,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CTASection() {
  const features = [
    '14-day free trial',
    'No credit card required',
    'Full platform access',
    'AI-powered compliance',
    'Stanford Biomni integration',
    '24/7 customer support'
  ]

  const benefits = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Start Saving Time Today',
      description: 'Begin automating compliance tasks immediately'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Prevent Costly Failures',
      description: 'AI catches issues before they become expensive'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Audit-Ready Always',
      description: 'Generate compliance reports instantly'
    }
  ]

  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-white/20 text-white border-white/30 mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Limited Time Offer
          </Badge>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your <br />
            <span className="text-yellow-300">Laboratory Operations?</span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join 500+ laboratories already saving time and preventing costly failures. 
            Start your free trial today and experience the future of laboratory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Main CTA */}
          <div className="text-center lg:text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="mb-6">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-white text-sm">4.9/5 from 500+ reviews</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Start Your Free Trial
                </h3>
                
                <p className="text-blue-100 mb-6">
                  Get full access to LabGuard Pro for 14 days. No credit card required.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center lg:justify-start">
                    <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full lg:w-auto bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-blue-200 text-sm">
                  ✓ No setup fees • ✓ Cancel anytime • ✓ Full support included
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-blue-100">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-blue-200 text-sm">Laboratories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">99.8%</div>
            <div className="text-blue-200 text-sm">Compliance Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">$2.5M</div>
            <div className="text-blue-200 text-sm">Total Savings</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-200 text-sm">Support</div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-sm mb-4">Trusted by leading laboratories worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="text-white text-sm font-medium">CAP Certified</div>
            <div className="text-white text-sm font-medium">CLIA Compliant</div>
            <div className="text-white text-sm font-medium">HIPAA Secure</div>
            <div className="text-white text-sm font-medium">SOC 2 Type II</div>
          </div>
        </div>
      </div>
    </section>
  )
} 