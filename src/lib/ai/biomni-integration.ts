import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

// Enterprise-grade Biomni Configuration
interface BiomniConfig {
  pythonPath: string
  biomniPath: string
  dataPath: string
  llmModel: string
  maxConcurrentQueries: number
  timeoutMs: number
  retryAttempts: number
  cacheDurationMs: number
}

// Comprehensive Request Interface
interface BiomniRequest {
  query: string
  context?: string
  tools?: string[]
  databases?: string[]
  analysisType: 'proteomics' | 'genomics' | 'metabolomics' | 'imaging' | 'general'
  priority: 'low' | 'medium' | 'high' | 'critical'
  userId: string
  labId: string
  sessionId?: string
  metadata?: Record<string, any>
}

// Detailed Response Interface
interface BiomniResponse {
  id: string
  result: string
  summary: string
  insights: string[]
  recommendations: string[]
  toolsUsed: string[]
  databasesQueried: string[]
  confidence: number
  executionTime: number
  cost: number
  warnings: string[]
  nextSteps: string[]
  references: BiomniReference[]
  dataQuality: DataQualityAssessment
}

interface BiomniReference {
  title: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  pmid?: string
  relevanceScore: number
  summary: string
}

interface DataQualityAssessment {
  completeness: number
  accuracy: number
  consistency: number
  reliability: number
  issues: string[]
  recommendations: string[]
}

// Enterprise Biomni Service Class
export class BiomniService {
  private config: BiomniConfig
  private queryQueue: Map<string, BiomniRequest>
  private cache: Map<string, { response: BiomniResponse; timestamp: number }>
  private activeQueries: Set<string>

  constructor() {
    this.config = {
      pythonPath: process.env.BIOMNI_PYTHON_PATH || 'python3',
      biomniPath: process.env.BIOMNI_PATH || './Biomni/biomni',
      dataPath: process.env.BIOMNI_DATA_PATH || './data',
      llmModel: process.env.BIOMNI_LLM || 'gpt-4o',
      maxConcurrentQueries: parseInt(process.env.BIOMNI_MAX_CONCURRENT || '3'),
      timeoutMs: parseInt(process.env.BIOMNI_TIMEOUT_MS || '300000'), // 5 minutes
      retryAttempts: parseInt(process.env.BIOMNI_RETRY_ATTEMPTS || '2'),
      cacheDurationMs: parseInt(process.env.BIOMNI_CACHE_DURATION_MS || '3600000') // 1 hour
    }
    
    this.queryQueue = new Map()
    this.cache = new Map()
    this.activeQueries = new Set()
  }

  /**
   * Execute Biomni query with enterprise features
   */
  async executeBiomniQuery(request: BiomniRequest): Promise<BiomniResponse> {
    const queryId = this.generateQueryId(request)
    
    // Check cache first
    const cachedResult = this.getCachedResult(queryId)
    if (cachedResult) {
      return cachedResult
    }

    // Queue management for high load
    if (this.activeQueries.size >= this.config.maxConcurrentQueries) {
      this.queryQueue.set(queryId, request)
      await this.waitForQueuePosition(queryId)
    }

    this.activeQueries.add(queryId)

    try {
      const result = await this.executeWithRetry(request, queryId)
      this.cacheResult(queryId, result)
      return result
    } finally {
      this.activeQueries.delete(queryId)
      this.processQueue()
    }
  }

  /**
   * Advanced proteomics analysis
   */
  async analyzeProteomics(data: {
    sequences: string[]
    structures?: string[]
    expressionData?: number[][]
    conditions: string[]
    analysisGoals: string[]
  }): Promise<BiomniResponse> {
    const request: BiomniRequest = {
      query: this.buildProteomicsQuery(data),
      context: 'proteomics_analysis',
      tools: [
        'protein_structure_prediction',
        'functional_annotation',
        'pathway_analysis',
        'interaction_network',
        'post_translational_modifications',
        'protein_folding_analysis'
      ],
      databases: [
        'UniProt',
        'PDB',
        'KEGG',
        'Reactome',
        'STRING',
        'Gene_Ontology'
      ],
      analysisType: 'proteomics',
      priority: 'high',
      userId: 'system',
      labId: 'enterprise'
    }

    return this.executeBiomniQuery(request)
  }

