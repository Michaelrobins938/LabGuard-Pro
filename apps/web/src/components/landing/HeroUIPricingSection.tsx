'use client'

import React, { useState } from 'react'
import { 
  Sparkles, 
  Crown, 
  Globe, 
  Lock, 
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Brain,
  BarChart3,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeroUIPricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small research teams getting started with AI-powered laboratory management.',
      monthlyPrice: 99,
      yearlyPrice: 79,
      icon: Users,
      features: [
        'AI-powered protocol design',
        'Basic compliance monitoring',
        'Real-time analytics dashboard',
        'Email support',
        'Up to 5 team members',
        'Basic equipment management'
      ],
      notIncluded: [
        'Advanced AI features',
        'Priority support',
        'Custom integrations',
        'Advanced reporting'
      ]
    },
    {
      name: 'Professional',
      description: 'Ideal for growing laboratories that need advanced features and team collaboration.',
      monthlyPrice: 299,
      yearlyPrice: 239,
      icon: Crown,
      popular: true,
      features: [
        'Everything in Starter',
        'Advanced AI assistant',
        'Full compliance automation',
        'Priority support',
        'Unlimited team members',
        'Custom integrations',
        'Advanced reporting',
        'Equipment optimization'
      ]
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for large institutions with complex requirements and custom needs.',
      monthlyPrice: 999,
      yearlyPrice: 799,
      icon: Globe,
      features: [
        'Everything in Professional',
        'Custom AI model training',
        'Dedicated support team',
        'On-premise deployment',
        'Custom integrations',
        'Advanced security',
        'SLA guarantees',
        'Training & consultation'
      ]
    }
  ]

  const features = [
    'AI-powered protocol design',
    'Real-time compliance monitoring',
    'Advanced analytics dashboard',
    'Equipment management',
    'Team collaboration tools',
    'Custom integrations',
    'Priority support',
    'Advanced security',
    'Training & consultation',
    'SLA guarantees'
  ]

  const benefits = [
    { icon: Zap, title: '10x Faster Workflows', description: 'Accelerate your research with AI-powered automation' },
    { icon: Shield, title: '100% Compliance', description: 'Ensure regulatory compliance with automated monitoring' },
    { icon: Brain, title: 'AI-Powered Insights', description: 'Get intelligent recommendations and predictions' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Comprehensive data analysis and visualization' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/3 to-purple-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Pricing</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Start with our free trial and scale as you grow. All plans include our core AI features 
            with no hidden fees or complicated pricing.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                isYearly ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  isYearly ? 'transform translate-x-8' : 'transform translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly
              <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? 'border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-purple-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-white">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className="text-lg text-gray-400">/month</span>
                  </div>
                  {isYearly && (
                    <div className="text-sm text-green-400 mt-2">
                      Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12} annually
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link href="/dashboard?bypass=true" className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}>
                  {plan.popular ? 'Start Free Trial' : 'Get Started'}
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </Link>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-gray-400">Feature</th>
                  <th className="text-center py-4 text-gray-400">Starter</th>
                  <th className="text-center py-4 text-gray-400">Professional</th>
                  <th className="text-center py-4 text-gray-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-4 text-white">{feature}</td>
                    <td className="py-4 text-center">
                      {index < 6 ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {index < 8 ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{benefit.title}</h4>
              <p className="text-sm text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Laboratory?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your free trial today and experience the future of AI-powered laboratory management. 
              No credit card required, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard?bypass=true" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm">
                <Users className="w-5 h-5 mr-2" />
                Schedule Demo
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 