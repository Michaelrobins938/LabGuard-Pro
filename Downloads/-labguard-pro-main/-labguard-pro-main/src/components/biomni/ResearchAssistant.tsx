'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Lightbulb, 
  BookOpen, 
  Search, 
  Target, 
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
  X,
  FileText,
  ExternalLink,
  Star,
  Brain,
  Microscope,
  FlaskConical,
  Dna,
  Activity
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ResearchAssistantProps {
  onInsightsGenerated?: (insights: ResearchInsights) => void
  onProjectCreated?: (project: ResearchProject) => void
}

interface ResearchInsights {
  id: string
  researchArea: string
  hypothesis?: string
  keyInsights: Insight[]
  methodologies: Methodology[]
  literature: LiteratureReference[]
  experimentalDesign: ExperimentalDesign
  riskAssessment: RiskAssessment
  resourceRequirements: ResourceRequirements
  timeline: TimelineItem[]
  collaborationOpportunities: string[]
  fundingOpportunities: string[]
  confidence: number
  generatedAt: string
}

interface Insight {
  title: string
  description: string
  importance: 'high' | 'medium' | 'low'
  relevantTools: string[]
  actionable: boolean
  evidence: string[]
}

interface Methodology {
  name: string
  description: string
  advantages: string[]
  limitations: string[]
  cost: 'low' | 'medium' | 'high'
  complexity: 'low' | 'medium' | 'high'
  timeRequired: string
  equipment: string[]
  expertise: string[]
}

interface LiteratureReference {
  title: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  pmid?: string
  relevanceScore: number
  summary: string
  keyFindings: string[]
  methodology: string
  limitations: string[]
}

interface ExperimentalDesign {
  objectives: string[]
  hypotheses: string[]
  controls: string[]
  variables: {
    independent: string[]
    dependent: string[]
    confounding: string[]
  }
  sampleSize: {
    recommended: number
    justification: string
    powerAnalysis: string
  }
  statisticalMethods: string[]
  validationStrategy: string[]
}

interface RiskAssessment {
  technicalRisks: Risk[]
  resourceRisks: Risk[]
  timelineRisks: Risk[]
  mitigationStrategies: string[]
  contingencyPlans: string[]
}

interface Risk {
  description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  mitigation: string[]
}

interface ResourceRequirements {
  personnel: PersonnelRequirement[]
  equipment: EquipmentRequirement[]
  materials: MaterialRequirement[]
  infrastructure: string[]
  estimatedCost: {
    personnel: number
    equipment: number
    materials: number
    overhead: number
    total: number
  }
}

interface PersonnelRequirement {
  role: string
  expertise: string[]
  timeCommitment: string
  cost: number
}

interface EquipmentRequirement {
  name: string
  purpose: string
  cost: number
  availability: 'available' | 'needs_purchase' | 'needs_access'
  alternatives: string[]
}

interface MaterialRequirement {
  category: string
  items: string[]
  estimatedCost: number
  suppliers: string[]
}

interface TimelineItem {
  phase: string
  duration: string
  dependencies: string[]
  deliverables: string[]
  milestones: string[]
  risks: string[]
}

interface ResearchProject {
  id: string
  name: string
  description: string
  hypothesis: string
  objectives: string[]
  methodology: string[]
  timeline: string
  budget: number
  status: 'planning' | 'approved' | 'in_progress' | 'completed'
  progress: number
}

