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

export default function PartnersBenefits() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Partnership Benefits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the advantages of partnering with LabGuard Pro and how we can help accelerate your business growth.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-center text-sm">
                {benefit.description}
              </p>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {benefit.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Success Stories
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our partners have achieved remarkable results. Join the success stories and transform your business with LabGuard Pro.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">$50M+</div>
              <div className="text-blue-100">Combined Partner Revenue</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Partnerships</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Partner Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 