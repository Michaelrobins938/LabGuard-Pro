'use client'

import { motion } from 'framer-motion'
import { Heart, Zap, Users, Globe, BookOpen, Coffee, Home, DollarSign } from 'lucide-react'

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance, mental health support, and wellness programs.',
    features: ['Medical, Dental, Vision', 'Mental Health Coverage', 'Gym Membership', 'Wellness Programs']
  },
  {
    icon: Zap,
    title: 'Flexible Work',
    description: 'Work from anywhere with flexible hours and remote-first culture.',
    features: ['Remote-First', 'Flexible Hours', 'Unlimited PTO', 'Work-Life Balance']
  },
  {
    icon: Users,
    title: 'Team Culture',
    description: 'Collaborative environment with regular team events and social activities.',
    features: ['Team Events', 'Social Activities', 'Mentorship Programs', 'Diversity & Inclusion']
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Work on technology that improves healthcare and research worldwide.',
    features: ['Healthcare Impact', 'Research Innovation', 'Global Reach', 'Meaningful Work']
  },
  {
    icon: BookOpen,
    title: 'Learning & Growth',
    description: 'Continuous learning opportunities and career development support.',
    features: ['Learning Budget', 'Conference Attendance', 'Skill Development', 'Career Growth']
  },
  {
    icon: Coffee,
    title: 'Office Perks',
    description: 'Modern office spaces with amenities and collaborative areas.',
    features: ['Modern Offices', 'Free Meals', 'Coffee & Snacks', 'Collaborative Spaces']
  },
  {
    icon: Home,
    title: 'Work-Life Balance',
    description: 'Support for personal time and family commitments.',
    features: ['Flexible Schedule', 'Family Leave', 'Personal Time', 'Holiday Pay']
  },
  {
    icon: DollarSign,
    title: 'Financial Benefits',
    description: 'Competitive compensation and financial planning support.',
    features: ['Competitive Salary', 'Equity Options', '401(k) Matching', 'Financial Planning']
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

export default function CareersBenefits() {
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
            Why Work With Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe in taking care of our team. Here's what makes LabGuard Pro a great place to work and grow your career.
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
              className="text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {benefit.description}
              </p>
              
              <ul className="space-y-2">
                {benefit.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-sm text-gray-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
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
            Ready to Join Our Team?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're looking for passionate individuals who want to make a difference in healthcare and research. 
            Join us in building the future of laboratory automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              View Open Positions
            </button>
            <button className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Learn About Our Culture
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 