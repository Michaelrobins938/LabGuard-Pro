'use client'

import React, { useState } from 'react'
import { 
  Download, 
  Image, 
  FileText, 
  Video, 
  Users, 
  Award, 
  Globe, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Quote,
  ExternalLink,
  Copy,
  Share2,
  Eye
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PressKitPage() {
  const [selectedAsset, setSelectedAsset] = useState('logos')
  const [copiedEmail, setCopiedEmail] = useState('')

  const pressAssets = [
    {
      id: 'logos',
      name: 'Logos & Brand Assets',
      description: 'High-resolution logos and brand guidelines',
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
      files: [
        { name: 'LabGuard Pro Logo (PNG)', size: '2.4 MB', format: 'PNG' },
        { name: 'LabGuard Pro Logo (SVG)', size: '156 KB', format: 'SVG' },
        { name: 'Brand Guidelines', size: '8.7 MB', format: 'PDF' },
        { name: 'Icon Set', size: '3.2 MB', format: 'ZIP' }
      ]
    },
    {
      id: 'photos',
      name: 'Product Photos',
      description: 'High-quality product and team photography',
      icon: Image,
      color: 'from-purple-500 to-pink-500',
      files: [
        { name: 'Dashboard Screenshots', size: '15.2 MB', format: 'ZIP' },
        { name: 'Team Photos', size: '24.8 MB', format: 'ZIP' },
        { name: 'Office Space', size: '12.3 MB', format: 'ZIP' },
        { name: 'Product Demos', size: '45.6 MB', format: 'ZIP' }
      ]
    },
    {
      id: 'documents',
      name: 'Press Releases',
      description: 'Company announcements and press releases',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      files: [
        { name: 'Series A Funding Announcement', size: '2.1 MB', format: 'PDF' },
        { name: 'FDA Approval Press Release', size: '1.8 MB', format: 'PDF' },
        { name: 'Partnership with Stanford', size: '2.3 MB', format: 'PDF' },
        { name: 'Q4 2024 Results', size: '3.4 MB', format: 'PDF' }
      ]
    },
    {
      id: 'videos',
      name: 'Video Assets',
      description: 'Product demos and company videos',
      icon: Video,
      color: 'from-orange-500 to-red-500',
      files: [
        { name: 'Product Demo Video', size: '156 MB', format: 'MP4' },
        { name: 'Company Overview', size: '89 MB', format: 'MP4' },
        { name: 'Customer Testimonials', size: '234 MB', format: 'MP4' },
        { name: 'Technical Walkthrough', size: '187 MB', format: 'MP4' }
      ]
    }
  ]

  const companyStats = [
    { label: 'Labs Served', value: '500+', icon: Users },
    { label: 'Countries', value: '50+', icon: Globe },
    { label: 'Accuracy Rate', value: '99.9%', icon: Award },
    { label: 'Uptime', value: '99.9%', icon: TrendingUp }
  ]

  const recentNews = [
    {
      title: 'LabGuard Pro Raises $25M Series A Funding',
      date: 'January 15, 2024',
      excerpt: 'Funding will accelerate AI-powered laboratory automation and expand global operations.',
      source: 'TechCrunch',
      url: '#'
    },
    {
      title: 'FDA Approves LabGuard Pro for Clinical Use',
      date: 'December 8, 2023',
      excerpt: 'First AI-powered laboratory management system to receive FDA clearance.',
      source: 'Medical Device Network',
      url: '#'
    },
    {
      title: 'Stanford Partnership Advances AI Research',
      date: 'November 22, 2023',
      excerpt: 'Collaboration focuses on next-generation laboratory automation technology.',
      source: 'Stanford News',
      url: '#'
    }
  ]

  const copyEmail = () => {
    navigator.clipboard.writeText('press@labguardpro.com')
    setCopiedEmail('press@labguardpro.com')
    setTimeout(() => setCopiedEmail(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Press Kit</h1>
                <p className="text-gray-400">Media resources and company information</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={copyEmail}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                {copiedEmail ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Mail className="w-4 h-4" />}
                {copiedEmail ? 'Copied!' : 'press@labguardpro.com'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download All Assets
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Company Overview */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">About LabGuard Pro</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                LabGuard Pro is the leading AI-powered laboratory management platform, revolutionizing how research institutions, 
                clinical laboratories, and pharmaceutical companies operate. Founded in 2022 by a team of Stanford researchers 
                and industry veterans, we've developed the most advanced laboratory automation system in the world.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our platform combines cutting-edge artificial intelligence with decades of laboratory expertise to deliver 
                unprecedented accuracy, efficiency, and compliance. With over 500 laboratories across 50+ countries trusting 
                our technology, LabGuard Pro is setting the standard for the future of scientific research.
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Company Fact Sheet
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Executive Bios
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Key Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                {companyStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Press Assets */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Press Assets</h2>
          <div className="grid lg:grid-cols-4 gap-4 mb-6">
            {pressAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset.id)}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  selectedAsset === asset.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${asset.color} rounded-lg flex items-center justify-center`}>
                    <asset.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{asset.name}</div>
                    <div className="text-xs text-gray-400">{asset.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            {pressAssets.map((asset) => (
              <div key={asset.id} className={selectedAsset === asset.id ? 'block' : 'hidden'}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${asset.color} rounded-lg flex items-center justify-center`}>
                    <asset.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{asset.name}</h3>
                    <p className="text-gray-400">{asset.description}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {asset.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="font-medium text-white">{file.name}</div>
                          <div className="text-sm text-gray-400">{file.size} • {file.format}</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent News</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recentNews.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{news.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{news.title}</h3>
                <p className="text-gray-300 mb-4">{news.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400">{news.source}</span>
                  <button className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Read More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Media Contact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Press Inquiries</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white">press@labguardpro.com</div>
                    <div className="text-sm text-gray-400">General press inquiries</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white">+1 (555) 123-4567</div>
                    <div className="text-sm text-gray-400">Press hotline</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white">Stanford, CA 94305</div>
                    <div className="text-sm text-gray-400">Headquarters</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Founded: 2022</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Employees: 150+</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Funding: $25M Series A</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">FDA Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">ISO 17025 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}