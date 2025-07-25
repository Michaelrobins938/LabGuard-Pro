'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, TrendingUp, Users, Clock, DollarSign } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Accelerated Research',
    description: 'Speed up your research processes with AI-powered automation and intelligent workflows.',
    metric: '50% faster research cycles'
  },
  {
    icon: Shield,
    title: 'Regulatory Compliance',
    description: 'Ensure full compliance with FDA, EMA, and other regulatory requirements automatically.',
    metric: '100% compliance rate'
  },
  {
    icon: TrendingUp,
    title: 'Scalable Operations',
    description: 'Scale your operations efficiently as your biotech company grows and evolves.',
    metric: '10x operational efficiency'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Enable seamless collaboration across research teams and external partners.',
    metric: 'Real-time collaboration'
  },
  {
    icon: Clock,
    title: 'Time to Market',
    description: 'Reduce time to market for your biotech products and therapies.',
    metric: '30% faster time to market'
  },
  {
    icon: DollarSign,
    title: 'Cost Optimization',
    description: 'Optimize costs while maintaining the highest quality standards in research.',
    metric: '40% cost reduction'
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

export default function BiotechnologyBenefits() {
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
            Why Choose LabGuard Pro for Biotechnology?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is specifically designed to address the unique challenges faced by biotechnology companies, 
            helping you accelerate innovation while maintaining the highest standards of quality and compliance.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
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
              
              <p className="text-gray-600 mb-4 text-center">
                {benefit.description}
              </p>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {benefit.metric}
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
            Proven Results in Biotechnology
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Leading biotech companies trust LabGuard Pro to power their research and development operations.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Biotech Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Research Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Reliability</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 