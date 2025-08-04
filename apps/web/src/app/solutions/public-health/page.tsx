'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Database, 
  FileText, 
  Upload, 
  Download, 
  Activity, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp,
  Globe,
  BarChart3,
  Settings,
  AlertTriangle,
  Calendar,
  Target,
  BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicHealthPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    organization: '',
    county: '',
    currentProcess: '',
    message: ''
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo form submitted:', demoForm);
    alert('Thank you! We\'ll contact you within 24 hours to set up your public health surveillance demo.');
  };

  const handleInputChange = (field: string, value: string) => {
    setDemoForm(prev => ({ ...prev, [field]: value }));
  };

  const surveillanceFeatures = [
    {
      icon: Database,
      title: "LabWare LIMS Integration",
      description: "Seamless data extraction from LabWare 7.2 with automated sample processing",
      benefits: ["Real-time data sync", "Automated sample extraction", "Error-free data transfer", "Historical data access"]
    },
    {
      icon: Upload,
      title: "Texas NEDSS Automation",
      description: "Automate the 6-screen Texas NEDSS submission process with web automation",
      benefits: ["20-minute timeout handling", "Batch processing", "Error recovery", "Session management"]
    },
    {
      icon: FileText,
      title: "ArboNET Upload Automation",
      description: "Perfect format compliance for CDC ArboNET with 47-field CSV generation",
      benefits: ["Species standardization", "Geographic coordinates", "Date formatting", "Upload validation"]
    },
    {
      icon: BarChart3,
      title: "Automated County Reports",
      description: "Generate 12 different county report templates with dynamic data population",
      benefits: ["County-specific templates", "PDF generation", "Email distribution", "Historical comparisons"]
    }
  ];

  const timeSavings = [
    { metric: "5hrs → 15min", label: "Friday Reports", description: "Automated weekly report generation" },
    { metric: "2hrs → 0min", label: "Daily Data Entry", description: "Eliminated manual data entry" },
    { metric: "2hrs → 0min", label: "Monthly Compliance", description: "Automated equipment monitoring" },
    { metric: "15hrs/week", label: "Total Saved", description: "Cumulative time savings" }
  ];

  const integrationSystems = [
    {
      name: "LabWare LIMS 7.2",
      type: "Database Integration",
      status: "Connected",
      icon: Database
    },
    {
      name: "Texas NEDSS",
      type: "Web Automation",
      status: "Automated",
      icon: Upload
    },
    {
      name: "CDC ArboNET",
      type: "API Upload",
      status: "Connected",
      icon: FileText
    },
    {
      name: "SensoScientific",
      type: "Equipment API",
      status: "Monitoring",
      icon: Activity
    },
    {
      name: "ArcGIS",
      type: "Mapping API",
      status: "Connected",
      icon: MapPin
    },
    {
      name: "VWR Data Loggers",
      type: "File Parsing",
      status: "Automated",
      icon: Download
    }
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
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Public Health Surveillance</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Automated{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Surveillance
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Transform public health laboratories with automated data integration, 
            multi-system synchronization, and intelligent reporting. Save 15+ hours per week.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
              🧬 LabWare Integration
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
              📊 NEDSS Automation
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              🗺️ ArboNET Upload
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-4 py-2">
              📋 County Reports
            </Badge>
          </div>
        </motion.div>

        {/* Time Savings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Measurable Impact</h2>
            <p className="text-xl text-gray-300">Proven time savings for public health laboratories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeSavings.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">{metric.metric}</div>
                <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-12 mb-16"
        >
          {surveillanceFeatures.map((feature, index) => (
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

        {/* System Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">System Integrations</h2>
            <p className="text-xl text-gray-300">Seamless connectivity with existing public health infrastructure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrationSystems.map((system, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                    <system.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{system.name}</h3>
                    <p className="text-sm text-gray-400">{system.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={`${
                    system.status === 'Connected' || system.status === 'Automated' || system.status === 'Monitoring'
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {system.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demo Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Request Public Health Demo</CardTitle>
              <p className="text-gray-300">Get started with automated surveillance for your public health laboratory</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={demoForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={demoForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <Input
                  placeholder="Organization"
                  value={demoForm.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Input
                  placeholder="County (e.g., Tarrant, Dallas, Denton)"
                  value={demoForm.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Input
                  placeholder="Current Process (e.g., Manual Friday reports, Excel data entry)"
                  value={demoForm.currentProcess}
                  onChange={(e) => handleInputChange('currentProcess', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                <Textarea
                  placeholder="Tell us about your surveillance needs and current challenges..."
                  value={demoForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Request Public Health Demo
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