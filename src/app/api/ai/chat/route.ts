import { NextRequest, NextResponse } from 'next/server'
import { biomniClient } from '@/lib/ai/biomni-client'
import BiomniService from '@/lib/ai/biomni-integration'
import { contextAnalyzer } from '@/lib/ai/context-analyzer'
import { withRateLimit, aiRateLimiter } from '@/lib/rate-limit'
import OpenAI from 'openai'

// Initialize OpenAI client for real AI responses
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Initialize BiomniService instance
const biomniIntegration = new BiomniService()
import { validateChatInput } from '@/lib/validation'

// Enhanced chat API route with real AI integration
export async function POST(req: NextRequest) {
  return withRateLimit(req, aiRateLimiter, async () => {
    try {
      const body = await req.json()
      
      // Validate input
      const validation = validateChatInput(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: (validation as { success: false; errors: string[] }).errors },
          { status: 400 }
        )
      }

      const { messages, stream = false, tools = [] } = validation.data
      const lastMessage = messages[messages.length - 1]
      
      if (!lastMessage || lastMessage.role !== 'user') {
        return NextResponse.json(
          { error: 'Invalid message format' },
          { status: 400 }
        )
      }

      const userInput = lastMessage.content
      const lowerInput = userInput.toLowerCase()
      
      // Get current context
      const context = await contextAnalyzer.getCurrentContext()
      
      // Check if streaming is requested
      if (stream) {
        return handleStreamingResponse(userInput, context, lowerInput, messages)
      }
      
      // Handle regular response
      return handleRegularResponse(userInput, context, lowerInput, messages)

    } catch (error) {
      console.error('Chat API error:', error)
      
      // Fallback response
      const fallbackResponse = getFallbackResponse('')
      
      return NextResponse.json({
        id: Date.now().toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: Date.now()
      })
    }
  })
}

// Handle streaming responses for real-time chat experience
async function handleStreamingResponse(userInput: string, context: any, lowerInput: string, messages: any[]) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial response
        controller.enqueue(encoder.encode('data: {"type": "start"}\n\n'))
        
        // Generate real AI response
        const response = await generateRealAIResponse(userInput, context, lowerInput, messages)
        
        // Stream the response in chunks
        const chunks = response.split(' ')
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i] + (i < chunks.length - 1 ? ' ' : '')
          controller.enqueue(encoder.encode(`data: {"type": "token", "content": "${chunk}"}\n\n`))
          
          // Add small delay for realistic streaming effect
          await new Promise(resolve => setTimeout(resolve, 50))
        }
        
        // Send completion signal
        controller.enqueue(encoder.encode('data: {"type": "done"}\n\n'))
        controller.close()
        
      } catch (error) {
        console.error('Streaming error:', error)
        controller.enqueue(encoder.encode(`data: {"type": "error", "message": "An error occurred"}\n\n`))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// Handle regular (non-streaming) responses
async function handleRegularResponse(userInput: string, context: any, lowerInput: string, messages: any[]) {
  const response = await generateRealAIResponse(userInput, context, lowerInput, messages)

  return NextResponse.json({
    id: Date.now().toString(),
    role: 'assistant',
    content: response,
    timestamp: Date.now()
  })
}

// Generate real AI response using OpenAI
async function generateRealAIResponse(userInput: string, context: any, lowerInput: string, messages: any[]) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Create system prompt based on context
    const systemPrompt = createSystemPrompt(context, lowerInput)
    
    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-5) // Keep last 5 messages for context
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: openaiMessages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || getFallbackResponse(userInput)
    
  } catch (error) {
    console.error('OpenAI API error:', error)
    return getFallbackResponse(userInput)
  }
}

// Create contextual system prompt
function createSystemPrompt(context: any, lowerInput: string): string {
  let basePrompt = `You are Biomni, an AI laboratory assistant powered by Stanford's cutting-edge research. You help medical scientists and lab professionals with:

1. Equipment calibration and validation
2. Compliance and regulatory requirements (CAP, CLIA, ISO)
3. Sample handling protocols
4. Quality control procedures
5. Audit preparation
6. Research protocol design
7. Data analysis and interpretation

Current lab context: ${JSON.stringify(context)}

Always provide practical, actionable advice based on laboratory best practices and regulatory standards. Be specific and helpful.`

  // Add specialized prompts for different types of queries
  if (lowerInput.includes('calibration') || lowerInput.includes('calibrate')) {
    basePrompt += `\n\nYou are specifically helping with equipment calibration. Focus on:
- Calibration standards and requirements
- Step-by-step calibration procedures
- Quality control measures
- Documentation requirements
- Regulatory compliance`
  }

  if (lowerInput.includes('compliance') || lowerInput.includes('audit')) {
    basePrompt += `\n\nYou are specifically helping with compliance and audit preparation. Focus on:
- Regulatory requirements (CAP, CLIA, ISO)
- Audit preparation strategies
- Documentation standards
- Quality assurance procedures
- Risk assessment`
  }

  if (lowerInput.includes('protocol') || lowerInput.includes('experiment')) {
    basePrompt += `\n\nYou are specifically helping with experimental protocol design. Focus on:
- Scientific methodology
- Safety considerations
- Quality control measures
- Data collection procedures
- Validation requirements`
  }

  return basePrompt
}

function getFallbackResponse(userInput: string): string {
  const lowerInput = userInput.toLowerCase()
  
  if (lowerInput.includes('calibration') || lowerInput.includes('calibrate')) {
    return "🧬 I can help you with equipment calibration validation. Please provide the equipment details and I'll check compliance against regulatory standards."
  }
  
  if (lowerInput.includes('compliance') || lowerInput.includes('audit')) {
    return "🔬 I can perform a comprehensive compliance audit of your laboratory. I'll check equipment status, calibration schedules, and regulatory requirements."
  }
  
  if (lowerInput.includes('equipment') || lowerInput.includes('device')) {
    return "🧪 I can analyze your laboratory equipment for performance, maintenance needs, and optimization opportunities."
  }
  
  if (lowerInput.includes('protocol') || lowerInput.includes('experiment')) {
    return "🧬 I can design detailed experimental protocols using Stanford's cutting-edge research methodologies. What type of experiment would you like to design?"
  }
  
  if (lowerInput.includes('genomic') || lowerInput.includes('dna')) {
    return "🔬 I can conduct comprehensive bioinformatics analysis using Stanford's advanced AI capabilities. What genomic analysis would you like to perform?"
  }
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "🧬 Hello! I'm Biomni, your AI laboratory assistant powered by Stanford's cutting-edge research. I can help with equipment calibration, compliance audits, sample handling, and more. What would you like assistance with?"
  }
  
  if (lowerInput.includes('help') || lowerInput.includes('support')) {
    return "🔬 I'm here to help! I can assist with experimental design, data analysis, literature review, protocol optimization, and complex bioinformatics analysis. What specific area do you need help with?"
  }
  
  return "🧬 I'm here to help with your laboratory research needs. I can assist with experimental design, data analysis, literature review, protocol optimization, and complex bioinformatics analysis. What would you like to explore?"
} 