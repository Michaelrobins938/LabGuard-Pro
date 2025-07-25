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

export default function CareersPositions() {
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
            Open Positions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our team and help revolutionize laboratory automation. We're looking for passionate individuals who want to make a difference in healthcare and research.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {positions.map((position) => (
            <motion.div
              key={position.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {position.title}
                  </h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {position.department}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{position.posted}</span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {position.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {position.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {position.type}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {position.salary}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {position.team}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                <div className="flex flex-wrap gap-2">
                  {position.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

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
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Don't see a position that fits? We're always looking for talented individuals.
          </p>
          <button className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
            Send Open Application
          </button>
        </motion.div>
      </div>
    </section>
  )
} 