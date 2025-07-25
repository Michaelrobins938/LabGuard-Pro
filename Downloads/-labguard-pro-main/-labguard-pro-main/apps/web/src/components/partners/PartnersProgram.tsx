'use client'

import { motion } from 'framer-motion'
import { Star, Shield, Zap, Crown, Check, ArrowRight } from 'lucide-react'

const partnershipTiers = [
  {
    name: 'Bronze Partner',
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Perfect for emerging companies looking to establish a presence in laboratory automation.',
    features: [
      'Basic API access',
      'Standard support',
      'Partner portal access',
      'Marketing materials',
      'Training resources'
    ],
    requirements: 'Minimum $50k annual revenue',
    commission: '10% commission'
  },
  {
    name: 'Silver Partner',
    icon: Shield,
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'Ideal for established companies with proven track records in laboratory solutions.',
    features: [
      'Advanced API access',
      'Priority support',
      'Dedicated account manager',
      'Co-marketing opportunities',
      'Custom integrations',
      'Sales training'
    ],
    requirements: 'Minimum $200k annual revenue',
    commission: '15% commission'
  },
  {
    name: 'Gold Partner',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'For industry leaders with extensive reach and deep expertise in laboratory automation.',
    features: [
      'Full API access',
      '24/7 premium support',
      'Strategic account team',
      'Joint go-to-market',
      'Custom development',
      'Exclusive events',
      'Revenue sharing'
    ],
    requirements: 'Minimum $500k annual revenue',
    commission: '20% commission'
  },
  {
    name: 'Platinum Partner',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Our highest tier for strategic partners with global reach and market leadership.',
    features: [
      'Enterprise API access',
      'Dedicated support team',
      'Strategic partnership',
      'Product roadmap input',
      'Exclusive licensing',
      'Global expansion support',
      'Equity opportunities'
    ],
    requirements: 'Minimum $1M annual revenue',
    commission: '25% commission'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function PartnersProgram() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Partnership Tiers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the partnership level that best fits your organization's goals and capabilities. 
            Each tier offers increasing benefits and opportunities for growth.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {partnershipTiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`${tier.bgColor} ${tier.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                <tier.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {tier.name}
              </h3>
              
              <p className="text-gray-600 mb-4 text-center text-sm">
                {tier.description}
              </p>
              
              <div className="mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-1 text-center">
                  {tier.commission}
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {tier.requirements}
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group">
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Custom Partnership Opportunities
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Don't see a tier that fits your needs? We offer custom partnership arrangements for organizations 
            with unique requirements or strategic value propositions.
          </p>
          <button className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
            Contact Partnership Team
          </button>
        </motion.div>
      </div>
    </section>
  )
} 