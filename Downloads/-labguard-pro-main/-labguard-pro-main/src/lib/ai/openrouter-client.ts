// OpenRouter Client for Frontend Integration
// This connects the frontend to OpenRouter API for flagship AI models

interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
}

interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ModelInfo {
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
}

class OpenRouterClient {
  private config: OpenRouterConfig;
  private availableModels: ModelInfo[] = [];

  constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      defaultModel: process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'
    };
  }

  // Check if OpenRouter is available
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.availableModels = data.data || [];
        return true;
      }
      return false;
    } catch (error) {
      console.error('OpenRouter availability check failed:', error);
      return false;
    }
  }

  // Get available models
  async getAvailableModels(): Promise<ModelInfo[]> {
    if (this.availableModels.length === 0) {
      await this.checkAvailability();
    }
    return this.availableModels;
  }

  // Get recommended models for different tasks
  getRecommendedModels() {
    return {
      'PROTOCOL_GENERATION': 'anthropic/claude-3.5-sonnet',
      'RESEARCH_ASSISTANT': 'anthropic/claude-3-opus',
      'DATA_ANALYSIS': 'anthropic/claude-3.5-sonnet',
      'COMPLIANCE_VALIDATION': 'openai/gpt-4o',
      'VISUAL_ANALYSIS': 'anthropic/claude-3.5-sonnet',
      'EQUIPMENT_OPTIMIZATION': 'google/gemini-pro'
    };
  }

  // Generate response using OpenRouter
  async generateResponse(
    prompt: string, 
    model?: string, 
    context?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      systemPrompt?: string;
    }
  ): Promise<OpenRouterResponse> {
    const selectedModel = model || this.config.defaultModel;
    
    const messages = [];
    
    // Add system prompt if provided
    if (options?.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt
      });
    }
    
    // Add context if provided
    if (context) {
      messages.push({
        role: 'system',
        content: `Context: ${context}`
      });
    }
    
    // Add user prompt
    messages.push({
      role: 'user',
      content: prompt
    });

    const requestBody: OpenRouterRequest = {
      model: selectedModel,
      messages,
      max_tokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.1,
      stream: false
    };

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://labguard-pro.com',
        'X-Title': 'LabGuard Pro Biomni Integration'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Generate protocol using OpenRouter
  async generateProtocol(
    objective: string,
    context: string,
    tools: string[] = [],
    databases: string[] = []
  ): Promise<OpenRouterResponse> {
    const systemPrompt = `You are a biomedical AI assistant specialized in laboratory protocol generation. 
    You have access to 150+ specialized tools and 59 scientific databases.
    
    Available tools: ${tools.join(', ')}
    Available databases: ${databases.join(', ')}
    
    Generate a detailed, step-by-step laboratory protocol that is:
    1. Scientifically rigorous and accurate
    2. Optimized for efficiency and reproducibility
    3. Compliant with laboratory safety standards
    4. Cost-effective and resource-efficient
    5. Suitable for the specified laboratory context
    
    Format the response as a structured protocol with clear sections.`;

    return this.generateResponse(
      `Generate a laboratory protocol for: ${objective}`,
      'anthropic/claude-3.5-sonnet',
      context,
      {
        systemPrompt,
        maxTokens: 2000,
        temperature: 0.1
      }
    );
  }

  // Analyze laboratory data using OpenRouter
  async analyzeLabData(
    data: any,
    analysisType: 'qc' | 'equipment' | 'compliance' | 'research',
    context: string
  ): Promise<OpenRouterResponse> {
    const systemPrompts = {
      qc: `You are a quality control expert analyzing laboratory QC data. 
      Provide detailed analysis of trends, identify potential issues, and recommend corrective actions.`,
      equipment: `You are an equipment optimization specialist. 
      Analyze equipment performance data and provide recommendations for calibration, maintenance, and optimization.`,
      compliance: `You are a laboratory compliance expert. 
      Analyze compliance data and provide recommendations to ensure regulatory requirements are met.`,
      research: `You are a biomedical research assistant. 
      Analyze research data and provide insights, interpretations, and recommendations for next steps.`
    };

    return this.generateResponse(
      `Analyze this ${analysisType} data: ${JSON.stringify(data)}`,
      'anthropic/claude-3.5-sonnet',
      context,
      {
        systemPrompt: systemPrompts[analysisType],
        maxTokens: 1500,
        temperature: 0.1
      }
    );
  }

  // Calculate cost for a request
  calculateCost(tokens: number, model: string): number {
    const pricing = {
      'anthropic/claude-3.5-sonnet': 0.000003, // $3 per 1M tokens
      'anthropic/claude-3-opus': 0.000015,      // $15 per 1M tokens
      'openai/gpt-4o': 0.000005,                // $5 per 1M tokens
      'google/gemini-pro': 0.0000035            // $3.5 per 1M tokens
    };

    const rate = pricing[model] || pricing['anthropic/claude-3.5-sonnet'];
    return (tokens / 1000000) * rate;
  }

  // Get model capabilities
  getModelCapabilities(model: string) {
    const capabilities = {
      'anthropic/claude-3.5-sonnet': {
        maxTokens: 200000,
        modalities: ['text'],
        strengths: ['Complex reasoning', 'Code generation', 'Analysis'],
        bestFor: ['Protocol generation', 'Data analysis', 'Research assistance']
      },
      'anthropic/claude-3-opus': {
        maxTokens: 200000,
        modalities: ['text'],
        strengths: ['Most capable', 'Advanced reasoning', 'Creative tasks'],
        bestFor: ['Complex research', 'Advanced analysis', 'Creative problem solving']
      },
      'openai/gpt-4o': {
        maxTokens: 128000,
        modalities: ['text', 'vision'],
        strengths: ['General purpose', 'Multimodal', 'Balanced performance'],
        bestFor: ['General tasks', 'Visual analysis', 'Compliance validation']
      },
      'google/gemini-pro': {
        maxTokens: 1000000,
        modalities: ['text'],
        strengths: ['Large context', 'Cost effective', 'Technical tasks'],
        bestFor: ['Technical documentation', 'Equipment optimization', 'Cost-sensitive tasks']
      }
    };

    return capabilities[model] || capabilities['anthropic/claude-3.5-sonnet'];
  }
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient();

// Export types for use in components
export type {
  OpenRouterRequest,
  OpenRouterResponse,
  ModelInfo
}; 