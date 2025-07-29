'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Brain, 
  Dna, 
  Microscope, 
  Target, 
  CheckCircle, 
  Zap, 
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Code,
  Database,
  Cpu,
  Beaker,
  TestTube,
  Crown,
  Lock,
  BarChart3,
  Clock
} from 'lucide-react'

export function ModernLandingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Stanford Biomni AI",
      description: "Powered by Stanford's cutting-edge research with 150+ tools and 59 databases",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "AI-Powered Calibration",
      description: "Automated equipment calibration with real-time validation and compliance checking",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "HIPAA, SOC2, and GDPR compliant with advanced encryption and audit trails",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Comprehensive dashboards with predictive analytics and performance insights",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Smart Automation",
      description: "Intelligent workflow automation with AI-driven decision making",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-tenant Architecture",
      description: "Scalable platform supporting multiple laboratories and organizations",
      color: "from-cyan-500 to-blue-600"
    }
  ]

  const stats = [
    { label: "Equipment Monitored", value: "10,000+", icon: <Microscope className="w-5 h-5" /> },
    { label: "AI Assistance Sessions", value: "50,000+", icon: <Bot className="w-5 h-5" /> },
    { label: "Research Projects", value: "1,000+", icon: <Dna className="w-5 h-5" /> },
    { label: "Compliance Rate", value: "99.8%", icon: <CheckCircle className="w-5 h-5" /> }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Lab Director, Stanford Medical Center",
      content: "LabGuard Pro with Biomni AI has revolutionized our laboratory operations. The AI assistant has accelerated our research by 100x.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Research Scientist, MIT",
      content: "The integration with Stanford's Biomni system is game-changing. We can now design experiments and analyze data with unprecedented speed.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Quality Manager, Mayo Clinic",
      content: "The compliance automation features have saved us countless hours. Our audit scores have improved dramatically.",
      rating: 5
    }
  ]

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small research teams getting started with AI-powered laboratory management.',
      monthlyPrice: 29900, // $299.00
      yearlyPrice: 23900, // $239.00 (20% discount)
      icon: Users,
      features: [
        'AI-powered protocol design',
        'Basic compliance monitoring',
        'Real-time analytics dashboard',
        'Email support',
        'Up to 5 team members',
        'Basic equipment management'
      ],
      limits: {
        equipment: 10,
        aiChecks: 100,
        teamMembers: 2,
        storage: 10
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing laboratories that need advanced features and team collaboration.',
      monthlyPrice: 59900, // $599.00
      yearlyPrice: 47900, // $479.00 (20% discount)
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
      ],
      limits: {
        equipment: 50,
        aiChecks: 500,
        teamMembers: 10,
        storage: 100
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large institutions with complex requirements and custom needs.',
      monthlyPrice: 129900, // $1,299.00
      yearlyPrice: 103900, // $1,039.00 (20% discount)
      icon: Globe,
      features: [
        'Everything in Professional',
        'Unlimited equipment',
        '2,000 AI compliance checks',
        'White-label options',
        'Dedicated support',
        'API access',
        'Custom integrations',
        'On-premise deployment'
      ],
      limits: {
        equipment: -1, // Unlimited
        aiChecks: 2000,
        teamMembers: -1, // Unlimited
        storage: 500
      }
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => window.location.href = '/'}
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span 
              className="text-xl font-bold text-white cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => window.location.href = '/'}
            >
              LabGuard Pro
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => {
                const featuresSection = document.getElementById('features')
                featuresSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => {
                const pricingSection = document.getElementById('pricing')
                pricingSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Pricing
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => window.location.href = '/about'}
            >
              About
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={() => window.location.href = '/ai-demo'}
            >
              <Bot className="w-4 h-4 mr-2" />
              Try AI Assistant
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-6"
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Laboratory
                  </span>
                  <br />
                  with AI
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Revolutionize your lab operations with Stanford's cutting-edge Biomni AI. 
                  Automate compliance, streamline workflows, and ensure 100% accuracy in every experiment.
                </motion.p>
              </div>

              {/* Mobile Optimized CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button 
                  size="lg"
                  className="mobile-button-primary text-lg px-8 py-4 h-auto"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="mobile-button-secondary text-lg px-8 py-4 h-auto border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/ai-demo'}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Try AI Demo
                </Button>
              </motion.div>

              {/* Mobile Optimized Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - AI Assistant Demo Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">🧬 Stanford Biomni AI</h3>
                      <p className="text-sm text-gray-400">Interactive Demo Available</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">
                          🧬 **Experience Stanford Biomni AI**
                        </p>
                        <p className="text-xs text-gray-300 mt-2">
                          Try our interactive demo with 150+ tools and 59 databases for laboratory research.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.href = '/ai-demo'}
                      className="w-full mobile-button-primary text-base px-6 py-3"
                    >
                      🚀 Launch Interactive Demo
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400">Protocol Design</div>
                        <div className="text-xs text-blue-400">PCR Analysis</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-400">Genomic Analysis</div>
                        <div className="text-xs text-purple-400">Cancer Biomarkers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powered by Stanford Research
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced AI capabilities built on decades of Stanford research and real-world laboratory data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="mobile-card h-full hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Flexible pricing for laboratories of all sizes with Stanford Biomni AI included
          </p>
        </motion.div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isYearly ? 'bg-white text-gray-900' : 'text-white hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isYearly ? 'bg-white text-gray-900' : 'text-white hover:text-gray-300'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>Yearly</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                  Save 20%
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    {formatCurrency(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                    <span className="text-lg text-gray-400">/month</span>
                  </div>
                  {isYearly && (
                    <div className="text-sm text-green-400 mt-2">
                      Save {formatCurrency(plan.monthlyPrice - plan.yearlyPrice)} annually
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => window.location.href = `/checkout?plan=${plan.id}&yearly=${isYearly}`}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  } text-white`}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limits */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Equipment</div>
                    <div className="text-white font-medium">
                      {plan.limits.equipment === -1 ? 'Unlimited' : `Up to ${plan.limits.equipment}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">AI Checks</div>
                    <div className="text-white font-medium">
                      {plan.limits.aiChecks === -1 ? 'Unlimited' : `${plan.limits.aiChecks}/month`}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Team Members</div>
                    <div className="text-white font-medium">
                      {plan.limits.teamMembers === -1 ? 'Unlimited' : `Up to ${plan.limits.teamMembers}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Storage</div>
                    <div className="text-white font-medium">
                      {plan.limits.storage === -1 ? 'Unlimited' : `${plan.limits.storage} GB`}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Plus Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Crown className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Plus</h3>
              <p className="text-gray-300 mb-6">
                Custom solutions for large laboratory networks and enterprise deployments
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-sm">
                <div>
                  <h4 className="font-medium text-white mb-2">Custom Features</h4>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Custom AI check limits</li>
                    <li>• On-premise deployment</li>
                    <li>• SLA guarantees</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Volume Discounts</h4>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Multi-site licensing</li>
                    <li>• Annual billing discounts</li>
                    <li>• Custom payment terms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Dedicated Support</h4>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Dedicated account manager</li>
                    <li>• Custom development</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
              <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Testimonials Section - Mobile Optimized */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Leading Laboratories
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            See what researchers and laboratory professionals are saying about LabGuard Pro
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="mobile-card h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LabGuard Pro</span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                The future of laboratory intelligence, powered by Stanford Biomni AI.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/solutions" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/resources/api" className="hover:text-white transition-colors">API</a></li>
                <li><a href="/ai-demo" className="hover:text-white transition-colors">AI Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/resources/documentation" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/resources/case-studies" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="/partners" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 LabGuard Pro. Powered by Stanford Biomni AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 