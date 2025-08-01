'use client'

import React, { useState } from 'react'
import { 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Award,
  Globe,
  Brain,
  Shield,
  Zap,
  Calendar,
  Tag,
  Eye,
  Heart
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const articles = [
    {
      id: 1,
      title: 'New CAP/CLIA Requirements for 2024',
      category: 'Compliance',
      excerpt: 'Learn about the latest updates to laboratory compliance standards and how LabGuard Pro helps you stay compliant.',
      author: 'Dr. Sarah Chen',
      date: 'January 15, 2024',
      readTime: '5 min read',
      views: 1247,
      likes: 89,
      icon: Shield,
      slug: 'cap-clia-requirements-2024',
      tags: ['Compliance', 'CLIA', 'CAP', 'Regulations']
    },
    {
      id: 2,
      title: 'How AI is Revolutionizing Lab Management',
      category: 'AI & Automation',
      excerpt: 'Discover how artificial intelligence is transforming laboratory operations and improving efficiency.',
      author: 'Dr. Michael Rodriguez',
      date: 'January 10, 2024',
      readTime: '7 min read',
      views: 2156,
      likes: 156,
      icon: Brain,
      slug: 'ai-revolutionizing-lab-management',
      tags: ['AI', 'Automation', 'Machine Learning', 'Efficiency']
    },
    {
      id: 3,
      title: 'Equipment Calibration Best Practices',
      category: 'Best Practices',
      excerpt: 'Essential tips for maintaining accurate equipment calibration and ensuring reliable results.',
      author: 'Dr. Emily Watson',
      date: 'January 5, 2024',
      readTime: '6 min read',
      views: 1893,
      likes: 134,
      icon: Zap,
      slug: 'equipment-calibration-best-practices',
      tags: ['Calibration', 'Equipment', 'Quality Control', 'Maintenance']
    },
    {
      id: 4,
      title: 'The Future of Laboratory Automation',
      category: 'Technology',
      excerpt: 'Explore emerging trends in laboratory automation and what to expect in the coming years.',
      author: 'Dr. James Thompson',
      date: 'December 28, 2023',
      readTime: '8 min read',
      views: 3421,
      likes: 267,
      icon: Award,
      slug: 'future-laboratory-automation',
      tags: ['Automation', 'Technology', 'Future', 'Innovation']
    },
    {
      id: 5,
      title: 'Data Security in Modern Laboratories',
      category: 'Security',
      excerpt: 'Best practices for protecting sensitive laboratory data and ensuring compliance with security standards.',
      author: 'Dr. Lisa Park',
      date: 'December 20, 2023',
      readTime: '6 min read',
      views: 1678,
      likes: 98,
      icon: Shield,
      slug: 'data-security-modern-laboratories',
      tags: ['Security', 'Data Protection', 'Compliance', 'Cybersecurity']
    },
    {
      id: 6,
      title: 'Streamlining Clinical Trial Management',
      category: 'Clinical Research',
      excerpt: 'How modern software solutions are improving clinical trial efficiency and data quality.',
      author: 'Dr. Robert Kim',
      date: 'December 15, 2023',
      readTime: '7 min read',
      views: 2987,
      likes: 203,
      icon: Users,
      slug: 'streamlining-clinical-trial-management',
      tags: ['Clinical Trials', 'Research', 'Data Quality', 'Efficiency']
    }
  ];

  const categories = [
    { name: 'all', label: 'All Articles' },
    { name: 'Compliance', label: 'Compliance' },
    { name: 'AI & Automation', label: 'AI & Automation' },
    { name: 'Best Practices', label: 'Best Practices' },
    { name: 'Technology', label: 'Technology' },
    { name: 'Security', label: 'Security' },
    { name: 'Clinical Research', label: 'Clinical Research' }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleReadMore = (slug: string) => {
    // Navigate to the full article page
    window.location.href = `/blog/${slug}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Latest Articles</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover insights, best practices, and industry trends from our expert contributors.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`${
                  selectedCategory === category.name 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <article.icon className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {article.category}
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 hover:text-blue-300 transition-colors cursor-pointer">
                {article.title}
              </h3>
              <p className="text-gray-300 mb-4">{article.excerpt}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-400">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <span>{article.author}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{article.views}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(article.id)}
                    className={`flex items-center gap-1 p-1 ${
                      likedPosts.has(article.id) ? 'text-red-400' : 'text-gray-400'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${likedPosts.has(article.id) ? 'fill-current' : ''}`} />
                    <span>{article.likes + (likedPosts.has(article.id) ? 1 : 0)}</span>
                  </Button>
                </div>
                <Button
                  onClick={() => handleReadMore(article.slug)}
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="text-sm font-medium">Read More</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-6">
                Get the latest insights and updates delivered to your inbox
              </p>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
} 