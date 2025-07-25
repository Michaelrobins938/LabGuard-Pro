// Stanford Biomni AI Client
// Based on official repository: https://github.com/snap-stanford/Biomni
// Connects to local Biomni installation or web interface

interface BiomniRequest {
  query: string;
  context?: string;
  tools?: string[];
  databases?: string[];
  userId: string;
  labId: string;
  mode?: 'co-pilot' | 'autonomous' | 'assisted';
  dataFiles?: File[];
  analysisType?: 'bioinformatics' | 'protocol_design' | 'literature_review' | 'data_analysis' | 'hypothesis_generation';
}

interface BiomniResponse {
  result: string;
  toolsUsed: string[];
  databasesQueried: string[];
  confidence: number;
  executionTime: number;
  cost: number;
  generatedProtocols?: any[];
  dataInsights?: any[];
  recommendations?: string[];
  nextSteps?: string[];
  citations?: string[];
}

interface BiomniAnalysis {
  type: 'genomics' | 'proteomics' | 'imaging' | 'clinical' | 'literature';
  data: any;
  insights: string[];
  confidence: number;
  recommendations: string[];
}

export class BiomniClient {
  private baseUrl: string;
  private anthropicApiKey: string;
  private openaiApiKey: string;
  private awsBedrockToken: string;
  private awsRegion: string;

  constructor() {
    // Use local Biomni installation or web interface
    this.baseUrl = process.env.NEXT_PUBLIC_BIOMNI_API_URL || 'http://localhost:8000';
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.awsBedrockToken = process.env.AWS_BEARER_TOKEN_BEDROCK || '';
    this.awsRegion = process.env.AWS_REGION || 'us-east-1';
  }

  async generateResponse(query: string, context: any): Promise<string> {
    try {
      const request: BiomniRequest = {
        query,
        context: JSON.stringify(context),
        userId: context.userId || 'default-user',
        labId: context.labId || 'default-lab',
        mode: 'assisted'
      };

      const response = await this.queryBiomni(request);
      return response.result;
    } catch (error) {
      console.error('Biomni API error:', error);
      return this.getFallbackResponse(query);
    }
  }

  async analyzeLabContext(context: any): Promise<{ suggestedActions: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical'; category: string; }> }> {
    try {
      const request: BiomniRequest = {
        query: `Analyze this laboratory context and suggest actions: ${JSON.stringify(context)}`,
        context: JSON.stringify(context),
        userId: context.userId || 'default-user',
        labId: context.labId || 'default-lab',
        mode: 'co-pilot'
      };

      const response = await this.queryBiomni(request);
      return this.parseSuggestedActions(response.result);
    } catch (error) {
      console.error('Biomni context analysis error:', error);
      return { suggestedActions: [] };
    }
  }

  async designProtocol(experimentDescription: string, context: any): Promise<BiomniResponse> {
    try {
      const request: BiomniRequest = {
        query: `Design an experimental protocol for: ${experimentDescription}`,
        context: JSON.stringify(context),
        userId: context.userId || 'default-user',
        labId: context.labId || 'default-lab',
        mode: 'autonomous',
        analysisType: 'protocol_design'
      };

      return await this.queryBiomni(request);
    } catch (error) {
      console.error('Biomni protocol design error:', error);
      return {
        result: `Protocol design temporarily unavailable. Please try the web interface at biomni.stanford.edu for: ${experimentDescription}`,
        toolsUsed: [],
        databasesQueried: [],
        confidence: 0.5,
        executionTime: 0,
        cost: 0
      };
    }
  }

  async analyzeGenomicData(data: any, context: any): Promise<BiomniAnalysis> {
    try {
      const request: BiomniRequest = {
        query: `Analyze this genomic data: ${JSON.stringify(data)}`,
        context: JSON.stringify(context),
        userId: context.userId || 'default-user',
        labId: context.labId || 'default-lab',
        mode: 'autonomous',
        analysisType: 'bioinformatics'
      };

      const response = await this.queryBiomni(request);
      return {
        type: 'genomics',
        data,
        insights: this.extractInsights(response.result),
        confidence: response.confidence,
        recommendations: response.recommendations || []
      };
    } catch (error) {
      console.error('Biomni genomic analysis error:', error);
      return {
        type: 'genomics',
        data,
        insights: ['Analysis temporarily unavailable. Please use biomni.stanford.edu'],
        confidence: 0.5,
        recommendations: ['Try the web interface for detailed genomic analysis']
      };
    }
  }

