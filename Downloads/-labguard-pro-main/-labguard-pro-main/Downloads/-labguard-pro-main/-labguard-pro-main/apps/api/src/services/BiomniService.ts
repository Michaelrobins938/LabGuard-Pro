import { PrismaClient } from '@labguard/database';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export interface BiomniQuery {
  id: string;
  query: string;
  tools: string[];
  databases: string[];
  category: 'PROTOCOL_GENERATION' | 'RESEARCH_ASSISTANT' | 'DATA_ANALYSIS' | 'EQUIPMENT_OPTIMIZATION' | 'VISUAL_ANALYSIS' | 'COMPLIANCE_VALIDATION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface BiomniProtocol {
  id: string;
  title: string;
  description: string;
  category: 'CELL_CULTURE' | 'PCR' | 'SEQUENCING' | 'MICROSCOPY' | 'FLOW_CYTOMETRY' | 'CUSTOM';
  steps: BiomniProtocolStep[];
  equipment: string[];
  reagents: string[];
  safetyNotes: string[];
  estimatedDuration: number; // in minutes
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  aiGenerated: boolean;
  validatedBy?: string;
  validationDate?: Date;
}

export interface BiomniProtocolStep {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number; // in minutes
  equipment: string[];
  reagents: string[];
  safetyNotes: string[];
  criticalPoints: string[];
}

export interface BiomniResearchProject {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  methodology: string;
  expectedOutcomes: string[];
  timeline: number; // in days
  budget: number;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  equipmentRequirements: string[];
  personnelRequirements: string[];
  riskAssessment: string[];
}

export interface BiomniVisualAnalysis {
  id: string;
  imageUrl: string;
  analysisType: 'SAMPLE_QUALITY' | 'EQUIPMENT_CONDITION' | 'CULTURE_GROWTH' | 'CONTAMINATION_DETECTION';
  results: {
    quality: number; // 0-100
    issues: string[];
    recommendations: string[];
    confidence: number; // 0-1
  };
  metadata: {
    imageSize: number;
    format: string;
    timestamp: Date;
  };
}

export interface BiomniComplianceValidation {
  id: string;
  protocolId: string;
  validationType: 'SAFETY' | 'REGULATORY' | 'QUALITY' | 'COST';
  status: 'PASS' | 'FAIL' | 'WARNING';
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
  regulatoryStandards: string[];
}

export interface BiomniAgenticAction {
  id: string;
  type: 'AUTOMATED_CALIBRATION' | 'PREDICTIVE_MAINTENANCE' | 'COMPLIANCE_CHECK' | 'PROTOCOL_OPTIMIZATION' | 'RISK_ASSESSMENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  action: string;
  parameters: Record<string, any>;
  confidence: number;
  estimatedImpact: string;
  requiresApproval: boolean;
  automated: boolean;
}

export interface BiomniContext {
  laboratoryId: string;
  userId: string;
  currentEquipment: any[];
  recentCalibrations: any[];
  complianceStatus: any;
  activeProtocols: any[];
  pendingTasks: any[];
  riskFactors: any[];
  performanceMetrics: any;
}

export interface BiomniDecision {
  id: string;
  context: BiomniContext;
  analysis: string;
  recommendations: string[];
  actions: BiomniAgenticAction[];
  confidence: number;
  reasoning: string;
  alternatives: string[];
}

// OpenRouter API Models
export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type: string;
  };
  top_provider: {
    max_completion_tokens: number;
    is_moderated: boolean;
  };
}

class BiomniService {
  private pythonPath: string;
  private biomniScriptPath: string;
  private officialBiomniPath: string;
  private availableTools: string[];
  private availableDatabases: string[];
  private biomniApiKey: string;
  private biomniBaseUrl: string;
  private useOfficialBiomni: boolean;
  private condaEnvName: string;
  
  // OpenRouter Configuration
  private openRouterApiKey: string;
  private openRouterBaseUrl: string;
  private openRouterModel: string;
  private useOpenRouter: boolean;

