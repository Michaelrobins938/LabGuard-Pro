'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Star,
  Award,
  Target,
  Zap,
  Shield,
  Brain,
  Microscope,
  Database,
  Globe,
  FileText,
  Play,
  Download,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaseStudiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedOutcome, setSelectedOutcome] = useState('all');

  const industries = [
    { name: 'all', label: 'All Industries' },
    { name: 'pharmaceutical', label: 'Pharmaceutical' },
    { name: 'biotechnology', label: 'Biotechnology' },
    { name: 'clinical', label: 'Clinical' },
    { name: 'research', label: 'Research' },
    { name: 'academic', label: 'Academic' },
    { name: 'diagnostic', label: 'Diagnostic' }
  ];

  const outcomes = [
    { name: 'all', label: 'All Outcomes' },
    { name: 'efficiency', label: 'Efficiency Gains' },
    { name: 'compliance', label: 'Compliance' },
    { name: 'cost-reduction', label: 'Cost Reduction' },
    { name: 'accuracy', label: 'Accuracy Improvement' },
    { name: 'automation', label: 'Automation' }
  ];

  const caseStudies = [
    {
      id: 1,
      title: 'Merck Research Labs: 85% Efficiency Gain',
      company: 'Merck Research Labs',
      industry: 'pharmaceutical',
      outcome: 'efficiency',
      description: 'How Merck Research Labs achieved 85% efficiency gains and 30% cost reductions through LabGuard Pro implementation.',
      results: [
        '85% improvement in laboratory efficiency',
        '30% reduction in operational costs',
        '50% faster experimental setup',
        '99.9% data accuracy rate'
      ],
      duration: '6 months',
      teamSize: '150+ researchers',
      rating: 5,
      icon: Building,
      tags: ['Efficiency', 'Cost Reduction', 'Pharmaceutical', 'Research']
    },
    {
      id: 2,
      title: 'Genentech: Streamlined Clinical Trials',
      company: 'Genentech',
      industry: 'biotechnology',
      outcome: 'automation',
      description: 'Genentech revolutionized their clinical trial management with automated workflows and real-time monitoring.',
      results: [
        '60% faster clinical trial setup',
        '40% reduction in data entry errors',
        'Real-time compliance monitoring',
        'Automated report generation'
      ],
      duration: '8 months',
      teamSize: '200+ staff',
      rating: 5,
      icon: Users,
      tags: ['Clinical Trials', 'Automation', 'Biotechnology', 'Compliance']
    },
    {
      id: 3,
      title: 'MIT Research Institute: AI-Powered Insights',
      company: 'MIT Research Institute',
      industry: 'academic',
      outcome: 'accuracy',
      description: 'MIT Research Institute leveraged AI-powered analytics to improve research outcomes and experimental accuracy.',
      results: [
        '95% improvement in experimental accuracy',
        '70% faster data analysis',
        'AI-powered predictive insights',
        'Enhanced collaboration tools'
      ],
      duration: '4 months',
      teamSize: '75+ researchers',
      rating: 5,
      icon: Brain,
      tags: ['AI', 'Research', 'Academic', 'Analytics']
    },
    {
      id: 4,
      title: 'Mayo Clinic: Diagnostic Excellence',
      company: 'Mayo Clinic',
      industry: 'clinical',
      outcome: 'compliance',
      description: 'Mayo Clinic achieved diagnostic excellence with comprehensive compliance management and quality control.',
      results: [
        '100% regulatory compliance',
        '99.9% diagnostic accuracy',
        'Streamlined quality control',
        'Enhanced patient safety'
      ],
      duration: '12 months',
      teamSize: '500+ staff',
      rating: 5,
      icon: Shield,
      tags: ['Clinical', 'Compliance', 'Diagnostic', 'Quality Control']
    },
    {
      id: 5,
      title: 'BioTech Innovations: Research Acceleration',
      company: 'BioTech Innovations',
      industry: 'biotechnology',
      outcome: 'efficiency',
      description: 'BioTech Innovations accelerated their research processes with advanced laboratory automation and data management.',
      results: [
        '75% faster experimental setup',
        '90% reduction in manual data entry',
        'Enhanced data security',
        'Improved collaboration'
      ],
      duration: '5 months',
      teamSize: '100+ researchers',
      rating: 5,
      icon: Zap,
      tags: ['Biotechnology', 'Automation', 'Research', 'Data Management']
    },
    {
      id: 6,
      title: 'Stanford Medical Center: Precision Medicine',
      company: 'Stanford Medical Center',
      industry: 'clinical',
      outcome: 'accuracy',
      description: 'Stanford Medical Center implemented precision medicine workflows with enhanced accuracy and patient outcomes.',
      results: [
        '98% improvement in diagnostic accuracy',
        '60% faster test results',
        'Enhanced patient outcomes',
        'Streamlined workflows'
      ],
      duration: '10 months',
      teamSize: '300+ staff',
      rating: 5,
      icon: Target,
      tags: ['Clinical', 'Precision Medicine', 'Diagnostic', 'Patient Care']
    }
  ];

  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = selectedIndustry === 'all' || study.industry === selectedIndustry;
    const matchesOutcome = selectedOutcome === 'all' || study.outcome === selectedOutcome;
    
    return matchesSearch && matchesIndustry && matchesOutcome;
  });

  const handleCaseStudyClick = (study: any) => {
    console.log('Opening case study:', study.title);
    alert(`Opening detailed case study: ${study.title}`);
  };

  const handleDownloadPDF = (study: any) => {
    console.log('Downloading PDF for:', study.title);
    alert(`Downloading PDF case study: ${study.title}`);
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
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Case Studies</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Customer{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Discover how leading laboratories and research institutions are transforming their operations with LabGuard Pro.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {industries.map((industry) => (
              <Button
                key={industry.name}
                onClick={() => setSelectedIndustry(industry.name)}
                variant={selectedIndustry === industry.name ? "default" : "outline"}
                className={`${
                  selectedIndustry === industry.name 
                    ? 'bg-blue-500 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {industry.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {outcomes.map((outcome) => (
              <Button
                key={outcome.name}
                onClick={() => setSelectedOutcome(outcome.name)}
                variant={selectedOutcome === outcome.name ? "default" : "outline"}
                className={`${
                  selectedOutcome === outcome.name 
                    ? 'bg-purple-500 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {outcome.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {filteredCaseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <study.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(study.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white mb-2">
                    {study.title}
                  </CardTitle>
                  <p className="text-gray-300 text-sm mb-4">
                    {study.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{study.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{study.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{study.teamSize}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <h4 className="text-white font-semibold mb-2">Key Results:</h4>
                    {study.results.map((result, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 text-sm">{result}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {study.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleCaseStudyClick(study)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Read Full Case Study
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDownloadPDF(study)}
                      className="border-white/20 text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Customer Impact</h2>
            <p className="text-gray-300">Proven results across industries</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "500+", label: "Customers", description: "Served worldwide" },
              { metric: "85%", label: "Avg. Efficiency", description: "Improvement" },
              { metric: "99.9%", label: "Accuracy Rate", description: "Data accuracy" },
              { metric: "4.9/5", label: "Rating", description: "Customer satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.metric}</div>
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 