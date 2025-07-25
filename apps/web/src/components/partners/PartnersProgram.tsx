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

export function PartnersProgram() {
  return (
    <div>
      <h2>Partners Program</h2>
      <p>Partners program information will be here</p>
    </div>
  )
} 