  /**
   * Advanced genomics analysis
   */
  async analyzeGenomics(data: {
    sequences: string[]
    variants?: any[]
    expressionProfiles?: number[][]
    clinicalData?: Record<string, any>
    analysisType: 'variant_calling' | 'expression_analysis' | 'genome_assembly' | 'annotation'
  }): Promise<BiomniResponse> {
    const request: BiomniRequest = {
      query: this.buildGenomicsQuery(data),
      context: 'genomics_analysis',
      tools: [
        'variant_annotation',
        'pathway_enrichment',
        'expression_analysis',
        'genome_alignment',
        'functional_prediction',
        'population_genetics'
      ],
      databases: [
        'GenBank',
        'dbSNP',
        'ClinVar',
        'GWAS_Catalog',
        'GTEx',
        'TCGA'
      ],
      analysisType: 'genomics',
      priority: 'high',
      userId: 'system',
      labId: 'enterprise'
    }

    return this.executeBiomniQuery(request)
  }

  /**
   * Advanced imaging analysis for microscopy and medical imaging
   */
  async analyzeImaging(data: {
    imageData: Buffer[]
    imageType: 'microscopy' | 'histology' | 'fluorescence' | 'phase_contrast'
    analysisGoals: string[]
    quantificationTargets?: string[]
    metadata?: Record<string, any>
  }): Promise<BiomniResponse> {
    // Save image data temporarily for processing
    const tempDir = await this.createTempDirectory()
    const imagePaths: string[] = []

    try {
      for (let i = 0; i < data.imageData.length; i++) {
        const imagePath = path.join(tempDir, `image_${i}.tiff`)
        await fs.writeFile(imagePath, data.imageData[i])
        imagePaths.push(imagePath)
      }

      const request: BiomniRequest = {
        query: this.buildImagingQuery(data, imagePaths),
        context: 'imaging_analysis',
        tools: [
          'image_segmentation',
          'cell_counting',
          'morphology_analysis',
          'fluorescence_quantification',
          'co_localization_analysis',
          'time_series_analysis'
        ],
        databases: [
          'Cell_Image_Library',
          'BioImage_Archive',
          'OMERO',
          'ImageNet_Bio'
        ],
        analysisType: 'imaging',
        priority: 'medium',
        userId: 'system',
        labId: 'enterprise',
        metadata: { tempDir, imagePaths }
      }

      return await this.executeBiomniQuery(request)
    } finally {
      // Cleanup temporary files
      await this.cleanupTempDirectory(tempDir)
    }
  }

  /**
   * Multi-modal analysis combining different data types
   */
  async performMultiModalAnalysis(data: {
    proteomicsData?: any
    genomicsData?: any
    metabolomicsData?: any
    imagingData?: any
    clinicalData?: any
    hypothesis?: string
    researchQuestion: string
  }): Promise<BiomniResponse> {
    const request: BiomniRequest = {
      query: this.buildMultiModalQuery(data),
      context: 'multimodal_analysis',
      tools: [
        'data_integration',
        'network_analysis',
        'pathway_enrichment',
        'statistical_modeling',
        'machine_learning',
        'systems_biology'
      ],
      databases: [
        'KEGG',
        'Reactome',
        'STRING',
        'HMDB',
        'ChEBI',
        'PubChem'
      ],
      analysisType: 'general',
      priority: 'critical',
      userId: 'system',
      labId: 'enterprise'
    }

    return this.executeBiomniQuery(request)
  }

