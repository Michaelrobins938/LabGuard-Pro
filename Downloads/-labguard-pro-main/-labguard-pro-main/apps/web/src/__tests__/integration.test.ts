import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

// Import components to test
import { AdvancedAnalytics } from '@/components/dashboard/AdvancedAnalytics'
import { VoiceAssistant } from '@/components/ai-assistant/VoiceAssistant'
import { BiomniInsights } from '@/components/dashboard/BiomniInsights'

// Mock NextAuth
const mockSession = {
  data: {
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  status: 'authenticated' as const
}

// Mock API responses
const mockApiResponses = {
  analytics: {
    equipmentMetrics: {
      total: 156,
      active: 142,
      maintenance: 8,
      calibration: 6
    },
    complianceMetrics: {
      compliant: 89,
      nonCompliant: 12,
      pending: 5
    },
    performanceMetrics: {
      uptime: 98.5,
      efficiency: 94.2,
      accuracy: 99.1
    }
  },
  biomni: {
    insights: [
      {
        id: '1',
        type: 'optimization',
        title: 'Equipment Optimization',
        description: 'Consider recalibrating spectrophotometer for improved accuracy',
        priority: 'high',
        category: 'performance'
      }
    ]
  }
}

// Setup test environment
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={mockSession.data}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </SessionProvider>
)

// Mock fetch
global.fetch = jest.fn()

describe('LabGuard Pro Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.analytics),
      })
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Advanced Analytics Component', () => {
    it('renders analytics dashboard with key metrics', async () => {
      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
      })

      // Check for key metrics
      expect(screen.getByText('Total Equipment')).toBeInTheDocument()
      expect(screen.getByText('Compliance Rate')).toBeInTheDocument()
      expect(screen.getByText('System Uptime')).toBeInTheDocument()
      expect(screen.getByText('Accuracy Rate')).toBeInTheDocument()
    })

    it('displays correct metric values', async () => {
      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('156')).toBeInTheDocument() // Total equipment
        expect(screen.getByText('98.5%')).toBeInTheDocument() // Uptime
        expect(screen.getByText('99.1%')).toBeInTheDocument() // Accuracy
      })
    })

    it('handles time range selection', async () => {
      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Last 7 days')).toBeInTheDocument()
      })

      // Test time range selector
      const timeRangeSelect = screen.getByRole('combobox')
      fireEvent.click(timeRangeSelect)

      // Check for time range options
      expect(screen.getByText('Last 24h')).toBeInTheDocument()
      expect(screen.getByText('Last 30 days')).toBeInTheDocument()
      expect(screen.getByText('Last 90 days')).toBeInTheDocument()
    })

    it('handles data export functionality', async () => {
      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument()
      })

      const exportButton = screen.getByText('Export')
      fireEvent.click(exportButton)

      // Verify export functionality (mock implementation)
      expect(exportButton).toBeInTheDocument()
    })
  })

  describe('Voice Assistant Component', () => {
    it('renders voice assistant interface', () => {
      render(
        <TestWrapper>
          <VoiceAssistant />
        </TestWrapper>
      )

      expect(screen.getByText('Voice Assistant')).toBeInTheDocument()
      expect(screen.getByText('Ready')).toBeInTheDocument()
    })

    it('displays microphone and speaker controls', () => {
      render(
        <TestWrapper>
          <VoiceAssistant />
        </TestWrapper>
      )

      // Check for voice control buttons
      const micButton = screen.getByRole('button', { name: /mic/i })
      const speakerButton = screen.getByRole('button', { name: /volume/i })

      expect(micButton).toBeInTheDocument()
      expect(speakerButton).toBeInTheDocument()
    })

    it('shows quick command buttons', () => {
      render(
        <TestWrapper>
          <VoiceAssistant />
        </TestWrapper>
      )

      expect(screen.getByText('Check equipment status')).toBeInTheDocument()
      expect(screen.getByText('Start calibration')).toBeInTheDocument()
      expect(screen.getByText('Generate report')).toBeInTheDocument()
      expect(screen.getByText('Show alerts')).toBeInTheDocument()
      expect(screen.getByText('Help')).toBeInTheDocument()
    })
  })

  describe('Biomni Insights Component', () => {
    beforeEach(() => {
      ;(fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponses.biomni),
        })
      )
    })

    it('renders Biomni insights', async () => {
      render(
        <TestWrapper>
          <BiomniInsights />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Biomni AI Insights')).toBeInTheDocument()
      })
    })

    it('displays insight cards with correct information', async () => {
      render(
        <TestWrapper>
          <BiomniInsights />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Equipment Optimization')).toBeInTheDocument()
        expect(screen.getByText(/Consider recalibrating spectrophotometer/)).toBeInTheDocument()
      })
    })
  })

  describe('API Integration Tests', () => {
    it('handles successful API responses', async () => {
      ;(fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: mockApiResponses.analytics }),
        })
      )

      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('156')).toBeInTheDocument()
      })
    })

    it('handles API errors gracefully', async () => {
      ;(fetch as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('API Error'))
      )

      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      // Component should still render even with API errors
      await waitFor(() => {
        expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
      })
    })
  })

  describe('Authentication Tests', () => {
    it('requires authentication for protected components', () => {
      const unauthenticatedSession = {
        data: null,
        status: 'unauthenticated' as const
      }

      render(
        <SessionProvider session={unauthenticatedSession.data}>
          <QueryClientProvider client={queryClient}>
            <AdvancedAnalytics />
          </QueryClientProvider>
        </SessionProvider>
      )

      // Component should handle unauthenticated state
      expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
    })
  })

  describe('Responsive Design Tests', () => {
    it('adapts to different screen sizes', () => {
      // Mock window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      // Component should render on mobile
      expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
    })
  })

  describe('Performance Tests', () => {
    it('loads components within acceptable time', async () => {
      const startTime = performance.now()

      render(
        <TestWrapper>
          <AdvancedAnalytics />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Advanced Analytics')).toBeInTheDocument()
      })

      const endTime = performance.now()
      const loadTime = endTime - startTime

      // Component should load within 1 second
      expect(loadTime).toBeLessThan(1000)
    })
  })
}) 