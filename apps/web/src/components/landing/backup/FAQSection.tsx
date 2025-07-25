'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Brain, Shield, Clock, DollarSign } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'ai' | 'pricing' | 'security'
  icon: React.ReactNode
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const faqs: FAQItem[] = [
    {
      question: "What makes LabGuard Pro different from other laboratory management systems?",
      answer: "LabGuard Pro is the only platform that integrates Stanford's cutting-edge Biomni AI technology. This gives you unprecedented capabilities for visual analysis, automated protocol generation, and intelligent compliance checking. While other systems focus on basic tracking, we provide AI-powered insights that prevent costly failures before they happen.",
      category: 'general',
      icon: <Brain className="w-5 h-5" />
    },
    {
      question: "How does the Biomni AI integration work?",
      answer: "Our Biomni AI integration allows you to upload laboratory images (samples, equipment, cultures) and get instant AI analysis. The system can detect contamination, assess sample quality, monitor equipment conditions, and even generate experimental protocols. It's like having a senior laboratory scientist available 24/7 for visual analysis and decision support.",
      category: 'ai',
      icon: <Brain className="w-5 h-5" />
    },
    {
      question: "How much time can I expect to save with LabGuard Pro?",
      answer: "Most laboratories save 15-25 hours per week on compliance tasks. This includes automated calibration scheduling, instant report generation, AI-powered validation, and streamlined audit preparation. Our customers typically see an 80% reduction in manual compliance work.",
      category: 'general',
      icon: <Clock className="w-5 h-5" />
    },
    {
      question: "What's included in the free trial?",
      answer: "The 14-day free trial includes full access to all features: AI-powered compliance checking, Biomni visual analysis, protocol generation, equipment management, and unlimited compliance reports. No credit card required, and you can cancel anytime.",
      category: 'pricing',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      question: "How secure is my laboratory data?",
      answer: "We implement enterprise-grade security with SOC 2 Type II compliance, HIPAA standards, and end-to-end encryption. Your data is stored in secure, redundant cloud infrastructure with regular backups. We never share your data with third parties and provide full audit trails for compliance.",
      category: 'security',
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "Can LabGuard Pro integrate with our existing LIMS system?",
      answer: "Yes! LabGuard Pro offers comprehensive API access and pre-built integrations with popular LIMS systems including LabWare, STARLIMS, and custom solutions. Our team can help set up seamless data synchronization to maintain your existing workflows while adding AI capabilities.",
      category: 'general',
      icon: <Brain className="w-5 h-5" />
    },
    {
      question: "What types of equipment does LabGuard Pro support?",
      answer: "We support all laboratory equipment including analytical balances, centrifuges, incubators, microscopes, PCR machines, spectrophotometers, and more. Our AI can validate calibration data for any equipment type and automatically detect when maintenance is needed.",
      category: 'general',
      icon: <Brain className="w-5 h-5" />
    },
    {
      question: "How accurate is the AI compliance checking?",
      answer: "Our AI achieves 99.8% accuracy in compliance validation, significantly outperforming manual checking. The system learns from your laboratory's specific requirements and regulatory standards, becoming more accurate over time. All AI recommendations are reviewed by our team of laboratory experts.",
      category: 'ai',
      icon: <Brain className="w-5 h-5" />
    },
    {
      question: "What regulatory standards does LabGuard Pro support?",
      answer: "We support all major laboratory regulatory standards including CAP, CLIA, ISO 15189, FDA, and international equivalents. Our compliance templates are regularly updated to reflect the latest regulatory changes, ensuring your laboratory stays current with requirements.",
      category: 'security',
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "How much does LabGuard Pro cost?",
      answer: "LabGuard Pro starts at $299/month for the Starter plan, which includes 100 AI compliance checks and 10 equipment items. Professional ($599/month) includes 500 checks and 50 equipment items. Enterprise plans are custom-priced for larger organizations. All plans include the full Biomni AI integration.",
      category: 'pricing',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      question: "Can I use LabGuard Pro for research laboratories?",
      answer: "Absolutely! LabGuard Pro is designed for both clinical and research laboratories. Our AI can generate experimental protocols, analyze research data, and help optimize experimental conditions. Many research institutions use our platform to streamline their compliance while accelerating their research.",
      category: 'ai',
      icon: <Brain className="w-5 h-5" />
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide 24/7 customer support including live chat, email, and phone support. Enterprise customers get dedicated account managers and priority support. We also offer comprehensive training, documentation, and regular webinars to help your team maximize the platform's capabilities.",
      category: 'general',
      icon: <Clock className="w-5 h-5" />
    }
  ]

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const categories = [
    { key: 'general', label: 'General', count: faqs.filter(f => f.category === 'general').length },
    { key: 'ai', label: 'AI & Biomni', count: faqs.filter(f => f.category === 'ai').length },
    { key: 'pricing', label: 'Pricing', count: faqs.filter(f => f.category === 'pricing').length },
    { key: 'security', label: 'Security', count: faqs.filter(f => f.category === 'security').length }
  ]

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about LabGuard Pro and our revolutionary Biomni AI integration.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              className="px-6 py-3 rounded-full bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors duration-200"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {faq.icon}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                </div>
                <div className="ml-4">
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our laboratory experts are here to help. Get personalized answers and see how LabGuard Pro can transform your laboratory operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold">
                Contact Sales
              </button>
              <button className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 