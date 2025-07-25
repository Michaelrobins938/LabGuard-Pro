'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Beaker, Database, Cpu, Zap, Brain, CheckCircle, AlertTriangle } from 'lucide-react'
import { openRouterClient } from '@/lib/ai/openrouter-client'

interface ProtocolGeneratorProps {
  onProtocolGenerated: (protocol: any) => void
}

interface GeneratedProtocol {
  id: string
  title: string
  objective: string
  content: string
  toolsUsed: string[]
  databasesQueried: string[]
  model: string
  confidence: number
  cost: number
  generatedAt: string
}

export function ProtocolGenerator({ onProtocolGenerated }: ProtocolGeneratorProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet')
  const [context, setContext] = useState('')
  const [generatedProtocol, setGeneratedProtocol] = useState<GeneratedProtocol | null>(null)
  const [error, setError] = useState<string | null>(null)

  const availableTools = [
    'DNA/RNA sequence analysis',
    'Protein structure prediction',
    'CRISPR guide design',
    'Cell type annotation',
    'Drug-target interaction',
    'Pharmacokinetic modeling',
    'Primer design',
    'Plasmid design',
    'Western blot optimization',
    'qPCR assay design',
    'Flow cytometry analysis',
    'Microscopy image processing',
    'Statistical analysis',
    'Quality control validation'
  ]

  const availableDatabases = [
    'GenBank',
    'UniProt', 
    'PDB',
    'KEGG',
    'Gene Ontology',
    'ChEMBL',
    'PubMed',
    'Reactome',
    'STRING',
    'ClinVar',
    'COSMIC',
    'TCGA',
    'GEO',
    'ArrayExpress'
  ]

  const availableModels = [
    {
      id: 'anthropic/claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      description: 'Best for complex protocols and analysis',
      cost: '$3/1M tokens'
    },
    {
      id: 'anthropic/claude-3-opus',
      name: 'Claude 3 Opus',
      description: 'Most capable for advanced research',
      cost: '$15/1M tokens'
    },
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      description: 'Good for general laboratory tasks',
      cost: '$5/1M tokens'
    },
    {
      id: 'google/gemini-pro',
      name: 'Gemini Pro',
      description: 'Cost-effective for technical tasks',
      cost: '$3.5/1M tokens'
    }
  ]

  const handleGenerateProtocol = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      // Check OpenRouter availability
      const isAvailable = await openRouterClient.checkAvailability()
      if (!isAvailable) {
        throw new Error('OpenRouter is not available. Please check your API key configuration.')
      }

      // Generate protocol using OpenRouter
      const response = await openRouterClient.generateProtocol(
        query,
        context || 'General laboratory context',
        selectedTools,
        selectedDatabases
      )

      // Calculate cost
      const cost = openRouterClient.calculateCost(
        response.usage.total_tokens,
        selectedModel
      )

      // Create protocol object
      const protocol: GeneratedProtocol = {
        id: response.id,
        title: `Protocol: ${query.substring(0, 50)}...`,
        objective: query,
        content: response.choices[0].message.content,
        toolsUsed: selectedTools,
        databasesQueried: selectedDatabases,
        model: selectedModel,
        confidence: 0.95, // High confidence for protocol generation
        cost: cost,
        generatedAt: new Date().toISOString()
      }

      setGeneratedProtocol(protocol)
      onProtocolGenerated(protocol)

    } catch (error) {
      console.error('Protocol generation failed:', error)
      setError(error instanceof Error ? error.message : 'Protocol generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleToolToggle = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) 
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    )
  }

  const handleDatabaseToggle = (db: string) => {
    setSelectedDatabases(prev => 
      prev.includes(db) 
        ? prev.filter(d => d !== db)
        : [...prev, db]
    )
  }

  const getModelCapabilities = (modelId: string) => {
    return openRouterClient.getModelCapabilities(modelId)
  }

  return (
    <div className="space-y-6">
      {/* Protocol Generator Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Beaker className="w-5 h-5" />
            <span>AI Protocol Generator</span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Powered by OpenRouter
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Describe your experimental goal and let AI generate a detailed protocol using Stanford's research methodologies
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Model Selection */}
          <div>
            <label className="text-sm font-medium flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4" />
              <span>AI Model Selection</span>
            </label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-gray-500">{model.description}</div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {model.cost}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Model Capabilities */}
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-800">
                <strong>Capabilities:</strong> {getModelCapabilities(selectedModel).strengths.join(', ')}
              </div>
              <div className="text-xs text-blue-700 mt-1">
                <strong>Best for:</strong> {getModelCapabilities(selectedModel).bestFor.join(', ')}
              </div>
            </div>
          </div>

          {/* Query Input */}
          <div>
            <label className="text-sm font-medium">Experimental Objective</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Example: Design a protocol to isolate and purify protein X from E. coli, including expression optimization and purification steps"
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Laboratory Context */}
          <div>
            <label className="text-sm font-medium">Laboratory Context (Optional)</label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe your laboratory setup, available equipment, safety requirements, or specific constraints"
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Tool Selection */}
          <div>
            <label className="text-sm font-medium flex items-center space-x-2 mb-2">
              <Cpu className="w-4 h-4" />
              <span>Preferred Tools (Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTools.map((tool) => (
                <Badge
                  key={tool}
                  variant={selectedTools.includes(tool) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => handleToolToggle(tool)}
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          {/* Database Selection */}
          <div>
            <label className="text-sm font-medium flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4" />
              <span>Databases to Query (Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDatabases.map((db) => (
                <Badge
                  key={db}
                  variant={selectedDatabases.includes(db) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-green-50"
                  onClick={() => handleDatabaseToggle(db)}
                >
                  {db}
                </Badge>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={handleGenerateProtocol}
            disabled={!query.trim() || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Protocol with {selectedModel}...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Protocol with OpenRouter AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Protocol Display */}
      {generatedProtocol && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Protocol Generated Successfully!</span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-green-700">
              <span>Model: {generatedProtocol.model}</span>
              <span>Cost: ${generatedProtocol.cost.toFixed(4)}</span>
              <span>Confidence: {(generatedProtocol.confidence * 100).toFixed(1)}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">{generatedProtocol.title}</h3>
              <div className="whitespace-pre-wrap text-gray-800">
                {generatedProtocol.content}
              </div>
            </div>
            
            {/* Tools and Databases Used */}
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-2">Tools Used:</h4>
                  <div className="flex flex-wrap gap-1">
                    {generatedProtocol.toolsUsed.map((tool) => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-2">Databases Queried:</h4>
                  <div className="flex flex-wrap gap-1">
                    {generatedProtocol.databasesQueried.map((db) => (
                      <Badge key={db} variant="outline" className="text-xs">
                        {db}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 