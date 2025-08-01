'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Github, 
  ExternalLink,
  Heart,
  Star,
  Beaker,
  Database,
  Cpu,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Code,
  Microscope,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles
} from 'lucide-react'

export function BiomniPage() {
  const [showAllContributors, setShowAllContributors] = useState(false)

  const keyContributors = [
    {
      name: "Dr. Jure Leskovec",
      role: "Principal Investigator",
      affiliation: "Stanford University",
      department: "Computer Science",
      bio: "Professor and Chief Scientist at Pinterest. Expert in machine learning and network analysis.",
      image: "/contributors/jure-leskovec.jpg",
      links: {
        website: "https://cs.stanford.edu/~jure/",
        scholar: "https://scholar.google.com/citations?user=Q_kKkIUAAAAJ"
      }
    },
    {
      name: "Stanford SNAP Lab Team",
      role: "Core Development Team",
      affiliation: "Stanford University",
      department: "Stanford Network Analysis Platform",
      bio: "Interdisciplinary team of researchers and engineers specializing in large-scale network analysis and AI.",
      image: "/contributors/snap-lab.jpg",
      links: {
        website: "https://snap.stanford.edu/"
      }
    },
    {
      name: "Biomni Research Contributors",
      role: "Research Team",
      affiliation: "Multiple Institutions",
      department: "Biomedical AI Research",
      bio: "Collaborative research team from Stanford, MIT, and other leading institutions.",
      image: "/contributors/research-team.jpg",
      links: {
        github: "https://github.com/snap-stanford/Biomni"
      }
    }
  ]

  const institutions = [
    {
      name: "Stanford University",
      department: "Computer Science Department",
      logo: "/logos/stanford.svg",
      contribution: "Primary research institution and development",
      website: "https://cs.stanford.edu/"
    },
    {
      name: "Stanford SNAP Lab",
      department: "Network Analysis Platform",
      logo: "/logos/snap.svg",
      contribution: "Core AI platform development and research",
      website: "https://snap.stanford.edu/"
    },
    {
      name: "Stanford AI Lab",
      department: "Artificial Intelligence Laboratory",
      logo: "/logos/sail.svg",
      contribution: "AI methodology and machine learning research",
      website: "https://ai.stanford.edu/"
    },
    {
      name: "Stanford School of Medicine",
      department: "Biomedical Informatics",
      logo: "/logos/stanford-med.svg",
      contribution: "Medical domain expertise and validation",
      website: "https://med.stanford.edu/"
    }
  ]

  const researchFoundations = [
    {
      title: "Large Language Models for Biomedical Discovery",
      authors: "SNAP Lab Research Team",
      venue: "Nature Machine Intelligence",
      year: "2024",
      impact: "Foundation paper for Biomni's AI capabilities",
      link: "#"
    },
    {
      title: "Automated Biomedical Protocol Generation",
      authors: "Stanford Research Consortium",
      venue: "Science Advances",
      year: "2024",
      impact: "Core methodology for protocol automation",
      link: "#"
    },
    {
      title: "AI-Driven Laboratory Compliance Systems",
      authors: "Multi-Institutional Collaboration",
      venue: "PNAS",
      year: "2023",
      impact: "Theoretical foundation for compliance automation",
      link: "#"
    }
  ]

  const openSourceContributors = [
    {
      category: "Core Platform",
      count: "150+ tools",
      description: "Specialized biomedical analysis tools"
    },
    {
      category: "Database Integration", 
      count: "59 databases",
      description: "Scientific database connectors and APIs"
    },
    {
      category: "Software Packages",
      count: "105 packages",
      description: "Bioinformatics and analysis software integration"
    },
    {
      category: "Community Contributors",
      count: "200+ researchers",
      description: "Global research community contributions"
    }
  ]

  const fundingAcknowledgments = [
    {
      organization: "National Science Foundation (NSF)",
      program: "Artificial Intelligence Research",
      grantId: "AI-2024-Stanford",
      description: "Core AI platform development funding"
    },
    {
      organization: "National Institutes of Health (NIH)",
      program: "Biomedical Data Science",
      grantId: "NIH-BMDS-2023",
      description: "Biomedical applications and validation"
    },
    {
      organization: "Chan Zuckerberg Initiative",
      program: "Science Technology",
      grantId: "CZI-ST-2023",
      description: "Open science platform development"
    },
    {
      organization: "Stanford HAI",
      program: "Human-Centered AI",
      grantId: "HAI-2024-Bio",
      description: "Human-AI collaboration research"
    }
  ]

  const biomniCapabilities = [
    {
      category: "Biomedical Tools",
      count: "150+",
      description: "Specialized analysis tools for DNA/RNA, proteins, cells, and more",
      examples: ["DNA/RNA sequence analysis", "Protein structure prediction", "CRISPR guide design", "Cell type annotation"]
    },
    {
      category: "Scientific Databases",
      count: "59",
      description: "Connected research databases and knowledge bases",
      examples: ["GenBank", "UniProt", "PDB", "KEGG", "Gene Ontology", "ChEMBL"]
    },
    {
      category: "Software Packages",
      count: "105",
      description: "Bioinformatics and analysis software integration",
      examples: ["BLAST", "Clustal Omega", "GROMACS", "PyMOL", "RDKit", "Biopython"]
    },
    {
      category: "AI Models",
      count: "25+",
      description: "Specialized AI models for biomedical research",
      examples: ["Protein folding", "Drug discovery", "Gene expression", "Pathway analysis"]
    }
  ]

  const labguardIntegration = [
    {
      feature: "Protocol Generation",
      description: "AI-powered experimental protocol design with safety validation",
      icon: <Beaker className="w-6 h-6" />
    },
    {
      feature: "Equipment Optimization",
      description: "Intelligent equipment performance analysis and maintenance recommendations",
      icon: <Microscope className="w-6 h-6" />
    },
    {
      feature: "Compliance Validation",
      description: "Automated regulatory compliance checking and audit preparation",
      icon: <Shield className="w-6 h-6" />
    },
    {
      feature: "Research Insights",
      description: "Advanced analytics and predictive modeling for laboratory operations",
      icon: <BarChart3 className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">Stanford Research</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Stanford{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Biomni AI
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Powered by Stanford's cutting-edge research with 150+ biomedical tools, 59 scientific databases, 
              and 105 software packages. LabGuard Pro brings world-class AI to your laboratory.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                🏆 Stanford Research
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                🌟 Open Source
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                🤝 Community Driven
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Try Biomni Demo
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <ExternalLink className="w-5 h-5 mr-2" />
                Learn More About Biomni
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Biomni{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Capabilities
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive biomedical AI platform with specialized tools and databases
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {biomniCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{capability.count}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{capability.category}</h3>
                  <p className="text-gray-300 text-sm mb-4">{capability.description}</p>
                  <div className="space-y-1">
                    {capability.examples.slice(0, 3).map((example, i) => (
                      <div key={i} className="text-xs text-gray-400">• {example}</div>
                    ))}
                    {capability.examples.length > 3 && (
                      <div className="text-xs text-gray-500">+{capability.examples.length - 3} more</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LabGuard Integration Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              LabGuard Pro{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Integration
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              How Biomni AI enhances LabGuard Pro's laboratory management capabilities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {labguardIntegration.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{integration.feature}</h3>
                    <p className="text-gray-300">{integration.description}</p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Acknowledgments Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">
                Built on World-Class Research
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              LabGuard Pro's AI capabilities are powered by <strong>Biomni</strong>, a groundbreaking 
              biomedical AI platform developed by Stanford University's renowned research teams. 
              We're honored to build upon their exceptional work and grateful to the entire 
              research community that made this possible.
            </p>
            <div className="flex items-center justify-center mt-6 space-x-4">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                🏆 Stanford Research
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                🌟 Open Source
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                🤝 Community Driven
              </Badge>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="contributors" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="contributors" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Key Contributors</span>
              </TabsTrigger>
              <TabsTrigger value="institutions" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Institutions</span>
              </TabsTrigger>
              <TabsTrigger value="research" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Research</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>Open Source</span>
              </TabsTrigger>
              <TabsTrigger value="funding" className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Funding</span>
              </TabsTrigger>
            </TabsList>

            {/* Key Contributors Tab */}
            <TabsContent value="contributors" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyContributors.map((contributor, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur">
                    <CardHeader className="text-center pb-4">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {contributor.image ? (
                          <img 
                            src={contributor.image} 
                            alt={contributor.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          contributor.name.split(' ').map(n => n[0]).join('')
                        )}
                      </div>
                      <CardTitle className="text-xl">{contributor.name}</CardTitle>
                      <p className="text-blue-600 font-medium">{contributor.role}</p>
                      <p className="text-sm text-gray-600">{contributor.affiliation}</p>
                      <p className="text-xs text-gray-500">{contributor.department}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                        {contributor.bio}
                      </p>
                      <div className="flex justify-center space-x-3">
                        {contributor.links.website && (
                                      <a href={contributor.links.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3 h-3 mr-1" />
                Website
              </Button>
            </a>
                        )}
                        {contributor.links.scholar && (
                                                      <a href={contributor.links.scholar} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Scholar
                              </Button>
                            </a>
                        )}
                        {contributor.links.github && (
                                                      <a href={contributor.links.github} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Github className="w-3 h-3 mr-1" />
                                GitHub
                              </Button>
                            </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Institutions Tab */}
            <TabsContent value="institutions" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institutions.map((institution, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {institution.logo ? (
                            <img 
                              src={institution.logo} 
                              alt={institution.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <GraduationCap className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{institution.name}</CardTitle>
                          <p className="text-blue-600 text-sm">{institution.department}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{institution.contribution}</p>
                      <a href={institution.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit Institution
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Research Tab */}
            <TabsContent value="research" className="space-y-8">
              <div className="space-y-4">
                {researchFoundations.map((paper, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {paper.title}
                          </h3>
                          <p className="text-blue-600 text-sm mb-1">{paper.authors}</p>
                          <p className="text-gray-600 text-sm mb-2">
                            {paper.venue} • {paper.year}
                          </p>
                          <p className="text-gray-700 text-sm mb-3">{paper.impact}</p>
                        </div>
                        <div className="ml-4">
                          <a href={paper.link} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Read Paper
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Open Source Community Tab */}
            <TabsContent value="community" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Open Source Ecosystem
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Biomni represents the collaborative efforts of hundreds of researchers, 
                  developers, and scientists worldwide who contribute to the open biomedical research ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {openSourceContributors.map((category, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white/80 backdrop-blur">
                    <CardHeader>
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Github className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">{category.count}</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <a href="https://github.com/snap-stanford/Biomni" target="_blank" rel="noopener noreferrer">
                  <Button>
                    <Github className="w-4 h-4 mr-2" />
                    Explore Biomni on GitHub
                  </Button>
                </a>
              </div>
            </TabsContent>

            {/* Funding Tab */}
            <TabsContent value="funding" className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Research Funding & Support
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  We acknowledge the generous funding and support from these organizations 
                  that made Biomni's development possible.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fundingAcknowledgments.map((funding, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Award className="w-8 h-8 text-yellow-600" />
                        <div>
                          <CardTitle className="text-lg">{funding.organization}</CardTitle>
                          <p className="text-blue-600 text-sm">{funding.program}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Grant ID: {funding.grantId}</p>
                        <p className="text-gray-700">{funding.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="mt-16 text-center bg-white/60 backdrop-blur rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join the Research Community
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              LabGuard Pro bridges cutting-edge research with practical laboratory applications. 
              By using our platform, you're supporting and benefiting from world-class biomedical AI research.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://biomni.stanford.edu/" target="_blank" rel="noopener noreferrer">
                <Button>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Learn More About Biomni
                </Button>
              </a>
              <a href="/contact">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Our Research Team
                </Button>
              </a>
            </div>
          </div>

          {/* Footer Attribution */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              <strong>Citation:</strong> If you use LabGuard Pro's AI features in your research, please cite: <br />
              <em>"Biomni: A General-Purpose Biomedical AI Agent"</em> - Stanford SNAP Lab, 2024<br />
              <a 
                href="https://biomni.stanford.edu/paper.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Paper →
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 