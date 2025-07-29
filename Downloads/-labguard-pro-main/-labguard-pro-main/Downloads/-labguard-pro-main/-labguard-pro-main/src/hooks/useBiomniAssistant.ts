import { useState, useEffect, useCallback } from 'react'
import { biomniClient } from '@/lib/ai/biomni-client'

interface LabContext {
  currentPage: string
  userRole: string
  equipmentCount: number
  pendingCalibrations: number
  complianceScore: number
  recentAlerts: string[]
}

interface AssistantState {
  isVisible: boolean
  isExpanded: boolean
  isListening: boolean
  isSpeaking: boolean
  biomniAvailable: boolean
  labContext: LabContext
  currentSuggestion: any | null
  showWelcome: boolean
}

interface UseBiomniAssistantReturn {
  state: AssistantState
  actions: {
    toggleVisibility: () => void
    toggleExpanded: () => void
    toggleVoice: () => void
    setSuggestion: (suggestion: any) => void
    updateLabContext: (context: Partial<LabContext>) => void
    checkBiomniAvailability: () => Promise<boolean>
    sendMessage: (message: string) => Promise<string>
    designProtocol: (experiment: string) => Promise<any>
    analyzeGenomicData: (data: any) => Promise<any>
    reviewLiterature: (topic: string) => Promise<any>
    checkCompliance: () => Promise<any>
  }
}

export function useBiomniAssistant(): UseBiomniAssistantReturn {
  const [state, setState] = useState<AssistantState>({
    isVisible: true,
    isExpanded: false,
    isListening: false,
    isSpeaking: false,
    biomniAvailable: false,
    labContext: {
      currentPage: 'dashboard',
      userRole: 'lab_manager',
      equipmentCount: 145,
      pendingCalibrations: 3,
      complianceScore: 98.5,
      recentAlerts: []
    },
    currentSuggestion: null,
    showWelcome: true
  })

  // Check Biomni availability on mount
  useEffect(() => {
    checkBiomniAvailability()
  }, [])

  const checkBiomniAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const available = await biomniClient.checkAvailability()
      setState(prev => ({ ...prev, biomniAvailable: available }))
      return available
    } catch (error) {
      console.error('Failed to check Biomni availability:', error)
      setState(prev => ({ ...prev, biomniAvailable: false }))
      return false
    }
  }, [])

  const toggleVisibility = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: !prev.isVisible }))
  }, [])

  const toggleExpanded = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))
  }, [])

  const toggleVoice = useCallback(() => {
    setState(prev => ({ ...prev, isListening: !prev.isListening }))
  }, [])

  const setSuggestion = useCallback((suggestion: any) => {
    setState(prev => ({ ...prev, currentSuggestion: suggestion }))
  }, [])

  const updateLabContext = useCallback((context: Partial<LabContext>) => {
    setState(prev => ({
      ...prev,
      labContext: { ...prev.labContext, ...context }
    }))
  }, [])

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    try {
      const response = await biomniClient.generateResponse(message, state.labContext)
      return response
    } catch (error) {
      console.error('Failed to send message:', error)
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again.'
    }
  }, [state.labContext])

  const designProtocol = useCallback(async (experiment: string): Promise<any> => {
    try {
      const result = await biomniClient.designProtocol(experiment, state.labContext)
      return result
    } catch (error) {
      console.error('Failed to design protocol:', error)
      throw error
    }
  }, [state.labContext])

  const analyzeGenomicData = useCallback(async (data: any): Promise<any> => {
    try {
      const result = await biomniClient.analyzeGenomicData(data, state.labContext)
      return result
    } catch (error) {
      console.error('Failed to analyze genomic data:', error)
      throw error
    }
  }, [state.labContext])

  const reviewLiterature = useCallback(async (topic: string): Promise<any> => {
    try {
      const result = await biomniClient.reviewLiterature(topic, state.labContext)
      return result
    } catch (error) {
      console.error('Failed to review literature:', error)
      throw error
    }
  }, [state.labContext])

  const checkCompliance = useCallback(async (): Promise<any> => {
    try {
      // This would integrate with your compliance system
      return {
        complianceScore: state.labContext.complianceScore,
        pendingItems: state.labContext.pendingCalibrations,
        recommendations: [
          'Schedule calibration for PCR machine #2',
          'Update safety protocols for new equipment',
          'Review documentation for audit preparation'
        ]
      }
    } catch (error) {
      console.error('Failed to check compliance:', error)
      throw error
    }
  }, [state.labContext])

  return {
    state,
    actions: {
      toggleVisibility,
      toggleExpanded,
      toggleVoice,
      setSuggestion,
      updateLabContext,
      checkBiomniAvailability,
      sendMessage,
      designProtocol,
      analyzeGenomicData,
      reviewLiterature,
      checkCompliance
    }
  }
} 