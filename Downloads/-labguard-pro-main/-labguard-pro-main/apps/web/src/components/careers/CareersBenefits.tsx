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

export function CareersBenefits() {
  return (
    <div>
      <h2>Career Benefits</h2>
      <p>Benefits information will be listed here</p>
    </div>
  )
} 