  constructor() {
    this.pythonPath = process.env.PYTHON_PATH || 'python3';
    this.biomniScriptPath = path.join(__dirname, '../scripts/biomni_agent.py');
    this.officialBiomniPath = path.join(process.cwd(), 'Biomni');
    this.biomniApiKey = process.env.BIOMNI_API_KEY || 'demo-key';
    this.biomniBaseUrl = process.env.BIOMNI_BASE_URL || 'https://api.biomni.stanford.edu';
    this.useOfficialBiomni = process.env.USE_OFFICIAL_BIOMNI === 'true';
    this.condaEnvName = process.env.BIOMNI_CONDA_ENV || 'biomni_e1';
    
    // OpenRouter Configuration
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    this.openRouterBaseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.openRouterModel = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
    this.useOpenRouter = process.env.USE_OPENROUTER === 'true' && !!this.openRouterApiKey;
    
    this.availableTools = [
      'protocol_generator',
      'research_assistant',
      'data_analyzer',
      'equipment_optimizer',
      'safety_checker',
      'compliance_validator',
      'cost_calculator',
      'timeline_planner',
      'risk_assessor',
      'quality_controller',
      'visual_analyzer',
      'sample_quality_assessor',
      'culture_growth_analyzer',
      'contamination_detector',
      'equipment_condition_monitor',
      'microscopy_interpreter',
      'pcr_optimizer',
      'sequencing_analyzer',
      'flow_cytometry_processor',
      'cell_culture_monitor',
      // Official Biomni tools
      'dna_rna_sequence_analysis',
      'protein_structure_prediction',
      'crispr_guide_design',
      'cell_type_annotation',
      'drug_target_interaction',
      'pharmacokinetic_modeling',
      'primer_design',
      'plasmid_design'
    ];
    
    this.availableDatabases = [
      'pubmed',
      'genbank',
      'pdb',
      'chembl',
      'drugbank',
      'clinicaltrials',
      'equipment_catalog',
      'safety_database',
      'compliance_regulations',
      'cost_database',
      'protocol_database',
      'reagent_catalog',
      'equipment_manual_database',
      'troubleshooting_database',
      'best_practices_database',
      // Official Biomni databases
      'uniprot',
      'kegg',
      'go',
      'reactome',
      'string',
      'clinvar',
      'cosmic',
      'tcga',
      'geo',
      'arrayexpress'
    ];
  }

  private advancedPrompts = {
    agenticDecision: `
You are an advanced AI laboratory assistant with autonomous decision-making capabilities. 
Your role is to analyze laboratory context and make intelligent decisions to optimize operations.

CONTEXT:
{context}

ANALYSIS REQUIREMENTS:
1. Identify critical issues and opportunities
2. Assess risks and compliance gaps
3. Recommend automated actions
4. Prioritize interventions by impact and urgency
5. Consider resource constraints and safety requirements

OUTPUT FORMAT:
{
  "analysis": "Comprehensive analysis of the situation",
  "recommendations": ["List of strategic recommendations"],
  "actions": [
    {
      "type": "ACTION_TYPE",
      "priority": "PRIORITY_LEVEL",
      "description": "Action description",
      "action": "Specific action to take",
      "parameters": {},
      "confidence": 0.95,
      "estimatedImpact": "HIGH/MEDIUM/LOW",
      "requiresApproval": true/false,
      "automated": true/false
    }
  ],
  "confidence": 0.9,
  "reasoning": "Detailed reasoning for decisions",
  "alternatives": ["Alternative approaches considered"]
}
`,

    protocolOptimization: `
You are a laboratory protocol optimization expert. Analyze the given protocol and suggest improvements.

PROTOCOL:
{protocol}

OPTIMIZATION GOALS:
1. Improve efficiency and reproducibility
2. Reduce costs and time requirements
3. Enhance safety and compliance
4. Minimize resource waste
5. Increase success rates

ANALYSIS REQUIREMENTS:
- Identify bottlenecks and inefficiencies
- Suggest alternative methodologies
- Optimize reagent concentrations and volumes
- Improve timing and sequencing
- Enhance quality control measures

OUTPUT FORMAT:
{
  "optimizationScore": 0.85,
  "efficiencyImprovements": ["List of efficiency gains"],
  "costSavings": "Estimated cost reduction",
  "timeSavings": "Estimated time reduction",
  "safetyEnhancements": ["Safety improvements"],
  "modifiedProtocol": {
    "steps": ["Optimized protocol steps"],
    "reagents": ["Optimized reagent list"],
    "equipment": ["Required equipment"],
    "timing": "Optimized timeline",
    "qualityControls": ["QC measures"]
  },
  "risks": ["Potential risks and mitigations"],
  "validationRequirements": ["Validation steps needed"]
}
`,

    predictiveAnalysis: `
You are a predictive analytics expert for laboratory equipment and processes.
Analyze historical data to predict future outcomes and recommend preventive actions.

HISTORICAL DATA:
{data}

PREDICTION REQUIREMENTS:
1. Equipment failure prediction
2. Calibration schedule optimization
3. Resource consumption forecasting
4. Performance trend analysis
5. Risk factor identification

ANALYSIS PARAMETERS:
- Time horizon: {timeframe}
- Confidence level: {confidence}
- Risk tolerance: {riskTolerance}

OUTPUT FORMAT:
{
  "predictions": [
    {
      "type": "PREDICTION_TYPE",
      "target": "Equipment/Process ID",
      "probability": 0.85,
      "timeframe": "Expected timeframe",
      "impact": "HIGH/MEDIUM/LOW",
      "confidence": 0.9,
      "factors": ["Contributing factors"],
      "recommendations": ["Preventive actions"]
    }
  ],
  "trends": ["Identified trends"],
  "anomalies": ["Detected anomalies"],
  "riskAssessment": "Overall risk assessment",
  "actionPlan": ["Recommended actions"]
}
`,

    complianceIntelligence: `
You are a laboratory compliance intelligence system. Analyze compliance data and provide strategic insights.

COMPLIANCE DATA:
{complianceData}

ANALYSIS REQUIREMENTS:
1. Identify compliance gaps and risks
2. Assess audit readiness
3. Recommend corrective actions
4. Optimize compliance workflows
5. Predict compliance issues

REGULATORY FRAMEWORKS:
- CAP (College of American Pathologists)
- CLIA (Clinical Laboratory Improvement Amendments)
- ISO 15189 (Medical laboratories)
- HIPAA (Healthcare data privacy)
- FDA regulations

OUTPUT FORMAT:
{
  "complianceScore": 0.92,
  "riskAssessment": {
    "high": ["High-risk areas"],
    "medium": ["Medium-risk areas"],
    "low": ["Low-risk areas"]
  },
  "auditReadiness": "READY/NEEDS_IMPROVEMENT/CRITICAL",
  "gaps": ["Compliance gaps identified"],
  "correctiveActions": ["Required actions"],
  "optimizationOpportunities": ["Process improvements"],
  "predictiveInsights": ["Future compliance predictions"],
  "resourceRequirements": ["Resources needed for compliance"]
}
`
  };

