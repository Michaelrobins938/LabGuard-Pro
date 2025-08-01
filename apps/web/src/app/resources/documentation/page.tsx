'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Video, 
  Download, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users,
  Zap,
  Shield,
  Brain,
  Microscope,
  Database,
  Settings,
  HelpCircle,
  Star,
  Filter,
  Book,
  Code,
  Play,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [
    { name: 'all', label: 'All Categories' },
    { name: 'getting-started', label: 'Getting Started' },
    { name: 'user-guide', label: 'User Guide' },
    { name: 'api', label: 'API Reference' },
    { name: 'troubleshooting', label: 'Troubleshooting' },
    { name: 'best-practices', label: 'Best Practices' },
    { name: 'compliance', label: 'Compliance' },
    { name: 'integrations', label: 'Integrations' }
  ];

  const types = [
    { name: 'all', label: 'All Types' },
    { name: 'guides', label: 'Guides' },
    { name: 'videos', label: 'Videos' },
    { name: 'api-docs', label: 'API Docs' },
    { name: 'tutorials', label: 'Tutorials' },
    { name: 'reference', label: 'Reference' }
  ];

  const documentationItems = [
    {
      id: 1,
      title: 'Getting Started with LabGuard Pro',
      category: 'getting-started',
      type: 'guides',
      description: 'Complete setup guide for new users to get started with LabGuard Pro',
      duration: '15 min read',
      difficulty: 'Beginner',
      icon: BookOpen,
      url: '/docs/getting-started',
      tags: ['Setup', 'Installation', 'First Steps']
    },
    {
      id: 2,
      title: 'Equipment Management Tutorial',
      category: 'user-guide',
      type: 'tutorials',
      description: 'Learn how to manage laboratory equipment and track calibrations',
      duration: '8 min read',
      difficulty: 'Intermediate',
      icon: Microscope,
      url: '/docs/equipment-management',
      tags: ['Equipment', 'Calibration', 'Maintenance']
    },
    {
      id: 3,
      title: 'API Reference Documentation',
      category: 'api',
      type: 'api-docs',
      description: 'Complete API reference for integrating with LabGuard Pro',
      duration: '45 min read',
      difficulty: 'Advanced',
      icon: Code,
      url: '/docs/api-reference',
      tags: ['API', 'Integration', 'Development']
    },
    {
      id: 4,
      title: 'Compliance Setup Guide',
      category: 'compliance',
      type: 'guides',
      description: 'Configure compliance settings for CLIA, CAP, and other regulations',
      duration: '12 min read',
      difficulty: 'Intermediate',
      icon: Shield,
      url: '/docs/compliance-setup',
      tags: ['Compliance', 'CLIA', 'CAP', 'Regulations']
    },
    {
      id: 5,
      title: 'AI Assistant Video Tutorial',
      category: 'user-guide',
      type: 'videos',
      description: 'Video tutorial on using the AI assistant for laboratory tasks',
      duration: '10 min video',
      difficulty: 'Beginner',
      icon: Brain,
      url: '/docs/ai-assistant-video',
      tags: ['AI', 'Assistant', 'Video', 'Tutorial']
    },
    {
      id: 6,
      title: 'Data Management Best Practices',
      category: 'best-practices',
      type: 'guides',
      description: 'Best practices for managing laboratory data and ensuring security',
      duration: '20 min read',
      difficulty: 'Intermediate',
      icon: Database,
      url: '/docs/data-management',
      tags: ['Data', 'Security', 'Best Practices']
    },
    {
      id: 7,
      title: 'Troubleshooting Common Issues',
      category: 'troubleshooting',
      type: 'reference',
      description: 'Solutions for common problems and error messages',
      duration: '25 min read',
      difficulty: 'All Levels',
      icon: HelpCircle,
      url: '/docs/troubleshooting',
      tags: ['Troubleshooting', 'Errors', 'Solutions']
    },
    {
      id: 8,
      title: 'Third-Party Integrations',
      category: 'integrations',
      type: 'guides',
      description: 'How to integrate LabGuard Pro with other laboratory systems',
      duration: '18 min read',
      difficulty: 'Advanced',
      icon: Zap,
      url: '/docs/integrations',
      tags: ['Integrations', 'Systems', 'Connectivity']
    }
  ];

  const filteredItems = documentationItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleItemClick = (url: string) => {
    // In a real app, this would navigate to the documentation page
    console.log('Navigating to:', url);
    alert(`Opening documentation: ${url}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Documentation</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Documentation{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Center
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Comprehensive guides, tutorials, and reference materials to help you get the most out of LabGuard Pro.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg"
              />
            </div>
          </div>

          {/* Filter Buttons */}
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

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {types.map((type) => (
              <Button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                variant={selectedType === type.name ? "default" : "outline"}
                className={`${
                  selectedType === type.name 
                    ? 'bg-purple-500 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Documentation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full"
                onClick={() => handleItemClick(item.url)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={getDifficultyColor(item.difficulty)}>
                      {item.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </CardTitle>
                  <p className="text-gray-300 text-sm mb-4">
                    {item.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.type === 'videos' && <Play className="w-3 h-3" />}
                      {item.type === 'api-docs' && <Code className="w-3 h-3" />}
                      {item.type === 'guides' && <Book className="w-3 h-3" />}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Quick Links</h2>
            <p className="text-gray-300">Popular documentation sections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'API Reference', icon: Code, url: '/docs/api' },
              { title: 'Video Tutorials', icon: Video, url: '/docs/videos' },
              { title: 'Download PDFs', icon: Download, url: '/docs/downloads' },
              { title: 'Support Center', icon: HelpCircle, url: '/support' }
            ].map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => console.log('Navigating to:', link.url)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <link.icon className="w-6 h-6" />
                    <span className="text-sm">{link.title}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 