import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Memory API route for persistent chat history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('chatId')
    const userId = session.user.email

    // In a real implementation, you would fetch from database
    // For now, we'll return a mock response
    const chatHistory = {
      id: chatId || 'default',
      userId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        title: 'Biomni AI Chat',
        tags: ['laboratory', 'research', 'protocols'],
        equipmentCount: 145,
        complianceScore: 98.5
      }
    }

    return NextResponse.json(chatHistory)
  } catch (error) {
    console.error('Memory GET error:', error)
    return NextResponse.json({ error: 'Failed to retrieve chat history' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, chatId, metadata } = await req.json()
    const userId = session.user.email

    // In a real implementation, you would save to database
    // For now, we'll return a success response
    const savedChat = {
      id: chatId || `chat_${Date.now()}`,
      userId,
      messages,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(savedChat)
  } catch (error) {
    console.error('Memory POST error:', error)
    return NextResponse.json({ error: 'Failed to save chat history' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('chatId')
    const userId = session.user.email

    // In a real implementation, you would delete from database
    // For now, we'll return a success response
    return NextResponse.json({ success: true, message: 'Chat history deleted' })
  } catch (error) {
    console.error('Memory DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete chat history' }, { status: 500 })
  }
} 