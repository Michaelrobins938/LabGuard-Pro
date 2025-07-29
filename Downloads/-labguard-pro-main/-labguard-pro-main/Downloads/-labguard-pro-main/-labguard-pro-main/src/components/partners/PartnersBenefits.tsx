'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Globe, Shield, Zap, Award, Target, Rocket } from 'lucide-react'

const benefits = [
  {
    icon: TrendingUp,
    title: 'Revenue Growth',
    description: 'Access to new markets and customers through our extensive network and proven solutions.',
    stats: 'Average 40% revenue increase'
  },
  {
    icon: Users,
    title: 'Market Access',
    description: 'Tap into our customer base of 10,000+ laboratories worldwide across all sectors.',
    stats: '10,000+ potential customers'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Expand your business internationally with our established presence in 50+ countries.',
    stats: '50+ countries covered'
  },
  {
    icon: Shield,
    title: 'Risk Mitigation',
    description: 'Reduce market entry risks with our proven technology and established customer relationships.',
    stats: '95% customer satisfaction'
  },
  {
    icon: Zap,
    title: 'Technology Integration',
    description: 'Seamlessly integrate your solutions with our platform for enhanced value proposition.',
    stats: '100+ API endpoints'
  },
  {
    icon: Award,
    title: 'Brand Recognition',
    description: 'Leverage our market leadership position to enhance your brand credibility and visibility.',
    stats: 'Industry leader recognition'
  },
  {
    icon: Target,
    title: 'Strategic Support',
    description: 'Receive dedicated support from our partnership team to maximize your success.',
    stats: 'Dedicated account managers'
  },
  {
    icon: Rocket,
    title: 'Innovation Access',
    description: 'Get early access to new features and influence our product roadmap.',
    stats: 'Early access to innovations'
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

export function PartnersBenefits() {
  return (
    <div>
      <h2>Partners Benefits</h2>
      <p>Partners benefits information will be here</p>
    </div>
  )
} 