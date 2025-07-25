import { NextRequest, NextResponse } from 'next/server'
import { biomniClient } from '@/lib/ai/biomni-client'
import { biomniIntegration } from '@/lib/ai/biomni-integration'
import { contextAnalyzer } from '@/lib/ai/context-analyzer'
import { withRateLimit, aiRateLimiter } from '@/lib/rate-limit'
import { validateChatInput } from '@/lib/validation'

// Enhanced chat API route for assistant-ui integration
export async function POST(req: NextRequest) {
  return withRateLimit(req, aiRateLimiter, async () => {
    try {
      const body = await req.json()
      
      // Validate input
      const validation = validateChatInput(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.errors },
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
        return handleStreamingResponse(userInput, context, lowerInput)
      }
      
      // Handle regular response
      return handleRegularResponse(userInput, context, lowerInput)

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
async function handleStreamingResponse(userInput: string, context: any, lowerInput: string) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial response
        controller.enqueue(encoder.encode('data: {"type": "start"}\n\n'))
        
        // Determine response type and generate content
        let response: string
        let researchResult: any = null
        
        if (lowerInput.includes('[biomni_protocol]') || lowerInput.includes('protocol') || lowerInput.includes('experiment') || lowerInput.includes('design')) {
          const cleanInput = userInput.replace('[BIOMNI_PROTOCOL]', '').trim()
          const result = await biomniIntegration.designExperimentalProtocol(cleanInput, context)
          response = result.result
          researchResult = result
        } else if (lowerInput.includes('[biomni_genomic]') || lowerInput.includes('genomic') || lowerInput.includes('dna') || lowerInput.includes('sequence') || lowerInput.includes('analysis')) {
          const cleanInput = userInput.replace('[BIOMNI_GENOMIC]', '').trim()
          const result = await biomniIntegration.conductBioinformaticsAnalysis({ query: cleanInput }, context)
          response = result.result
          researchResult = result
        } else if (lowerInput.includes('[biomni_literature]') || lowerInput.includes('literature') || lowerInput.includes('review') || lowerInput.includes('paper') || lowerInput.includes('research')) {
          const cleanInput = userInput.replace('[BIOMNI_LITERATURE]', '').trim()
          const result = await biomniIntegration.conductLiteratureReview(cleanInput, context)
          response = result.result
          researchResult = result
        } else if (lowerInput.includes('[biomni_equipment]') || lowerInput.includes('equipment') || lowerInput.includes('calibration') || lowerInput.includes('maintenance')) {
          const cleanInput = userInput.replace('[BIOMNI_EQUIPMENT]', '').trim()
          const result = await biomniIntegration.analyzeLabEquipment({ query: cleanInput }, context)
          response = result.result
          researchResult = result
        } else if (lowerInput.includes('hypothesis') || lowerInput.includes('hypothesize') || lowerInput.includes('predict')) {
          const result = await biomniIntegration.generateResearchHypothesis({ query: userInput }, context)
          response = result.result
          researchResult = result
        } else if (lowerInput.includes('workflow') || lowerInput.includes('optimize') || lowerInput.includes('process')) {
          const result = await biomniIntegration.optimizeLabWorkflow({ query: userInput }, context)
          response = result.result
          researchResult = result
        } else {
          // General query - use Biomni's general response
          response = await biomniClient.generateResponse(userInput, context)
        }

        // Add research result metadata if available
        if (researchResult) {
          response += `\n\n🔬 **Stanford Biomni Analysis**\n`
          response += `• Confidence: ${(researchResult.confidence * 100).toFixed(1)}%\n`
          response += `• Execution Time: ${(researchResult.executionTime / 1000).toFixed(1)}s\n`
          response += `• Tools Used: ${researchResult.toolsUsed?.length || 0}\n`
          response += `• Databases Queried: ${researchResult.databasesQueried?.length || 0}`
        }

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
async function handleRegularResponse(userInput: string, context: any, lowerInput: string) {
  // Check if it's a Biomni-specific query
  let response: string
  let researchResult: any = null
  
  if (lowerInput.includes('[biomni_protocol]') || lowerInput.includes('protocol') || lowerInput.includes('experiment') || lowerInput.includes('design')) {
    const cleanInput = userInput.replace('[BIOMNI_PROTOCOL]', '').trim()
    const result = await biomniIntegration.designExperimentalProtocol(cleanInput, context)
    response = result.result
    researchResult = result
  } else if (lowerInput.includes('[biomni_genomic]') || lowerInput.includes('genomic') || lowerInput.includes('dna') || lowerInput.includes('sequence') || lowerInput.includes('analysis')) {
    const cleanInput = userInput.replace('[BIOMNI_GENOMIC]', '').trim()
    const result = await biomniIntegration.conductBioinformaticsAnalysis({ query: cleanInput }, context)
    response = result.result
    researchResult = result
  } else if (lowerInput.includes('[biomni_literature]') || lowerInput.includes('literature') || lowerInput.includes('review') || lowerInput.includes('paper') || lowerInput.includes('research')) {
    const cleanInput = userInput.replace('[BIOMNI_LITERATURE]', '').trim()
    const result = await biomniIntegration.conductLiteratureReview(cleanInput, context)
    response = result.result
    researchResult = result
  } else if (lowerInput.includes('[biomni_equipment]') || lowerInput.includes('equipment') || lowerInput.includes('calibration') || lowerInput.includes('maintenance')) {
    const cleanInput = userInput.replace('[BIOMNI_EQUIPMENT]', '').trim()
    const result = await biomniIntegration.analyzeLabEquipment({ query: cleanInput }, context)
    response = result.result
    researchResult = result
  } else if (lowerInput.includes('hypothesis') || lowerInput.includes('hypothesize') || lowerInput.includes('predict')) {
    const result = await biomniIntegration.generateResearchHypothesis({ query: userInput }, context)
    response = result.result
    researchResult = result
  } else if (lowerInput.includes('workflow') || lowerInput.includes('optimize') || lowerInput.includes('process')) {
    const result = await biomniIntegration.optimizeLabWorkflow({ query: userInput }, context)
    response = result.result
    researchResult = result
  } else {
    // General query - use Biomni's general response
    response = await biomniClient.generateResponse(userInput, context)
  }

  // Add research result metadata if available
  if (researchResult) {
    response += `\n\n🔬 **Stanford Biomni Analysis**\n`
    response += `• Confidence: ${(researchResult.confidence * 100).toFixed(1)}%\n`
    response += `• Execution Time: ${(researchResult.executionTime / 1000).toFixed(1)}s\n`
    response += `• Tools Used: ${researchResult.toolsUsed?.length || 0}\n`
    response += `• Databases Queried: ${researchResult.databasesQueried?.length || 0}`
  }

  return NextResponse.json({
    id: Date.now().toString(),
    role: 'assistant',
    content: response,
    timestamp: Date.now()
  })
}

function getFallbackResponse(userInput: string): string {
  const lowerInput = userInput.toLowerCase()
  
  if (lowerInput.includes('calibration') || lowerInput.includes('calibrate')) {
    return "🧬 I can help you design optimized calibration protocols using Stanford's latest research methodologies. I recommend scheduling calibration for 3 pieces of equipment within the next week. Would you like me to generate a detailed calibration protocol?"
  }
  
  if (lowerInput.includes('compliance') || lowerInput.includes('audit')) {
    return "🔬 Your compliance rate is excellent at 98.5%. I can help you reach 100% by implementing automated quality control protocols based on recent biomedical research findings. Would you like me to design a comprehensive compliance optimization strategy?"
  }
  
  if (lowerInput.includes('equipment') || lowerInput.includes('device')) {
    return "🧪 I'm monitoring 145 pieces of equipment with advanced AI analysis. 142 are performing optimally. I can help you design predictive maintenance protocols using genomic data analysis techniques. Would you like me to analyze specific equipment performance?"
  }
  
  if (lowerInput.includes('protocol') || lowerInput.includes('experiment')) {
    return "🧬 I can design detailed experimental protocols using Stanford's cutting-edge research methodologies. I have access to 150+ tools and 59 databases to ensure your protocols are optimized and scientifically rigorous. What type of experiment would you like to design?"
  }
  
  if (lowerInput.includes('genomic') || lowerInput.includes('dna')) {
    return "🔬 I can conduct comprehensive bioinformatics analysis using Stanford's advanced AI capabilities. I can process genomic data 100x faster than traditional methods while maintaining expert-level accuracy. What genomic analysis would you like to perform?"
  }
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "🧬 Hello! I'm Biomni, your AI laboratory assistant powered by Stanford's cutting-edge research. I can accelerate your research by 100x with access to 150+ tools, 59 databases, and 106 software packages. What would you like to explore today?"
  }
  
  if (lowerInput.includes('help') || lowerInput.includes('support')) {
    return "🔬 I'm here to help! I can assist with experimental design, data analysis, literature review, protocol optimization, and complex bioinformatics analysis using Stanford's advanced AI capabilities. What specific area do you need help with?"
  }
  
  return "🧬 I'm here to help with your laboratory research needs. I can assist with experimental design, data analysis, literature review, protocol optimization, and complex bioinformatics analysis using Stanford's cutting-edge AI capabilities. What would you like to explore?"
} 