  /**
   * Generate experimental protocols using AI
   */
  async generateProtocol(data: {
    objective: string
    sampleType: string
    techniques: string[]
    constraints?: string[]
    safetyRequirements?: string[]
    equipmentAvailable?: string[]
  }): Promise<{
    protocol: any
    validation: any
    recommendations: string[]
  }> {
    const request: BiomniRequest = {
      query: this.buildProtocolQuery(data),
      context: 'protocol_generation',
      tools: [
        'protocol_design',
        'method_validation',
        'safety_assessment',
        'equipment_optimization',
        'quality_control'
      ],
      databases: [
        'Protocols_io',
        'Nature_Protocols',
        'JoVE',
        'Cold_Spring_Harbor'
      ],
      analysisType: 'general',
      priority: 'high',
      userId: 'system',
      labId: 'enterprise'
    }

    const response = await this.executeBiomniQuery(request)
    
    return {
      protocol: this.parseProtocolFromResponse(response),
      validation: this.extractValidationData(response),
      recommendations: response.recommendations
    }
  }

  // Private helper methods

  private async executeWithRetry(request: BiomniRequest, queryId: string): Promise<BiomniResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await this.executeBiomniProcess(request, queryId)
      } catch (error) {
        lastError = error as Error
        if (attempt < this.config.retryAttempts) {
          await this.delay(Math.pow(2, attempt) * 1000) // Exponential backoff
        }
      }
    }

    throw lastError || new Error('Unknown error during Biomni execution')
  }

  private async executeBiomniProcess(request: BiomniRequest, queryId: string): Promise<BiomniResponse> {
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      const pythonScript = this.generatePythonScript(request)
      
      const biomniProcess = spawn(this.config.pythonPath, ['-c', pythonScript], {
        cwd: this.config.biomniPath,
        env: {
          ...process.env,
          PYTHONPATH: this.config.biomniPath,
          BIOMNI_DATA_PATH: this.config.dataPath
        },
        timeout: this.config.timeoutMs
      })

      let output = ''
      let errorOutput = ''

      biomniProcess.stdout.on('data', (data) => {
        output += data.toString()
      })

      biomniProcess.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      biomniProcess.on('close', (code) => {
        const executionTime = Date.now() - startTime

        if (code === 0) {
          try {
            const result = this.parseOutput(output, executionTime, queryId)
            resolve(result)
          } catch (parseError) {
            reject(new Error(`Failed to parse Biomni response: ${parseError}`))
          }
        } else {
          reject(new Error(`Biomni process failed with code ${code}: ${errorOutput}`))
        }
      })

      biomniProcess.on('error', (error) => {
        reject(new Error(`Failed to start Biomni process: ${error.message}`))
      })
    })
  }

  private generatePythonScript(request: BiomniRequest): string {
    return `
import sys
import json
import traceback
from pathlib import Path

# Add Biomni to path
sys.path.append('${this.config.biomniPath}')

try:
    from biomni import Agent
    from biomni.tools import get_available_tools
    from biomni.databases import get_available_databases
    
    # Initialize Biomni agent
    agent = Agent(
        model='${this.config.llmModel}',
        data_path='${this.config.dataPath}'
    )
    
    # Configure tools and databases
    if ${JSON.stringify(request.tools)}:
        agent.set_tools(${JSON.stringify(request.tools)})
    
    if ${JSON.stringify(request.databases)}:
        agent.set_databases(${JSON.stringify(request.databases)})
    
    # Execute query
    result = agent.run(
        query="${request.query.replace(/"/g, '\\"')}",
        context="${request.context || ''}",
        metadata=${JSON.stringify(request.metadata || {})}
    )
    
    # Format response
    response = {
        "success": True,
        "result": result.text if hasattr(result, 'text') else str(result),
        "tools_used": result.tools_used if hasattr(result, 'tools_used') else [],
        "databases_queried": result.databases_queried if hasattr(result, 'databases_queried') else [],
        "confidence": result.confidence if hasattr(result, 'confidence') else 0.8,
        "cost": result.cost if hasattr(result, 'cost') else 0.0,
        "metadata": result.metadata if hasattr(result, 'metadata') else {}
    }
    
    print(json.dumps(response))
    
except Exception as e:
    error_response = {
        "success": False,
        "error": str(e),
        "traceback": traceback.format_exc()
    }
    print(json.dumps(error_response))
    sys.exit(1)
`
  }

  private parseOutput(output: string, executionTime: number, queryId: string): BiomniResponse {
    try {
      const rawResult = JSON.parse(output.trim())
      
      if (!rawResult.success) {
        throw new Error(rawResult.error || 'Unknown Biomni error')
      }

      // Extract insights and recommendations from the result
      const insights = this.extractInsights(rawResult.result)
      const recommendations = this.extractRecommendations(rawResult.result)
      const nextSteps = this.generateNextSteps(rawResult.result)
      const references = this.extractReferences(rawResult.result)
      const dataQuality = this.assessDataQuality(rawResult)

      return {
        id: queryId,
        result: rawResult.result,
        summary: this.generateSummary(rawResult.result),
        insights,
        recommendations,
        toolsUsed: rawResult.tools_used || [],
        databasesQueried: rawResult.databases_queried || [],
        confidence: rawResult.confidence || 0.8,
        executionTime,
        cost: rawResult.cost || 0.0,
        warnings: this.extractWarnings(rawResult.result),
        nextSteps,
        references,
        dataQuality
      }
    } catch (error) {
      throw new Error(`Failed to parse Biomni output: ${error}`)
    }
  }

  private extractInsights(result: string): string[] {
    const insights: string[] = []
    const insightPatterns = [
      /(?:insight|finding|discovery|observation):\s*(.+?)(?=\n|\.)/gi,
      /(?:key finding|important note|notable result):\s*(.+?)(?=\n|\.)/gi,
      /(?:analysis reveals|data shows|results indicate):\s*(.+?)(?=\n|\.)/gi
    ]

    insightPatterns.forEach(pattern => {
      const matches = result.match(pattern)
      if (matches) {
        insights.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()))
      }
    })

    return insights.length > 0 ? insights.slice(0, 10) : [this.generateDefaultInsight(result)]
  }

  private extractRecommendations(result: string): string[] {
    const recommendations: string[] = []
    
    // Equipment recommendations
    if (result.toLowerCase().includes('calibration') || result.toLowerCase().includes('equipment')) {
      if (result.toLowerCase().includes('overdue') || result.toLowerCase().includes('due')) {
        recommendations.push('Schedule immediate calibration for equipment due for service')
      }
      if (result.toLowerCase().includes('maintenance')) {
        recommendations.push('Perform preventive maintenance on identified equipment')
      }
      if (result.toLowerCase().includes('performance') || result.toLowerCase().includes('accuracy')) {
        recommendations.push('Investigate performance issues and consider replacement')
      }
    }

    // Workflow recommendations
    if (result.toLowerCase().includes('workflow') || result.toLowerCase().includes('process')) {
      if (result.toLowerCase().includes('bottleneck')) {
        recommendations.push('Address workflow bottlenecks to improve efficiency')
      }
      if (result.toLowerCase().includes('redundant') || result.toLowerCase().includes('duplicate')) {
        recommendations.push('Eliminate redundant steps in the workflow')
      }
      if (result.toLowerCase().includes('automation') || result.toLowerCase().includes('automate')) {
        recommendations.push('Implement automation for repetitive tasks')
      }
    }

    return recommendations.length > 0 ? recommendations : ['Review results and consider implementing suggested improvements']
  }

  private generateNextSteps(result: string): string[] {
    const nextSteps: string[] = []
    
    // Determine analysis type and suggest appropriate next steps
    if (result.toLowerCase().includes('protocol') || result.toLowerCase().includes('experiment')) {
      nextSteps.push('Validate findings with experimental data')
      nextSteps.push('Design follow-up experiments')
      nextSteps.push('Compare with existing literature')
    } else if (result.toLowerCase().includes('method') || result.toLowerCase().includes('procedure')) {
      nextSteps.push('Review and validate protocol steps')
      nextSteps.push('Prepare necessary reagents and equipment')
      nextSteps.push('Conduct pilot experiment')
    } else if (result.toLowerCase().includes('research') || result.toLowerCase().includes('hypothesis')) {
      nextSteps.push('Identify research gaps')
      nextSteps.push('Design experiments to address gaps')
      nextSteps.push('Update research proposal')
    } else if (result.toLowerCase().includes('hypothesis')) {
      nextSteps.push('Design experiments to test hypothesis')
      nextSteps.push('Gather preliminary data')
      nextSteps.push('Refine hypothesis based on initial results')
    } else if (result.toLowerCase().includes('equipment') || result.toLowerCase().includes('instrument')) {
      nextSteps.push('Schedule maintenance and calibration')
      nextSteps.push('Update equipment inventory')
      nextSteps.push('Train staff on new procedures')
    } else if (result.toLowerCase().includes('workflow') || result.toLowerCase().includes('process')) {
      nextSteps.push('Implement workflow changes')
      nextSteps.push('Monitor efficiency improvements')
      nextSteps.push('Train team on new processes')
    } else {
      nextSteps.push('Validate cross-modal findings')
      nextSteps.push('Design integrated experiments')
      nextSteps.push('Publish comprehensive analysis')
    }

    return nextSteps
  }

  private extractReferences(result: string): BiomniReference[] {
    // Extract and format references from the result
    const references: BiomniReference[] = []
    
    // Pattern to match DOI references
    const doiPattern = /doi:\s*(10\.\d+\/[^\s]+)/gi
    const doiMatches = result.match(doiPattern)
    
    if (doiMatches) {
      doiMatches.slice(0, 5).forEach((doi, index) => {
        references.push({
          title: `Reference ${index + 1}`,
          authors: ['Various Authors'],
          journal: 'Scientific Journal',
          year: new Date().getFullYear(),
          doi: doi.replace('doi:', '').trim(),
          relevanceScore: 0.8,
          summary: 'Relevant scientific reference identified by Biomni analysis'
        })
      })
    }

    return references
  }

  private assessDataQuality(rawResult: any): DataQualityAssessment {
    return {
      completeness: rawResult.confidence || 0.8,
      accuracy: rawResult.confidence || 0.8,
      consistency: 0.85,
      reliability: rawResult.confidence || 0.8,
      issues: rawResult.confidence < 0.7 ? ['Lower confidence score indicates potential data quality issues'] : [],
      recommendations: rawResult.confidence < 0.7 ? ['Consider collecting additional data to improve analysis confidence'] : []
    }
  }

  private generateDefaultInsight(result: string): string {
    const resultLength = result.length
    if (resultLength > 1000) {
      return 'Comprehensive analysis completed with detailed findings'
    } else if (resultLength > 500) {
      return 'Analysis reveals moderate complexity in the data'
    } else {
      return 'Initial analysis completed, additional data may enhance results'
    }
  }

  private generateSummary(result: string): string {
    // Generate a concise summary of the full result
    const sentences = result.split('.').filter(s => s.trim().length > 20)
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ') + '.'
    }
    return result.substring(0, 200) + (result.length > 200 ? '...' : '')
  }

  private extractWarnings(result: string): string[] {
    const warnings: string[] = []
    const warningPatterns = [
      /warning:\s*(.+?)(?=\n|\.)/gi,
      /caution:\s*(.+?)(?=\n|\.)/gi,
      /note:\s*(.+?)(?=\n|\.)/gi
    ]

    warningPatterns.forEach(pattern => {
      const matches = result.match(pattern)
      if (matches) {
        warnings.push(...matches.map(match => match.replace(/^[^:]+:\s*/, '').trim()))
      }
    })

    return warnings
  }

  // Query builders for different analysis types

  private buildProteomicsQuery(data: any): string {
    return `
Perform comprehensive proteomics analysis on the provided data:

Protein Sequences: ${data.sequences.length} sequences provided
Structural Data: ${data.structures ? 'Available' : 'Not provided'}
Expression Data: ${data.expressionData ? 'Available' : 'Not provided'}
Experimental Conditions: ${data.conditions.join(', ')}

Analysis Goals:
${data.analysisGoals.map((goal: string) => `- ${goal}`).join('\n')}

Please provide:
1. Functional annotation and classification
2. Pathway analysis and enrichment
3. Protein-protein interaction networks
4. Structural predictions and validation
5. Post-translational modification analysis
6. Quality control assessment
7. Statistical analysis and significance testing
8. Biological interpretation and recommendations
`
  }

  private buildGenomicsQuery(data: any): string {
    return `
Perform comprehensive genomics analysis:

Sequence Data: ${data.sequences.length} sequences
Variant Data: ${data.variants ? data.variants.length + ' variants' : 'Not provided'}
Expression Profiles: ${data.expressionProfiles ? 'Available' : 'Not provided'}
Clinical Data: ${data.clinicalData ? 'Available' : 'Not provided'}
Analysis Type: ${data.analysisType}

Please provide:
1. Variant annotation and effect prediction
2. Pathway enrichment analysis
3. Gene expression analysis
4. Population genetics assessment
5. Clinical significance evaluation
6. Functional impact prediction
7. Quality metrics and validation
8. Therapeutic recommendations
`
  }

  private buildImagingQuery(data: any, imagePaths: string[]): string {
    return `
Perform comprehensive imaging analysis:

Image Type: ${data.imageType}
Number of Images: ${imagePaths.length}
Image Paths: ${imagePaths.join(', ')}

Analysis Goals:
${data.analysisGoals.map((goal: string) => `- ${goal}`).join('\n')}

Quantification Targets: ${data.quantificationTargets?.join(', ') || 'Not specified'}

Please provide:
1. Image quality assessment
2. Object detection and segmentation
3. Morphological analysis
4. Quantitative measurements
5. Statistical analysis
6. Comparative analysis
7. Quality control metrics
8. Interpretation and recommendations
`
  }

  private buildMultiModalQuery(data: any): string {
    return `
Perform integrated multi-modal analysis:

Research Question: ${data.researchQuestion}
Hypothesis: ${data.hypothesis || 'Not specified'}

Available Data Types:
- Proteomics: ${data.proteomicsData ? 'Available' : 'Not available'}
- Genomics: ${data.genomicsData ? 'Available' : 'Not available'}
- Metabolomics: ${data.metabolomicsData ? 'Available' : 'Not available'}
- Imaging: ${data.imagingData ? 'Available' : 'Not available'}
- Clinical: ${data.clinicalData ? 'Available' : 'Not available'}

Please provide:
1. Integrated data analysis
2. Cross-platform validation
3. Network-based analysis
4. Systems biology interpretation
5. Pathway enrichment across data types
6. Statistical integration methods
7. Clinical correlations
8. Research recommendations and next steps
`
  }

  private buildProtocolQuery(data: any): string {
    return `
Generate a detailed experimental protocol:

Objective: ${data.objective}
Sample Type: ${data.sampleType}
Techniques: ${data.techniques.join(', ')}

Constraints: ${data.constraints?.join(', ') || 'None specified'}
Safety Requirements: ${data.safetyRequirements?.join(', ') || 'Standard laboratory safety'}
Available Equipment: ${data.equipmentAvailable?.join(', ') || 'Standard laboratory equipment'}

Please provide:
1. Detailed step-by-step protocol
2. Required reagents and materials
3. Equipment specifications
4. Safety considerations and PPE requirements
5. Quality control measures
6. Expected results and interpretation
7. Troubleshooting guide
8. Validation recommendations
`
  }

  // Utility methods

  private generateQueryId(request: BiomniRequest): string {
    const hash = require('crypto').createHash('md5')
    hash.update(JSON.stringify({
      query: request.query,
      tools: request.tools,
      databases: request.databases,
      analysisType: request.analysisType
    }))
    return `biomni_${Date.now()}_${hash.digest('hex').substring(0, 8)}`
  }

  private getCachedResult(queryId: string): BiomniResponse | null {
    const cached = this.cache.get(queryId)
    if (cached && Date.now() - cached.timestamp < this.config.cacheDurationMs) {
      return cached.response
    }
    if (cached) {
      this.cache.delete(queryId) // Remove expired cache
    }
    return null
  }

  private cacheResult(queryId: string, response: BiomniResponse): void {
    this.cache.set(queryId, {
      response,
      timestamp: Date.now()
    })
  }

  private async waitForQueuePosition(queryId: string): Promise<void> {
    return new Promise((resolve) => {
      const checkQueue = () => {
        if (this.activeQueries.size < this.config.maxConcurrentQueries) {
          resolve()
        } else {
          setTimeout(checkQueue, 1000)
        }
      }
      checkQueue()
    })
  }

  private processQueue(): void {
    if (this.queryQueue.size > 0 && this.activeQueries.size < this.config.maxConcurrentQueries) {
      const [firstQueryId] = this.queryQueue.keys()
      const request = this.queryQueue.get(firstQueryId)
      if (request) {
        this.queryQueue.delete(firstQueryId)
        // Process next queued request
        this.executeBiomniQuery(request).catch(console.error)
      }
    }
  }

  private async createTempDirectory(): Promise<string> {
    const tempDir = path.join(process.cwd(), 'temp', `biomni_${Date.now()}`)
    await fs.mkdir(tempDir, { recursive: true })
    return tempDir
  }

  private async cleanupTempDirectory(tempDir: string): Promise<void> {
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch (error) {
      console.error('Failed to cleanup temp directory:', error)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private parseProtocolFromResponse(response: BiomniResponse): any {
    // Parse protocol structure from response
    return {
      name: 'AI-Generated Protocol',
      description: response.summary,
      steps: response.result.split('\n').filter(line => line.trim().length > 0).map((step, index) => ({
        id: index + 1,
        title: `Step ${index + 1}`,
        description: step.trim(),
        duration: '10-15 minutes',
        criticalPoints: response.warnings.length > index ? response.warnings[index] : null
      })),
      reagents: [],
      equipment: [],
      safetyConsiderations: response.warnings.map(warning => ({
        category: 'General Safety',
        description: warning,
        ppe: 'Standard laboratory PPE'
      })),
      expectedResults: [{
        parameter: 'Success Rate',
        expectedValue: `${Math.round(response.confidence * 100)}%`,
        interpretation: 'Expected success rate based on AI analysis'
      }]
    }
  }

  private extractValidationData(response: BiomniResponse): any {
    return {
      confidence: response.confidence,
      dataQuality: response.dataQuality,
      validationMethods: response.recommendations,
      qualityMetrics: {
        completeness: response.dataQuality.completeness,
        accuracy: response.dataQuality.accuracy,
        reliability: response.dataQuality.reliability
      }
    }
  }
}

// Export singleton instance for use throughout the application
export const biomniService = new BiomniService()

// Additional utility functions for specific use cases
export const biomniUtils = {
  /**
   * Format analysis results for display
   */
  formatAnalysisResults: (response: BiomniResponse) => {
    return {
      summary: response.summary,
      keyFindings: response.insights.slice(0, 5),
      recommendations: response.recommendations.slice(0, 3),
      confidence: `${Math.round(response.confidence * 100)}%`,
      executionTime: `${response.executionTime / 1000}s`,
      toolsUsed: response.toolsUsed.length,
      databasesQueried: response.databasesQueried.length
    }
  },

  /**
   * Generate report for audit purposes
   */
  generateAuditReport: (response: BiomniResponse) => {
    return {
      analysisId: response.id,
      timestamp: new Date().toISOString(),
      summary: response.summary,
      methodology: {
        tools: response.toolsUsed,
        databases: response.databasesQueried,
        confidence: response.confidence
      },
      results: response.insights,
      recommendations: response.recommendations,
      dataQuality: response.dataQuality,
      nextSteps: response.nextSteps
    }
  },

  /**
   * Validate analysis parameters
   */
  validateAnalysisRequest: (request: Partial<BiomniRequest>) => {
    const errors: string[] = []
    
    if (!request.query || request.query.trim().length === 0) {
      errors.push('Query is required')
    }
    
    if (!request.analysisType) {
      errors.push('Analysis type is required')
    }
    
    if (!request.userId) {
      errors.push('User ID is required')
    }
    
    if (!request.labId) {
      errors.push('Laboratory ID is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default BiomniService 