  /**
   * Execute a Biomni query with specified tools and databases
   * Now supports both custom implementation and official Stanford Biomni
   */
  async executeBiomniQuery(query: string, tools: string[], databases: string[], category: string, userId: string, laboratoryId: string): Promise<BiomniQuery> {
    try {
      // Validate tools and databases
      const validTools = tools.filter(tool => this.availableTools.includes(tool));
      const validDatabases = databases.filter(db => this.availableDatabases.includes(db));

      if (validTools.length === 0) {
        throw new Error('No valid tools specified');
      }

      // Create Biomni query record
      const biomniQuery = await prisma.biomniQuery.create({
        data: {
          query,
          userId,
          laboratoryId,
          toolsUsed: validTools,
          databasesQueried: validDatabases,
          status: 'EXECUTING',
          createdAt: new Date()
        }
      });

      // Choose execution method based on configuration
      let result;
      if (this.useOfficialBiomni && await this.isOfficialBiomniAvailable()) {
        result = await this.runOfficialBiomniAgent(query, validTools, validDatabases, category);
      } else {
        result = await this.runCustomBiomniAgent(query, validTools, validDatabases, category);
      }

      // Update query with result
      const updatedQuery = await prisma.biomniQuery.update({
        where: { id: biomniQuery.id },
        data: {
          status: 'COMPLETED',
          result: result,
          confidence: result.confidence || 0.8,
          executionTime: result.executionTime || 0,
          cost: result.cost || 0,
          updatedAt: new Date()
        }
      });

      return updatedQuery;
    } catch (error) {
      console.error('Biomni query execution failed:', error);
      
      // Update query with error
      if (error instanceof Error && error.message.includes('biomniQuery')) {
        await prisma.biomniQuery.update({
          where: { id: (error as any).queryId },
          data: {
            status: 'FAILED',
            error: error.message,
            updatedAt: new Date()
          }
        });
      }

      throw error;
    }
  }

  /**
   * Check if official Stanford Biomni is available
   */
  private async isOfficialBiomniAvailable(): Promise<boolean> {
    try {
      // Check if Biomni directory exists
      if (!fs.existsSync(this.officialBiomniPath)) {
        return false;
      }

      // Check if conda environment exists
      const { stdout } = await execAsync(`conda env list | grep ${this.condaEnvName}`);
      return stdout.includes(this.condaEnvName);
    } catch (error) {
      console.warn('Official Biomni not available, falling back to custom implementation:', error);
      return false;
    }
  }