export function ResearchAssistant({ onInsightsGenerated, onProjectCreated }: ResearchAssistantProps) {
  const [researchArea, setResearchArea] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [objectives, setObjectives] = useState<string[]>([])
  const [newObjective, setNewObjective] = useState('')
  const [researchType, setResearchType] = useState<'basic' | 'applied' | 'translational' | 'clinical'>('basic')
  const [domain, setDomain] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('input')
  const [insights, setInsights] = useState<ResearchInsights | null>(null)
  const [savedProjects, setSavedProjects] = useState<ResearchProject[]>([])

  const researchDomains = [
    'Molecular Biology',
    'Cell Biology',
    'Genetics',
    'Biochemistry',
    'Immunology',
    'Microbiology',
    'Neuroscience',
    'Cancer Research',
    'Drug Discovery',
    'Bioengineering',
    'Bioinformatics',
    'Systems Biology',
    'Structural Biology',
    'Pharmacology',
    'Toxicology',
    'Environmental Biology',
    'Marine Biology',
    'Plant Biology',
    'Developmental Biology',
    'Evolutionary Biology'
  ]

  const timeframeOptions = [
    '3 months',
    '6 months',
    '1 year',
    '2 years',
    '3 years',
    '5 years',
    'Long-term (>5 years)'
  ]

  const budgetRanges = [
    'Under $10K',
    '$10K - $50K',
    '$50K - $100K',
    '$100K - $500K',
    '$500K - $1M',
    'Over $1M'
  ]

  useEffect(() => {
    // Load saved projects on component mount
    loadSavedProjects()
  }, [])

  const loadSavedProjects = async () => {
    try {
      const response = await fetch('/api/research/projects')
      if (response.ok) {
        const projects = await response.json()
        setSavedProjects(projects)
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const handleAddObjective = () => {
    if (newObjective.trim() && !objectives.includes(newObjective.trim())) {
      setObjectives([...objectives, newObjective.trim()])
      setNewObjective('')
    }
  }

  const handleRemoveObjective = (objective: string) => {
    setObjectives(objectives.filter(obj => obj !== objective))
  }

  const validateInputs = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!researchArea.trim()) {
      errors.push('Research area is required')
    }

    if (researchArea.trim().length < 10) {
      errors.push('Research area should be more descriptive (at least 10 characters)')
    }

    if (!domain) {
      errors.push('Research domain must be selected')
    }

    if (objectives.length === 0) {
      errors.push('At least one research objective is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const handleGenerateInsights = async () => {
    const validation = validateInputs()
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/biomni/research-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          researchArea,
          hypothesis,
          objectives,
          researchType,
          domain,
          timeframe,
          budget,
          context: 'research_planning'
        })
      })

      if (!response.ok) {
        throw new Error(`Research insights generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Transform the response into our insights format
      const researchInsights: ResearchInsights = {
        id: result.id || `insights_${Date.now()}`,
        researchArea,
        hypothesis,
        keyInsights: result.insights?.map((insight: any, index: number) => ({
          title: insight.title || `Key Insight ${index + 1}`,
          description: insight.description || insight,
          importance: insight.importance || 'medium',
          relevantTools: insight.tools || [],
          actionable: insight.actionable ?? true,
          evidence: insight.evidence || []
        })) || [],
        methodologies: result.methodologies || [],
        literature: result.literature || [],
        experimentalDesign: result.experimentalDesign || {
          objectives: objectives,
          hypotheses: hypothesis ? [hypothesis] : [],
          controls: [],
          variables: { independent: [], dependent: [], confounding: [] },
          sampleSize: { recommended: 30, justification: 'Standard minimum', powerAnalysis: 'TBD' },
          statisticalMethods: [],
          validationStrategy: []
        },
        riskAssessment: result.riskAssessment || {
          technicalRisks: [],
          resourceRisks: [],
          timelineRisks: [],
          mitigationStrategies: [],
          contingencyPlans: []
        },
        resourceRequirements: result.resourceRequirements || {
          personnel: [],
          equipment: [],
          materials: [],
          infrastructure: [],
          estimatedCost: { personnel: 0, equipment: 0, materials: 0, overhead: 0, total: 0 }
        },
        timeline: result.timeline || [],
        collaborationOpportunities: result.collaborationOpportunities || [],
        fundingOpportunities: result.fundingOpportunities || [],
        confidence: result.confidence || 0.8,
        generatedAt: new Date().toISOString()
      }

      setInsights(researchInsights)
      setActiveTab('insights')
      
      if (onInsightsGenerated) {
        onInsightsGenerated(researchInsights)
      }

      toast({
        title: "Research Insights Generated",
        description: `Generated comprehensive insights with ${Math.round(researchInsights.confidence * 100)}% confidence`,
        variant: "default"
      })

    } catch (error) {
      console.error('Research insights generation failed:', error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate research insights',
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!insights) return

    try {
      const project: ResearchProject = {
        id: `project_${Date.now()}`,
        name: `${insights.researchArea} Research Project`,
        description: insights.researchArea,
        hypothesis: insights.hypothesis || '',
        objectives,
        methodology: insights.methodologies.map(m => m.name),
        timeline: timeframe,
        budget: parseFloat(budget.replace(/[^\d.]/g, '')) || 0,
        status: 'planning',
        progress: 0
      }

      const response = await fetch('/api/research/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      setSavedProjects([...savedProjects, project])
      
      if (onProjectCreated) {
        onProjectCreated(project)
      }

      toast({
        title: "Project Created",
        description: "Research project has been created successfully",
        variant: "default"
      })

    } catch (error) {
      toast({
        title: "Project Creation Failed",
        description: "Failed to create research project",
        variant: "destructive"
      })
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span>AI Research Assistant</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Get AI-powered insights, methodology suggestions, and comprehensive research planning
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Research Input</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="planning">Project Planning</TabsTrigger>
          <TabsTrigger value="projects">Saved Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Research Definition</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="research-area" className="text-sm font-medium">
                  Research Area / Question *
                </Label>
                <Textarea
                  id="research-area"
                  value={researchArea}
                  onChange={(e) => setResearchArea(e.target.value)}
                  placeholder="Describe your research area or specific question. Example: Investigating the role of microRNAs in cancer metastasis, particularly focusing on miR-200 family regulation in epithelial-mesenchymal transition"
                  rows={4}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Be specific about the biological process, disease, or phenomenon you want to study
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Research Domain *</Label>
                  <Select value={domain} onValueChange={setDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select research domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchDomains.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Research Type</Label>
                  <Select value={researchType} onValueChange={(value: any) => setResearchType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Research</SelectItem>
                      <SelectItem value="applied">Applied Research</SelectItem>
                      <SelectItem value="translational">Translational Research</SelectItem>
                      <SelectItem value="clinical">Clinical Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Research Hypothesis (Optional)</Label>
                <Textarea
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="State your research hypothesis if you have one. Example: We hypothesize that overexpression of miR-200c suppresses EMT by directly targeting ZEB1 and SNAIL2 transcription factors"
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Research Objectives *</Label>
                
                <div className="flex space-x-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add research objective (e.g., Characterize miR-200c expression patterns)"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddObjective}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {objectives.length > 0 && (
                  <div className="space-y-2">
                    {objectives.map((objective, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{objective}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveObjective(objective)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Expected Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Budget Range</Label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateInsights}
                disabled={loading || !researchArea.trim() || !domain || objectives.length === 0}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Research Insights...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Generate AI Research Insights
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {insights ? (
            <>
              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Key Research Insights</span>
                    <Badge className="ml-2">
                      {Math.round(insights.confidence * 100)}% Confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.keyInsights.map((insight, index) => (
                      <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-blue-800">{insight.title}</h4>
                          <Badge 
                            variant={insight.importance === 'high' ? 'default' : 'outline'}
                            className={insight.importance === 'high' ? 'bg-red-100 text-red-800' : ''}
                          >
                            {insight.importance} priority
                          </Badge>
                        </div>
                        <p className="text-blue-700 text-sm mb-3">{insight.description}</p>
                        
                        {insight.relevantTools.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className="text-xs text-blue-600 mr-2">Tools:</span>
                            {insight.relevantTools.map((tool, toolIndex) => (
                              <Badge key={toolIndex} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {insight.evidence.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-blue-600 font-medium">Evidence:</span>
                            <ul className="text-xs text-blue-600 list-disc list-inside mt-1">
                              {insight.evidence.map((evidence, evidenceIndex) => (
                                <li key={evidenceIndex}>{evidence}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Methodologies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FlaskConical className="w-5 h-5" />
                    <span>Suggested Methodologies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.methodologies.map((method, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-lg">{method.name}</h4>
                          <div className="flex space-x-2">
                            <Badge variant={method.cost === 'high' ? 'destructive' : method.cost === 'medium' ? 'default' : 'secondary'}>
                              {method.cost} cost
                            </Badge>
                            <Badge variant={method.complexity === 'high' ? 'destructive' : method.complexity === 'medium' ? 'default' : 'secondary'}>
                              {method.complexity} complexity
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-green-800 mb-1">Advantages:</h5>
                            <ul className="text-green-700 list-disc list-inside">
                              {method.advantages.map((advantage, advIndex) => (
                                <li key={advIndex}>{advantage}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-red-800 mb-1">Limitations:</h5>
                            <ul className="text-red-700 list-disc list-inside">
                              {method.limitations.map((limitation, limIndex) => (
                                <li key={limIndex}>{limitation}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span><strong>Time:</strong> {method.timeRequired}</span>
                            {method.equipment.length > 0 && (
                              <span><strong>Equipment:</strong> {method.equipment.slice(0, 2).join(', ')}
                                {method.equipment.length > 2 && ` +${method.equipment.length - 2} more`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Literature */}
              {insights.literature.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Relevant Literature</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.literature.slice(0, 5).map((paper, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm flex-1">{paper.title}</h4>
                            <div className="flex items-center space-x-2 ml-4">
                              <Badge variant="outline" className="text-xs">
                                Relevance: {Math.round(paper.relevanceScore * 100)}%
                              </Badge>
                                                             {paper.doi && (
                                 <a 
                                   href={`https://doi.org/${paper.doi}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                                 >
                                   <ExternalLink className="w-3 h-3" />
                                 </a>
                               )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-xs mb-2">
                            {paper.authors.slice(0, 3).join(', ')}
                            {paper.authors.length > 3 && ` et al.`} - {paper.journal} ({paper.year})
                          </p>
                          
                          <p className="text-sm mb-3">{paper.summary}</p>
                          
                          {paper.keyFindings.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-gray-700">Key Findings:</span>
                              <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                                {paper.keyFindings.slice(0, 3).map((finding, findingIndex) => (
                                  <li key={findingIndex}>{finding}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <Button onClick={handleCreateProject} className="px-8">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Research Project
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-8">
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Insights Generated Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Define your research area and objectives to generate AI-powered insights
                  </p>
                  <Button onClick={() => setActiveTab('input')}>
                    <Target className="w-4 h-4 mr-2" />
                    Start Research Definition
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          {insights ? (
            <>
              {/* Experimental Design */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Dna className="w-5 h-5" />
                    <span>Experimental Design</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Objectives</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {insights.experimentalDesign.objectives.map((obj, index) => (
                          <li key={index}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {insights.experimentalDesign.controls.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Controls</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {insights.experimentalDesign.controls.map((control, index) => (
                            <li key={index}>{control}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Sample Size</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm">
                          <strong>Recommended:</strong> {insights.experimentalDesign.sampleSize.recommended} samples
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {insights.experimentalDesign.sampleSize.justification}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Technical Risks', risks: insights.riskAssessment.technicalRisks },
                      { title: 'Resource Risks', risks: insights.riskAssessment.resourceRisks },
                      { title: 'Timeline Risks', risks: insights.riskAssessment.timelineRisks }
                    ].map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h4 className="font-medium mb-2">{category.title}</h4>
                        <div className="space-y-2">
                          {category.risks.map((risk, riskIndex) => (
                            <div key={riskIndex} className="border rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{risk.description}</span>
                                <div className="flex space-x-2">
                                  <Badge className={getRiskColor(risk.probability)}>
                                    {risk.probability} probability
                                  </Badge>
                                  <Badge className={getRiskColor(risk.impact)}>
                                    {risk.impact} impact
                                  </Badge>
                                </div>
                              </div>
                              {risk.mitigation.length > 0 && (
                                <div>
                                  <span className="text-xs font-medium">Mitigation:</span>
                                  <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                                    {risk.mitigation.map((mit, mitIndex) => (
                                      <li key={mitIndex}>{mit}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resource Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Resource Requirements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Cost Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Estimated Costs</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-blue-600">
                            ${insights.resourceRequirements.estimatedCost.personnel.toLocaleString()}
                          </div>
                          <div className="text-gray-600">Personnel</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">
                            ${insights.resourceRequirements.estimatedCost.equipment.toLocaleString()}
                          </div>
                          <div className="text-gray-600">Equipment</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-orange-600">
                            ${insights.resourceRequirements.estimatedCost.materials.toLocaleString()}
                          </div>
                          <div className="text-gray-600">Materials</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-purple-600">
                            ${insights.resourceRequirements.estimatedCost.overhead.toLocaleString()}
                          </div>
                          <div className="text-gray-600">Overhead</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-red-600 text-lg">
                            ${insights.resourceRequirements.estimatedCost.total.toLocaleString()}
                          </div>
                          <div className="text-gray-600">Total</div>
                        </div>
                      </div>
                    </div>

                    {/* Personnel */}
                    {insights.resourceRequirements.personnel.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Personnel Requirements</h4>
                        <div className="space-y-2">
                          {insights.resourceRequirements.personnel.map((person, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded">
                              <div>
                                <span className="font-medium">{person.role}</span>
                                <p className="text-sm text-gray-600">{person.timeCommitment}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {person.expertise.map((exp, expIndex) => (
                                    <Badge key={expIndex} variant="outline" className="text-xs">
                                      {exp}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${person.cost.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              {insights.timeline.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Project Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.timeline.map((phase, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{phase.phase}</h4>
                            <Badge variant="outline">{phase.duration}</Badge>
                          </div>
                          
                          {phase.deliverables.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Deliverables:</span>
                              <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                                {phase.deliverables.map((deliverable, delIndex) => (
                                  <li key={delIndex}>{deliverable}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {phase.dependencies.length > 0 && (
                            <div>
                              <span className="text-sm font-medium">Dependencies:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {phase.dependencies.map((dep, depIndex) => (
                                  <Badge key={depIndex} variant="outline" className="text-xs">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-8">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Planning Data Available</h3>
                  <p className="text-gray-500 mb-4">
                    Generate research insights first to access planning tools
                  </p>
                  <Button onClick={() => setActiveTab('input')}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Generate Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Saved Research Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedProjects.length > 0 ? (
                <div className="space-y-4">
                  {savedProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 'outline'}
                          className={project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                        >
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {project.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Progress</span>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Timeline: {project.timeline}</span>
                        <span>Budget: ${project.budget.toLocaleString()}</span>
                      </div>
                      
                      {project.objectives.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium">Objectives:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.objectives.slice(0, 3).map((obj, objIndex) => (
                              <Badge key={objIndex} variant="outline" className="text-xs">
                                {obj.length > 30 ? obj.substring(0, 30) + '...' : obj}
                              </Badge>
                            ))}
                            {project.objectives.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.objectives.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Saved Projects</h3>
                  <p className="text-gray-500 mb-4">
                    Create research projects from AI insights to track your research portfolio
                  </p>
                  <Button onClick={() => setActiveTab('input')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Research
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ResearchAssistant 