  async reviewLiterature(topic: string, context: any): Promise<BiomniResponse> {
    try {
      const request: BiomniRequest = {
        query: `Conduct a literature review on: ${topic}`,
        context: JSON.stringify(context),
        userId: context.userId || 'default-user',
        labId: context.labId || 'default-lab',
        mode: 'autonomous',
        analysisType: 'literature_review'
      };

      return await this.queryBiomni(request);
    } catch (error) {
      console.error('Biomni literature review error:', error);
      return {
        result: `Literature review temporarily unavailable. Please try biomni.stanford.edu for: ${topic}`,
        toolsUsed: [],
        databasesQueried: [],
        confidence: 0.5,
        executionTime: 0,
        cost: 0
      };
    }
  }

  async generateHypothesis(data: any, context: any): Promise<BiomniResponse> {
    try {
      const request: BiomniRequest = {
        query: `Generate research hypotheses based on this data: ${JSON.stringify(data)}`,
        context: JSON.stringify(context),
        userId: context.userId || 'default-user',
        labId: context.labId || 'default-lab',
        mode: 'autonomous',
        analysisType: 'hypothesis_generation'
      };

      return await this.queryBiomni(request);
    } catch (error) {
      console.error('Biomni hypothesis generation error:', error);
      return {
        result: `Hypothesis generation temporarily unavailable. Please try biomni.stanford.edu`,
        toolsUsed: [],
        databasesQueried: [],
        confidence: 0.5,
        executionTime: 0,
        cost: 0
      };
    }
  }

  private async queryBiomni(request: BiomniRequest): Promise<BiomniResponse> {
    // Check if we have the required API keys
    if (!this.anthropicApiKey && !this.openaiApiKey && !this.awsBedrockToken) {
      throw new Error('No API keys configured. Please set ANTHROPIC_API_KEY, OPENAI_API_KEY, or AWS_BEARER_TOKEN_BEDROCK');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.anthropicApiKey || this.openaiApiKey || this.awsBedrockToken}`
    };

    if (this.awsBedrockToken) {
      headers['X-AWS-Region'] = this.awsRegion;
    }

    const response = await fetch(`${this.baseUrl}/api/v1/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Biomni API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private parseSuggestedActions(result: string): { suggestedActions: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical'; category: string; }> } {
    const actions: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical'; category: string; }> = [];
    
    // Parse the result for suggested actions
    const lines = result.split('\n');
    for (const line of lines) {
      if (line.includes('suggest') || line.includes('recommend') || line.includes('action')) {
        const title = this.extractActionTitle(line);
        const priority = this.determinePriority(line);
        const category = this.determineCategory(line);
        
        actions.push({
          title,
          description: line,
          priority,
          category
        });
      }
    }

    return { suggestedActions: actions };
  }

  private extractActionTitle(text: string): string {
    // Extract a meaningful title from the action text
    const words = text.split(' ').slice(0, 5);
    return words.join(' ') + '...';
  }

  private determinePriority(text: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('critical') || lowerText.includes('urgent') || lowerText.includes('immediate')) {
      return 'critical';
    }
    if (lowerText.includes('high') || lowerText.includes('important')) {
      return 'high';
    }
    if (lowerText.includes('low') || lowerText.includes('optional')) {
      return 'low';
    }
    return 'medium';
  }

  private determineCategory(text: string): string {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('protocol') || lowerText.includes('experiment')) {
      return 'Protocol Design';
    }
    if (lowerText.includes('analysis') || lowerText.includes('data')) {
      return 'Data Analysis';
    }
    if (lowerText.includes('literature') || lowerText.includes('review')) {
      return 'Literature Review';
    }
    if (lowerText.includes('equipment') || lowerText.includes('calibration')) {
      return 'Equipment Management';
    }
    if (lowerText.includes('compliance') || lowerText.includes('qc')) {
      return 'Quality Control';
    }
    return 'General';
  }

  private extractInsights(result: string): string[] {
    const insights: string[] = [];
    const lines = result.split('\n');
    
    for (const line of lines) {
      if (line.includes('insight') || line.includes('finding') || line.includes('observation')) {
        insights.push(line.trim());
      }
    }
    
    return insights.length > 0 ? insights : ['Analysis completed successfully'];
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private getFallbackResponse(query: string): string {
    return `I'm currently connecting to Stanford's Biomni AI system. For immediate assistance with "${query}", please visit biomni.stanford.edu or ensure your API keys are properly configured.`;
  }

  // Check if Biomni is available
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const biomniClient = new BiomniClient(); 