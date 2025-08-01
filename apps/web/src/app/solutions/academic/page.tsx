'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Shield, 
  Database, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Settings,
  Target,
  Beaker,
  TestTube,
  Microscope,
  Brain,
  Calendar,
  Globe,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AcademicInstitutionsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [trialForm, setTrialForm] = useState({
    name: '',
    email: '',
    institution: '',
    department: '',
    researchArea: '',
    message: ''
  });

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Academic trial form submitted:', trialForm);
    alert('Thank you! We\'ll contact you within 24 hours to set up your academic institution trial.');
  };

  const handleInputChange = (field: string, value: string) => {
    setTrialForm(prev => ({ ...prev, [field]: value }));
  };

  const academicFeatures = [
    {
      icon: GraduationCap,
      title: "Educational Tools",
      description: "Comprehensive tools for teaching laboratory techniques and research methods",
      benefits: ["Student training modules", "Virtual labs", "Assessment tools", "Progress tracking"]
    },
    {
      icon: BookOpen,
      title: "Research Management",
      description: "Streamlined research project management for academic laboratories",
      benefits: ["Project tracking", "Collaboration tools", "Publication support", "Grant management"]
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Secure and organized data storage for academic research and teaching",
      benefits: ["Research data storage", "Student records", "Publication data", "Collaborative access"]
    },
    {
      icon: Shield,
      title: "Compliance & Safety",
      description: "Built-in safety protocols and compliance tools for academic environments",
      benefits: ["Safety training", "Compliance tracking", "Incident reporting", "Audit readiness"]
    }
  ];

  const academicMetrics = [
    { metric: "500+", label: "Institutions", description: "Academic institutions served" },
    { metric: "10,000+", label: "Students", description: "Students trained annually" },
    { metric: "95%", label: "Satisfaction", description: "Student satisfaction rate" },
    { metric: "24/7", label: "Support", description: "Academic support available" }
  ];

  const institutionTypes = [
    "University",
    "College",
    "Research Institute",
    "Medical School",
    "Community College",
    "Technical Institute",
    "Graduate School",
    "Other"
  ];

  const departments = [
    "Biology",
    "Chemistry",
    "Physics",
    "Engineering",
    "Medicine",
    "Pharmacy",
    "Environmental Science",
    "Computer Science",
    "Mathematics",
    "Other"
  ];

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
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">Academic Institutions</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Academic{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Institutions
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Comprehensive laboratory management solutions designed for academic institutions. 
            Enhance teaching, research, and learning with our advanced educational tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
              🎓 Education
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
              🔬 Research
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              👥 Collaboration
            </Badge>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid lg:grid-cols-2 gap-12 mb-16"
        >
          {academicFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {feature.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Academic Impact</h2>
            <p className="text-xl text-gray-300">Proven results from academic institutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicMetrics.map((metric, index) => (
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
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{metric.metric}</div>
                <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trial Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Start Academic Trial</CardTitle>
              <p className="text-gray-300">Get started with a free 30-day trial for your academic institution</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrialSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={trialForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={trialForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      value={trialForm.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Institution Type</option>
                      {institutionTypes.map((type) => (
                        <option key={type} value={type} className="bg-slate-800 text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      value={trialForm.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept} className="bg-slate-800 text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input
                  placeholder="Research Area (e.g., Molecular Biology, Chemistry)"
                  value={trialForm.researchArea}
                  onChange={(e) => handleInputChange('researchArea', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Textarea
                  placeholder="Tell us about your academic needs and goals..."
                  value={trialForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Academic Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 