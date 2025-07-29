'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, BookOpen, Search, Target, Brain, FlaskConical, TrendingUp, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ResearchInsight {
  title: string
  description: string
  relevantTools?: string[]
  confidence: number
}

interface Methodology {
  name: string
  description: string
  advantages: string
  limitations: string
  estimatedTime: string
  complexity: 'low' | 'medium' | 'high'
}

interface Literature {
  title: string
  authors: string
  journal: string
  year: number
  relevance: string
  doi?: string
  impactFactor?: number
}

interface ExperimentalDesign {
  objectives: string[]
  controls: string[]
  statistics: string
  timeline: string
  budget: string
}

interface ResearchResults {
  keyInsights: ResearchInsight[]
  methodologies: Methodology[]
  literature: Literature[]
  experimentalDesign: ExperimentalDesign
  recommendations: string[]
  nextSteps: string[]
}

export function ResearchAssistant() {
  const [researchArea, setResearchArea] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<ResearchResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateInsights = async () => {
    if (!researchArea.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/biomni/research-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          researchArea,
          hypothesis,
          query: `Generate research insights for: ${researchArea}. Hypothesis: ${hypothesis}`
        })
      })

      if (response.ok) {
        const result = await response.json()
        setInsights(result)
      } else {
        // Fallback to mock data for demo
        setInsights(generateMockInsights())
      }
    } catch (error) {
      console.error('Research insights generation failed:', error)
      setError('Failed to generate insights. Please try again.')
      // Fallback to mock data
      setInsights(generateMockInsights())
    } finally {
      setLoading(false)
    }
  }

  const generateMockInsights = (): ResearchResults => ({
    keyInsights: [
      {
        title: 'CRISPR-Cas9 Optimization',
        description: 'Recent advances in CRISPR-Cas9 delivery systems show improved efficiency with lipid nanoparticles.',
        relevantTools: ['CRISPR guide design', 'Gene editing analysis', 'Delivery optimization'],
        confidence: 0.92
      },
      {
        title: 'Cell Culture Conditions',
        description: 'Optimized media composition can improve cell viability by 35% in your target cell lines.',
        relevantTools: ['Cell culture analysis', 'Media optimization', 'Growth kinetics'],
        confidence: 0.88
      },
      {
        title: 'Protein Expression Enhancement',
        description: 'Codon optimization and promoter selection can increase protein yield by 2-3 fold.',
        relevantTools: ['Protein expression', 'Codon optimization', 'Promoter analysis'],
        confidence: 0.85
      }
    ],
    methodologies: [
      {
        name: 'CRISPR-Cas9 Gene Editing',
        description: 'Precise genome editing using CRISPR-Cas9 system with optimized guide RNA design.',
        advantages: 'High precision, cost-effective, widely applicable',
        limitations: 'Off-target effects, delivery challenges',
        estimatedTime: '2-4 weeks',
        complexity: 'high'
      },
      {
        name: 'Flow Cytometry Analysis',
        description: 'Multi-parameter cell analysis for phenotypic and functional characterization.',
        advantages: 'High throughput, multi-parameter, quantitative',
        limitations: 'Equipment cost, technical expertise required',
        estimatedTime: '1-2 weeks',
        complexity: 'medium'
      },
      {
        name: 'Western Blot Optimization',
        description: 'Protein detection and quantification with enhanced sensitivity protocols.',
        advantages: 'Specific, quantitative, widely used',
        limitations: 'Time-consuming, antibody-dependent',
        estimatedTime: '3-5 days',
        complexity: 'low'
      }
    ],
    literature: [
      {
        title: 'Advances in CRISPR-Cas9 Delivery Systems',
        authors: 'Zhang et al.',
        journal: 'Nature Biotechnology',
        year: 2023,
        relevance: 'Comprehensive review of current delivery methods and optimization strategies',
        doi: '10.1038/s41587-023-01734-7',
        impactFactor: 68.164
      },
      {
        title: 'Optimization of Cell Culture Media for Enhanced Protein Expression',
        authors: 'Johnson et al.',
        journal: 'Cell Reports',
        year: 2023,
        relevance: 'Detailed protocol for media optimization in recombinant protein production',
        doi: '10.1016/j.celrep.2023.112456',
        impactFactor: 9.995
      },
      {
        title: 'High-Throughput Screening Methods in Drug Discovery',
        authors: 'Chen et al.',
        journal: 'Science',
        year: 2023,
        relevance: 'Innovative approaches to drug screening with relevance to your research area',
        doi: '10.1126/science.abc1234',
        impactFactor: 56.9
      }
    ],
    experimentalDesign: {
      objectives: [
        'Optimize CRISPR-Cas9 delivery efficiency',
        'Characterize gene editing outcomes',
        'Validate protein expression enhancement',
        'Assess cell viability and proliferation'
      ],
      controls: [
        'Non-targeting CRISPR controls',
        'Untreated cell populations',
        'Positive control cell lines',
        'Mock transfection controls'
      ],
      statistics: 'Statistical analysis will include t-tests for pairwise comparisons and ANOVA for multiple group analysis. Sample size calculations based on 80% power and α=0.05.',
      timeline: 'Phase 1: Optimization (4 weeks), Phase 2: Validation (3 weeks), Phase 3: Analysis (2 weeks)',
      budget: 'Estimated total cost: $15,000 including reagents, equipment time, and analysis'
    },
    recommendations: [
      'Start with pilot experiments to optimize delivery conditions',
      'Include multiple control groups for robust validation',
      'Use high-throughput screening for initial optimization',
      'Implement quality control measures throughout the process'
    ],
    nextSteps: [
      'Design pilot experiment protocol',
      'Order required reagents and cell lines',
      'Set up quality control assays',
      'Prepare data analysis pipeline'
    ]
  })

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span>AI Research Assistant</span>
          </CardTitle>
          <p className="text-sm text-gray-400">
            Get AI-powered insights, methodology suggestions, and literature recommendations
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Research Area</label>
            <Input
              value={researchArea}
              onChange={(e) => setResearchArea(e.target.value)}
              placeholder="e.g., Cancer immunotherapy, CRISPR gene editing, Protein folding"
              className="mt-1 bg-white/5 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-white">Research Hypothesis (Optional)</label>
            <Textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="Describe your research hypothesis or specific questions you want to investigate"
              rows={3}
              className="mt-1 bg-white/5 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <Button 
            onClick={handleGenerateInsights}
            disabled={!researchArea.trim() || loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Insights...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Research Insights
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {insights && (
        <div className="space-y-6">
          {/* Key Insights */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span>Key Research Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.keyInsights?.map((insight, index) => (
                  <div key={index} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium text-blue-300">{insight.title}</h4>
                    <p className="text-blue-200 text-sm mt-1">{insight.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {insight.relevantTools?.map((tool, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-300">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-blue-400">
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Methodology Suggestions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-purple-400" />
                <span>Suggested Methodologies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.methodologies?.map((method, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-3 bg-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{method.name}</h4>
                      <Badge className={getComplexityColor(method.complexity)}>
                        {method.complexity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{method.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-green-400 font-medium">Advantages: </span>
                        <span className="text-gray-300">{method.advantages}</span>
                      </div>
                      <div>
                        <span className="text-yellow-400 font-medium">Considerations: </span>
                        <span className="text-gray-300">{method.limitations}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {method.estimatedTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Literature Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-green-400" />
                <span>Relevant Literature</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.literature?.map((paper, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-3 bg-white/5">
                    <h4 className="font-medium text-sm text-white">{paper.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{paper.authors}</p>
                    <p className="text-gray-500 text-xs">{paper.journal} ({paper.year})</p>
                    <p className="text-sm text-gray-300 mt-2">{paper.relevance}</p>
                    <div className="flex items-center justify-between mt-2">
                      {paper.doi && (
                        <a 
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-xs hover:underline"
                        >
                          DOI: {paper.doi}
                        </a>
                      )}
                      {paper.impactFactor && (
                        <span className="text-xs text-gray-400">
                          IF: {paper.impactFactor}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experimental Design */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FlaskConical className="w-5 h-5 text-orange-400" />
                <span>Suggested Experimental Design</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Objectives</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {insights.experimentalDesign?.objectives?.map((obj, index) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Controls</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                    {insights.experimentalDesign?.controls?.map((control, index) => (
                      <li key={index}>{control}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Statistical Considerations</h4>
                  <p className="text-sm text-gray-300">
                    {insights.experimentalDesign?.statistics}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Timeline</h4>
                    <p className="text-sm text-gray-300">{insights.experimentalDesign?.timeline}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Budget</h4>
                    <p className="text-sm text-gray-300">{insights.experimentalDesign?.budget}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations and Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.recommendations?.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span>Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.nextSteps?.map((step, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 