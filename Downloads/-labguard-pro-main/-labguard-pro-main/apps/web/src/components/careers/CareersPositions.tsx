'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, Users, ArrowRight } from 'lucide-react'

const positions = [
  {
    id: 1,
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $180k',
    team: '5-10 people',
    description: 'Lead development of our AI-powered laboratory management platform.',
    requirements: ['React/Next.js', 'Python', 'AI/ML', 'PostgreSQL'],
    posted: '2 days ago'
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $150k',
    team: '3-5 people',
    description: 'Drive product strategy and roadmap for laboratory automation solutions.',
    requirements: ['Product Strategy', 'User Research', 'Agile', 'Healthcare/Lab'],
    posted: '1 week ago'
  },
  {
    id: 3,
    title: 'AI Research Scientist',
    department: 'Research',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$130k - $200k',
    team: '2-4 people',
    description: 'Develop cutting-edge AI models for laboratory automation and analysis.',
    requirements: ['Machine Learning', 'Python', 'TensorFlow/PyTorch', 'PhD'],
    posted: '3 days ago'
  },
  {
    id: 4,
    title: 'Sales Engineer',
    department: 'Sales',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90k - $140k',
    team: '8-12 people',
    description: 'Technical sales role focused on laboratory automation solutions.',
    requirements: ['Technical Sales', 'Laboratory Experience', 'Presentation Skills'],
    posted: '5 days ago'
  },
  {
    id: 5,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $130k',
    team: '3-6 people',
    description: 'Design intuitive interfaces for complex laboratory workflows.',
    requirements: ['Figma', 'User Research', 'Prototyping', 'Healthcare UX'],
    posted: '1 week ago'
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110k - $160k',
    team: '4-7 people',
    description: 'Build and maintain scalable infrastructure for our platform.',
    requirements: ['AWS/Azure', 'Docker', 'Kubernetes', 'CI/CD'],
    posted: '4 days ago'
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

export function CareersPositions() {
  return (
    <div>
      <h2>Career Positions</h2>
      <p>Available positions will be listed here</p>
    </div>
  )
} 