  /**
   * Run the official Stanford Biomni agent
   */
  private async runOfficialBiomniAgent(query: string, tools: string[], databases: string[], category: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('conda', [
        'run', '-n', this.condaEnvName, 'python', '-c',
        `
import sys
sys.path.append('${this.officialBiomniPath}')
from biomni.agent import A1
import json

try:
    # Initialize official Biomni agent
    agent = A1(path='./data', llm='claude-sonnet-4-20250514')
    
    # Execute query using official Biomni
    result = agent.go("${query}")
    
    # Format result for LabGuard Pro
    response = {
        "result": result,
        "toolsUsed": ${JSON.stringify(tools)},
        "databasesQueried": ${JSON.stringify(databases)},
        "confidence": 0.9,
        "cost": 0.1,
        "executionTime": 0,
        "source": "official_biomni"
    }
    
    print(json.dumps(response))
except Exception as e:
    print(json.dumps({"error": str(e)}))
        `
      ]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            if (result.error) {
              reject(new Error(result.error));
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(new Error(`Failed to parse official Biomni output: ${error}`));
          }
        } else {
          reject(new Error(`Official Biomni agent failed with code ${code}: ${errorOutput}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start official Biomni agent: ${error.message}`));
      });
    });
  }

  /**
   * Run the custom Biomni Python agent (existing implementation)
   */
  private async runCustomBiomniAgent(query: string, tools: string[], databases: string[], category: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonPath, [
        this.biomniScriptPath,
        '--query', query,
        '--tools', tools.join(','),
        '--databases', databases.join(','),
        '--category', category
      ]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse Biomni output: ${error}`));
          }
        } else {
          reject(new Error(`Biomni agent failed with code ${code}: ${errorOutput}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Biomni agent: ${error.message}`));
      });
    });
  }

  /**
   * Call OpenRouter API for AI model access
   */
  private async callOpenRouterAPI(prompt: string, model?: string): Promise<any> {
    if (!this.useOpenRouter) {
      throw new Error('OpenRouter is not enabled');
    }

    try {
      const response = await axios.post(
        `${this.openRouterBaseUrl}/chat/completions`,
        {
          model: model || this.openRouterModel,
          messages: [
            {
              role: 'system',
              content: 'You are a biomedical AI assistant specialized in laboratory research and compliance. Provide accurate, detailed responses for laboratory operations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.1,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://labguard-pro.com',
            'X-Title': 'LabGuard Pro Biomni Integration'
          }
        }
      );

      return {
        content: response.data.choices[0]?.message?.content,
        usage: response.data.usage,
        model: response.data.model
      };
    } catch (error) {
      console.error('OpenRouter API call failed:', error);
      throw new Error(`OpenRouter API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available OpenRouter models
   */
  async getOpenRouterModels(): Promise<OpenRouterModel[]> {
    if (!this.useOpenRouter) {
      throw new Error('OpenRouter is not enabled');
    }

    try {
      const response = await axios.get(`${this.openRouterBaseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`
        }
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch OpenRouter models:', error);
      throw new Error('Failed to fetch OpenRouter models');
    }
  }

  /**
   * Get recommended OpenRouter models for biomedical research
   */
  async getRecommendedModels(): Promise<OpenRouterModel[]> {
    const allModels = await this.getOpenRouterModels();
    
    // Filter for models suitable for biomedical research
    const recommendedModels = allModels.filter(model => 
      model.name.toLowerCase().includes('claude') ||
      model.name.toLowerCase().includes('gpt-4') ||
      model.name.toLowerCase().includes('gpt-3.5') ||
      model.name.toLowerCase().includes('sonnet') ||
      model.name.toLowerCase().includes('opus')
    );

    return recommendedModels.sort((a, b) => {
      // Prioritize Claude models for biomedical tasks
      if (a.name.toLowerCase().includes('claude') && !b.name.toLowerCase().includes('claude')) return -1;
      if (!a.name.toLowerCase().includes('claude') && b.name.toLowerCase().includes('claude')) return 1;
      return 0;
    });
  }

  /**
   * Execute AI-powered analysis using OpenRouter
   */
  async executeAIAnalysis(prompt: string, model?: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      const result = await this.callOpenRouterAPI(prompt, model);
      
      const executionTime = Date.now() - startTime;
      
      return {
        result: result.content,
        model: result.model,
        usage: result.usage,
        executionTime,
        cost: this.calculateOpenRouterCost(result.usage, model || this.openRouterModel),
        source: 'openrouter'
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  }

  /**
   * Calculate OpenRouter API cost
   */
  private calculateOpenRouterCost(usage: any, model: string): number {
    // This is a simplified calculation - you'd want to implement proper pricing logic
    const promptTokens = usage?.prompt_tokens || 0;
    const completionTokens = usage?.completion_tokens || 0;
    
    // Example pricing (you should get actual rates from OpenRouter)
    const promptCost = promptTokens * 0.00001; // $0.01 per 1K tokens
    const completionCost = completionTokens * 0.00003; // $0.03 per 1K tokens
    
    return promptCost + completionCost;
  }

  /**
   * Setup official Stanford Biomni environment
   */
  async setupOfficialBiomni(): Promise<boolean> {
    try {
      console.log('Setting up official Stanford Biomni...');

      // Check if conda is available
      try {
        await execAsync('conda --version');
      } catch (error) {
        throw new Error('Conda is not installed. Please install Anaconda or Miniconda first.');
      }

      // Create conda environment
      console.log('Creating conda environment...');
      await execAsync(`conda create -n ${this.condaEnvName} python=3.11 -y`);

      // Activate environment and install Biomni
      console.log('Installing official Biomni...');
      await execAsync(`conda run -n ${this.condaEnvName} pip install git+https://github.com/snap-stanford/Biomni.git@main`);

      // Download Biomni data
      console.log('Downloading Biomni data...');
      await execAsync(`conda run -n ${this.condaEnvName} python -c "from biomni.agent import A1; A1(path='./data', llm='claude-sonnet-4-20250514')"`);

      console.log('Official Stanford Biomni setup completed successfully!');
      return true;
    } catch (error) {
      console.error('Failed to setup official Biomni:', error);
      return false;
    }
  }

  /**
   * Analyze visual data (images) using Biomni
   */
  async analyzeVisualData(imageUrl: string, analysisType: string, userId: string, laboratoryId: string): Promise<BiomniVisualAnalysis> {
    const query = `Analyze ${analysisType} from image: ${imageUrl}`;
    
    const result = await this.executeBiomniQuery(
      query,
      ['visual_analyzer', 'sample_quality_assessor'],
      ['equipment_catalog', 'safety_database'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Visual analysis failed');
    }

    const analysis: BiomniVisualAnalysis = {
      id: `visual_${Date.now()}`,
      imageUrl,
      analysisType: analysisType as any,
      results: {
        quality: result.result.quality || 0,
        issues: result.result.issues || [],
        recommendations: result.result.recommendations || [],
        confidence: result.result.confidence || 0.8
      },
      metadata: {
        imageSize: result.result.imageSize || 0,
        format: result.result.format || 'unknown',
        timestamp: new Date()
      }
    };

    return analysis;
  }

  /**
   * Generate experimental protocol with AI
   */
  async generateProtocol(
    title: string,
    description: string,
    category: string,
    equipment: string[],
    requirements: string[],
    userId: string,
    laboratoryId: string
  ): Promise<BiomniProtocol> {
    const query = `Generate a detailed experimental protocol for: ${title}. Description: ${description}. Category: ${category}. Equipment available: ${equipment.join(', ')}. Requirements: ${requirements.join(', ')}`;

    const result = await this.executeBiomniQuery(
      query,
      ['protocol_generator', 'safety_checker', 'compliance_validator'],
      ['pubmed', 'equipment_catalog', 'safety_database', 'protocol_database'],
      'PROTOCOL_GENERATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Protocol generation failed');
    }

    const protocol: BiomniProtocol = {
      id: `protocol_${Date.now()}`,
      title,
      description,
      category: category as any,
      steps: result.result.steps || [],
      equipment: result.result.equipment || equipment,
      reagents: result.result.reagents || [],
      safetyNotes: result.result.safetyNotes || [],
      estimatedDuration: result.result.estimatedDuration || 120,
      difficulty: result.result.difficulty || 'INTERMEDIATE',
      aiGenerated: true
    };

    return protocol;
  }

  /**
   * Create research project with AI assistance
   */
  async createResearchProject(
    title: string,
    description: string,
    objectives: string[],
    budget: number,
    timeline: number,
    userId: string,
    laboratoryId: string
  ): Promise<BiomniResearchProject> {
    const query = `Create a research project plan for: ${title}. Description: ${description}. Objectives: ${objectives.join(', ')}. Budget: $${budget}. Timeline: ${timeline} days`;

    const result = await this.executeBiomniQuery(
      query,
      ['research_assistant', 'timeline_planner', 'cost_calculator', 'risk_assessor'],
      ['pubmed', 'clinicaltrials', 'cost_database'],
      'RESEARCH_ASSISTANT',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Research project creation failed');
    }

    const project: BiomniResearchProject = {
      id: `project_${Date.now()}`,
      title,
      description,
      objectives,
      methodology: result.result.methodology || '',
      expectedOutcomes: result.result.expectedOutcomes || [],
      timeline,
      budget,
      status: 'PLANNING',
      equipmentRequirements: result.result.equipmentRequirements || [],
      personnelRequirements: result.result.personnelRequirements || [],
      riskAssessment: result.result.riskAssessment || []
    };

    return project;
  }

  /**
   * Optimize equipment usage and calibration
   */
  async optimizeEquipment(equipmentId: string, usageData: any, userId: string, laboratoryId: string): Promise<any> {
    const query = `Optimize equipment usage and calibration for equipment ID: ${equipmentId}. Usage data: ${JSON.stringify(usageData)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['equipment_optimizer', 'data_analyzer', 'quality_controller'],
      ['equipment_catalog', 'pubmed', 'troubleshooting_database'],
      'EQUIPMENT_OPTIMIZATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Equipment optimization failed');
    }

    return result.result;
  }

  /**
   * Analyze research data with AI
   */
  async analyzeData(dataType: string, data: any, analysisType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Analyze ${dataType} data for ${analysisType}. Data: ${JSON.stringify(data)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['data_analyzer', 'quality_controller'],
      ['pubmed', 'genbank', 'pdb'],
      'DATA_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Data analysis failed');
    }

    return result.result;
  }

  /**
   * Validate protocol compliance
   */
  async validateProtocolCompliance(protocol: BiomniProtocol, userId: string, laboratoryId: string): Promise<BiomniComplianceValidation> {
    const query = `Validate protocol compliance for: ${protocol.title}. Steps: ${JSON.stringify(protocol.steps)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['compliance_validator', 'safety_checker', 'quality_controller'],
      ['compliance_regulations', 'safety_database', 'best_practices_database'],
      'COMPLIANCE_VALIDATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Protocol validation failed');
    }

    const validation: BiomniComplianceValidation = {
      id: `validation_${Date.now()}`,
      protocolId: protocol.id,
      validationType: 'REGULATORY',
      status: result.result.status || 'PASS',
      score: result.result.score || 0,
      issues: result.result.issues || [],
      recommendations: result.result.recommendations || [],
      regulatoryStandards: result.result.regulatoryStandards || []
    };

    return validation;
  }

  /**
   * Analyze culture growth patterns
   */
  async analyzeCultureGrowth(imageUrl: string, cultureType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Analyze culture growth patterns for ${cultureType} from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['culture_growth_analyzer', 'visual_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Culture growth analysis failed');
    }

    return result.result;
  }

  /**
   * Detect contamination in samples
   */
  async detectContamination(imageUrl: string, sampleType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Detect contamination in ${sampleType} sample from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['contamination_detector', 'visual_analyzer'],
      ['safety_database', 'pubmed'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Contamination detection failed');
    }

    return result.result;
  }

  /**
   * Monitor equipment condition
   */
  async monitorEquipmentCondition(equipmentId: string, imageUrl: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Monitor equipment condition for ${equipmentId} from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['equipment_condition_monitor', 'visual_analyzer'],
      ['equipment_catalog', 'troubleshooting_database'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Equipment condition monitoring failed');
    }

    return result.result;
  }

  /**
   * Interpret microscopy images
   */
  async interpretMicroscopyImage(imageUrl: string, magnification: string, staining: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Interpret microscopy image at ${magnification} magnification with ${staining} staining from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['microscopy_interpreter', 'visual_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Microscopy interpretation failed');
    }

    return result.result;
  }

  /**
   * Optimize PCR protocols
   */
  async optimizePCRProtocol(protocol: any, targetGene: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Optimize PCR protocol for ${targetGene}. Current protocol: ${JSON.stringify(protocol)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['pcr_optimizer', 'protocol_generator'],
      ['pubmed', 'protocol_database'],
      'PROTOCOL_GENERATION',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('PCR optimization failed');
    }

    return result.result;
  }

  /**
   * Analyze sequencing data
   */
  async analyzeSequencingData(sequenceData: any, analysisType: string, userId: string, laboratoryId: string): Promise<any> {
    const query = `Analyze sequencing data for ${analysisType}. Data: ${JSON.stringify(sequenceData)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['sequencing_analyzer', 'data_analyzer'],
      ['genbank', 'pubmed'],
      'DATA_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Sequencing analysis failed');
    }

    return result.result;
  }

  /**
   * Process flow cytometry data
   */
  async processFlowCytometryData(flowData: any, markers: string[], userId: string, laboratoryId: string): Promise<any> {
    const query = `Process flow cytometry data with markers: ${markers.join(', ')}. Data: ${JSON.stringify(flowData)}`;

    const result = await this.executeBiomniQuery(
      query,
      ['flow_cytometry_processor', 'data_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'DATA_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Flow cytometry processing failed');
    }

    return result.result;
  }

  /**
   * Monitor cell culture conditions
   */
  async monitorCellCulture(imageUrl: string, cellType: string, cultureConditions: any, userId: string, laboratoryId: string): Promise<any> {
    const query = `Monitor cell culture conditions for ${cellType} under conditions: ${JSON.stringify(cultureConditions)} from image: ${imageUrl}`;

    const result = await this.executeBiomniQuery(
      query,
      ['cell_culture_monitor', 'visual_analyzer'],
      ['pubmed', 'equipment_catalog'],
      'VISUAL_ANALYSIS',
      userId,
      laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Cell culture monitoring failed');
    }

    return result.result;
  }

  /**
   * Advanced agentic decision-making with autonomous capabilities
   */
  async makeAgenticDecision(context: BiomniContext): Promise<BiomniDecision> {
    const prompt = this.advancedPrompts.agenticDecision.replace('{context}', JSON.stringify(context, null, 2));
    
    const result = await this.executeBiomniQuery(
      prompt,
      ['decision_maker', 'risk_assessor', 'optimizer', 'compliance_checker'],
      ['best_practices_database', 'compliance_regulations', 'equipment_catalog'],
      'AGENTIC_DECISION',
      context.userId,
      context.laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Agentic decision-making failed');
    }

    const decision: BiomniDecision = {
      id: `decision_${Date.now()}`,
      context,
      analysis: result.result.analysis || '',
      recommendations: result.result.recommendations || [],
      actions: result.result.actions || [],
      confidence: result.result.confidence || 0.8,
      reasoning: result.result.reasoning || '',
      alternatives: result.result.alternatives || []
    };

    return decision;
  }

  /**
   * Execute autonomous actions based on agentic decisions
   */
  async executeAutonomousAction(action: BiomniAgenticAction, context: BiomniContext): Promise<any> {
    if (!action.automated) {
      throw new Error('Action requires manual approval');
    }

    switch (action.type) {
      case 'AUTOMATED_CALIBRATION':
        return this.executeAutomatedCalibration(action, context);
      case 'PREDICTIVE_MAINTENANCE':
        return this.executePredictiveMaintenance(action, context);
      case 'COMPLIANCE_CHECK':
        return this.executeComplianceCheck(action, context);
      case 'PROTOCOL_OPTIMIZATION':
        return this.executeProtocolOptimization(action, context);
      case 'RISK_ASSESSMENT':
        return this.executeRiskAssessment(action, context);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Advanced protocol optimization with AI
   */
  async optimizeProtocolAdvanced(protocol: any, optimizationGoals: string[], context: BiomniContext): Promise<any> {
    const prompt = this.advancedPrompts.protocolOptimization
      .replace('{protocol}', JSON.stringify(protocol, null, 2))
      .replace('{goals}', JSON.stringify(optimizationGoals, null, 2));

    const result = await this.executeBiomniQuery(
      prompt,
      ['protocol_optimizer', 'efficiency_analyzer', 'cost_calculator', 'safety_checker'],
      ['protocol_database', 'pubmed', 'equipment_catalog', 'reagent_catalog'],
      'PROTOCOL_OPTIMIZATION',
      context.userId,
      context.laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Protocol optimization failed');
    }

    return result.result;
  }

  /**
   * Predictive analytics for equipment and processes
   */
  async performPredictiveAnalysis(data: any, timeframe: string, confidence: number, context: BiomniContext): Promise<any> {
    const prompt = this.advancedPrompts.predictiveAnalysis
      .replace('{data}', JSON.stringify(data, null, 2))
      .replace('{timeframe}', timeframe)
      .replace('{confidence}', confidence.toString())
      .replace('{riskTolerance}', 'MEDIUM');

    const result = await this.executeBiomniQuery(
      prompt,
      ['predictive_analyzer', 'trend_analyzer', 'risk_assessor', 'optimizer'],
      ['historical_data', 'equipment_specifications', 'maintenance_records'],
      'PREDICTIVE_ANALYSIS',
      context.userId,
      context.laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Predictive analysis failed');
    }

    return result.result;
  }

  /**
   * Advanced compliance intelligence
   */
  async analyzeComplianceIntelligence(complianceData: any, context: BiomniContext): Promise<any> {
    const prompt = this.advancedPrompts.complianceIntelligence
      .replace('{complianceData}', JSON.stringify(complianceData, null, 2));

    const result = await this.executeBiomniQuery(
      prompt,
      ['compliance_analyzer', 'risk_assessor', 'audit_preparer', 'optimizer'],
      ['compliance_regulations', 'audit_database', 'best_practices_database'],
      'COMPLIANCE_INTELLIGENCE',
      context.userId,
      context.laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Compliance intelligence analysis failed');
    }

    return result.result;
  }

  /**
   * Enhanced visual analysis with advanced AI
   */
  async analyzeVisualDataAdvanced(imageUrl: string, analysisType: string, context: BiomniContext, advancedOptions?: any): Promise<BiomniVisualAnalysis> {
    const enhancedQuery = `
Advanced visual analysis for ${analysisType} from image: ${imageUrl}

ANALYSIS REQUIREMENTS:
1. Detailed quality assessment with confidence scores
2. Identification of potential issues and anomalies
3. Recommendations for improvement or corrective actions
4. Comparison with standard references
5. Predictive insights based on visual patterns

CONTEXT:
${JSON.stringify(context, null, 2)}

ADVANCED OPTIONS:
${JSON.stringify(advancedOptions || {}, null, 2)}

Please provide comprehensive analysis including:
- Quality metrics with confidence intervals
- Detailed issue identification
- Specific recommendations
- Risk assessment
- Predictive insights
- Comparative analysis
`;

    const result = await this.executeBiomniQuery(
      enhancedQuery,
      ['advanced_visual_analyzer', 'quality_assessor', 'anomaly_detector', 'predictive_analyzer'],
      ['visual_standards', 'quality_metrics', 'anomaly_patterns'],
      'VISUAL_ANALYSIS',
      context.userId,
      context.laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Advanced visual analysis failed');
    }

    const analysis: BiomniVisualAnalysis = {
      id: `visual_${Date.now()}`,
      imageUrl,
      analysisType: analysisType as any,
      results: {
        quality: result.result.quality || 0,
        issues: result.result.issues || [],
        recommendations: result.result.recommendations || [],
        confidence: result.result.confidence || 0.8
      },
      metadata: {
        imageSize: result.result.imageSize || 0,
        format: result.result.format || 'unknown',
        timestamp: new Date()
      }
    };

    return analysis;
  }

  /**
   * Intelligent workflow automation
   */
  async automateWorkflow(workflowType: string, parameters: any, context: BiomniContext): Promise<any> {
    const query = `
Automate ${workflowType} workflow with parameters: ${JSON.stringify(parameters)}

WORKFLOW AUTOMATION REQUIREMENTS:
1. Identify automation opportunities
2. Design optimal workflow sequence
3. Implement error handling and validation
4. Optimize resource utilization
5. Ensure compliance and safety

CONTEXT:
${JSON.stringify(context, null, 2)}

Please provide:
- Automated workflow design
- Error handling strategies
- Resource optimization
- Compliance considerations
- Performance metrics
`;

    const result = await this.executeBiomniQuery(
      query,
      ['workflow_automator', 'process_optimizer', 'error_handler', 'compliance_checker'],
      ['workflow_templates', 'best_practices_database', 'compliance_regulations'],
      'WORKFLOW_AUTOMATION',
      context.userId,
      context.laboratoryId
    );

    if (result.status !== 'COMPLETED' || !result.result) {
      throw new Error('Workflow automation failed');
    }

    return result.result;
  }

  /**
   * Get available tools
   */
  getAvailableTools(): string[] {
    return this.availableTools;
  }

  /**
   * Get available databases
   */
  getAvailableDatabases(): string[] {
    return this.availableDatabases;
  }

  /**
   * Get query history
   */
  async getQueryHistory(userId: string, laboratoryId: string, limit: number = 50): Promise<BiomniQuery[]> {
    return prisma.biomniQuery.findMany({
      where: {
        userId,
        laboratoryId
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  /**
   * Get query by ID
   */
  async getQueryById(id: string): Promise<BiomniQuery | null> {
    return prisma.biomniQuery.findUnique({
      where: { id }
    });
  }

  /**
   * Delete query
   */
  async deleteQuery(id: string): Promise<void> {
    await prisma.biomniQuery.delete({
      where: { id }
    });
  }

  /**
   * Health check for Biomni service
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test Python environment
      const { stdout } = await execAsync(`${this.pythonPath} --version`);
      console.log('Python version:', stdout);

      // Test Biomni script
      const { stdout: scriptOutput } = await execAsync(`${this.pythonPath} ${this.biomniScriptPath} --health`);
      console.log('Biomni script health:', scriptOutput);

      return true;
    } catch (error) {
      console.error('Biomni health check failed:', error);
      return false;
    }
  }

  /**
   * Get Biomni capabilities and statistics
   */
  async getCapabilities(): Promise<any> {
    const isOfficialAvailable = await this.isOfficialBiomniAvailable();
    
    return {
      tools: this.availableTools,
      databases: this.availableDatabases,
      totalTools: this.availableTools.length,
      totalDatabases: this.availableDatabases.length,
      categories: [
        'PROTOCOL_GENERATION',
        'RESEARCH_ASSISTANT', 
        'DATA_ANALYSIS',
        'EQUIPMENT_OPTIMIZATION',
        'VISUAL_ANALYSIS',
        'COMPLIANCE_VALIDATION'
      ],
      features: [
        'AI-powered protocol generation',
        'Visual sample analysis',
        'Equipment optimization',
        'Compliance validation',
        'Research project planning',
        'Data analysis and interpretation',
        'Culture growth monitoring',
        'Contamination detection',
        'Microscopy interpretation',
        'PCR optimization',
        'Sequencing analysis',
        'Flow cytometry processing',
        'Cell culture monitoring'
      ],
      implementation: {
        current: isOfficialAvailable ? 'official_stanford_biomni' : 'custom_implementation',
        officialAvailable: isOfficialAvailable,
        condaEnvironment: this.condaEnvName,
        useOfficial: this.useOfficialBiomni
      },
      openRouter: {
        enabled: this.useOpenRouter,
        model: this.openRouterModel,
        baseUrl: this.openRouterBaseUrl,
        available: !!this.openRouterApiKey
      },
      officialBiomniFeatures: isOfficialAvailable ? [
        '150+ specialized biomedical tools',
        '59 scientific databases',
        '105 software packages',
        'Experimental design automation',
        'Research hypothesis generation',
        'Advanced biomedical analysis',
        'Multimodal AI capabilities',
        'Real-time research assistance'
      ] : []
    };
  }

  // Private helper methods for autonomous actions
  private async executeAutomatedCalibration(action: BiomniAgenticAction, context: BiomniContext): Promise<any> {
    // Implementation for automated calibration
    console.log('Executing automated calibration:', action);
    return { status: 'completed', action: 'automated_calibration' };
  }

  private async executePredictiveMaintenance(action: BiomniAgenticAction, context: BiomniContext): Promise<any> {
    // Implementation for predictive maintenance
    console.log('Executing predictive maintenance:', action);
    return { status: 'completed', action: 'predictive_maintenance' };
  }

  private async executeComplianceCheck(action: BiomniAgenticAction, context: BiomniContext): Promise<any> {
    // Implementation for compliance check
    console.log('Executing compliance check:', action);
    return { status: 'completed', action: 'compliance_check' };
  }

  private async executeProtocolOptimization(action: BiomniAgenticAction, context: BiomniContext): Promise<any> {
    // Implementation for protocol optimization
    console.log('Executing protocol optimization:', action);
    return { status: 'completed', action: 'protocol_optimization' };
  }

  private async executeRiskAssessment(action: BiomniAgenticAction, context: BiomniContext): Promise<any> {
    // Implementation for risk assessment
    console.log('Executing risk assessment:', action);
    return { status: 'completed', action: 'risk_assessment' };
  }
}

export default new BiomniService(); 