import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { BiomniAssistant } from '../components/ai/BiomniAssistant';
import { ResultValidationSystem } from '../components/compliance/ResultValidationSystem';
import { AuditPreparationSystem } from '../components/compliance/AuditPreparationSystem';

// Mock session data
const mockSession = {
  data: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'LAB_TECH',
      laboratoryId: 'test-lab-id',
      laboratoryName: 'BREA Laboratory'
    },
    expires: '2024-12-31'
  }
};

// Mock fetch for API calls
const mockFetch = global.fetch as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ 
        status: 'pass',
        message: 'Validation successful',
        complianceScore: 95,
        recommendations: ['Schedule calibration for PCR machine #2']
      })
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('LabGuard Compliance Assistant - Core Functionality', () => {
  describe('AI Assistant Integration', () => {
    it('renders BiomniAssistant component correctly', () => {
      render(
        <SessionProvider session={mockSession.data}>
          <BiomniAssistant />
        </SessionProvider>
      );

      expect(screen.getByText(/Laboratory Assistant/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ask me anything about laboratory compliance/i)).toBeInTheDocument();
    });

    it('handles user input and generates AI responses', async () => {
      render(
        <SessionProvider session={mockSession.data}>
          <BiomniAssistant />
        </SessionProvider>
      );

      const input = screen.getByPlaceholderText(/Ask me anything about laboratory compliance/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      fireEvent.change(input, { target: { value: 'Check PCR compliance' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/PCR Verification/i)).toBeInTheDocument();
      });
    });

    it('opens compliance tools when requested', async () => {
      render(
        <SessionProvider session={mockSession.data}>
          <BiomniAssistant />
        </SessionProvider>
      );

      const input = screen.getByPlaceholderText(/Ask me anything about laboratory compliance/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      fireEvent.change(input, { target: { value: 'Open PCR verification tool' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/PCR Verification/i)).toBeInTheDocument();
        expect(screen.getByText(/I'll open the PCR Verification tool for you/i)).toBeInTheDocument();
      });
    });

    it('handles compliance keyword detection', async () => {
      render(
        <SessionProvider session={mockSession.data}>
          <BiomniAssistant />
        </SessionProvider>
      );

      const input = screen.getByPlaceholderText(/Ask me anything about laboratory compliance/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      fireEvent.change(input, { target: { value: 'I need help with CAP compliance' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/laboratory compliance/i)).toBeInTheDocument();
        expect(screen.getByText(/specialized compliance tools/i)).toBeInTheDocument();
      });
    });
  });

  describe('Result Validation System', () => {
    it('renders ResultValidationSystem component', () => {
      render(
        <SessionProvider session={mockSession.data}>
          <ResultValidationSystem />
        </SessionProvider>
      );

      expect(screen.getByText(/Result Validation System/i)).toBeInTheDocument();
      expect(screen.getByText(/Critical Value Alert/i)).toBeInTheDocument();
      expect(screen.getByText(/QC Evaluation/i)).toBeInTheDocument();
    });

    it('validates critical value alerts', async () => {
      render(
        <SessionProvider session={mockSession.data}>
          <ResultValidationSystem />
        </SessionProvider>
      );

      // Fill in critical value form
      const testNameInput = screen.getByLabelText(/Test Name/i);
      const resultInput = screen.getByLabelText(/Result Value/i);
      const validateButton = screen.getByRole('button', { name: /validate/i });

      fireEvent.change(testNameInput, { target: { value: 'Troponin I' } });
      fireEvent.change(resultInput, { target: { value: '15.2' } });
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/compliance/result-validation',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('critical-value')
          })
        );
      });
    });

    it('validates QC evaluation data', async () => {
      render(
        <SessionProvider session={mockSession.data}>
          <ResultValidationSystem />
        </SessionProvider>
      );

      // Switch to QC Evaluation tab
      const qcTab = screen.getByText(/QC Evaluation/i);
      fireEvent.click(qcTab);

      const analyteInput = screen.getByLabelText(/Analyte/i);
      const targetValueInput = screen.getByLabelText(/Target Value/i);
      const observedValueInput = screen.getByLabelText(/Observed Value/i);
      const validateButton = screen.getByRole('button', { name: /validate/i });

      fireEvent.change(analyteInput, { target: { value: 'Glucose' } });
      fireEvent.change(targetValueInput, { target: { value: '100' } });
      fireEvent.change(observedValueInput, { target: { value: '98' } });
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/compliance/result-validation',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('qc-evaluation')
          })
        );
      });
    });
  });

  describe('Audit Preparation System', () => {
    it('renders AuditPreparationSystem component', () => {
      render(
        <SessionProvider session={mockSession.data}>
          <AuditPreparationSystem />
        </SessionProvider>
      );

      expect(screen.getByText(/Audit Preparation System/i)).toBeInTheDocument();
      expect(screen.getByText(/CAP Inspection/i)).toBeInTheDocument();
      expect(screen.getByText(/QMS Audit/i)).toBeInTheDocument();
    });

    it('validates CAP inspection readiness', async () => {
      render(
        <SessionProvider session={mockSession.data}>
          <AuditPreparationSystem />
        </SessionProvider>
      );

      // Fill in CAP inspection form
      const labNameInput = screen.getByLabelText(/Laboratory Name/i);
      const lastInspectionInput = screen.getByLabelText(/Last Inspection Date/i);
      const validateButton = screen.getByRole('button', { name: /validate/i });

      fireEvent.change(labNameInput, { target: { value: 'BREA Laboratory' } });
      fireEvent.change(lastInspectionInput, { target: { value: '2023-01-15' } });
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/compliance/audit-preparation',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('cap-inspection')
          })
        );
      });
    });
  });
});

describe('LabGuard Compliance Assistant - API Integration', () => {
  describe('PCR Verification API', () => {
    it('validates PCR protocol data', async () => {
      const testData = {
        testType: 'COVID-19 PCR',
        protocolVersion: 'v2.1',
        operatorId: 'TECH001',
        sampleVolume: '200μL',
        primerLot: 'PRIMER-2024-001',
        masterMixLot: 'MIX-2024-003',
        thermalProfile: 'Standard 40 cycles',
        sampleCount: 24,
        controlsIncluded: true,
        additionalControls: ['Positive Control', 'Negative Control'],
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/compliance/pcr-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('discrepancies');
      expect(result).toHaveProperty('correctiveActions');
    });

    it('handles missing required fields', async () => {
      const testData = {
        testType: 'COVID-19 PCR',
        // Missing protocolVersion and operatorId
        sampleVolume: '200μL'
      };

      const response = await fetch('/api/compliance/pcr-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result).toHaveProperty('error');
    });
  });

  describe('Media Validation API', () => {
    it('validates media safety and expiration', async () => {
      const testData = {
        testType: 'Blood Agar',
        lotNumber: 'BA-2024-001',
        expirationDate: '2024-12-31',
        currentDate: '2024-01-15',
        tempLog: [
          { timestamp: '2024-01-15T08:00:00Z', temperature: 4.2 },
          { timestamp: '2024-01-15T16:00:00Z', temperature: 4.1 }
        ],
        visualNotes: 'No contamination observed',
        techId: 'TECH001',
        storageRequirements: '2-8°C',
        visualStandards: 'Clear, no turbidity',
        qcFrequency: 'Weekly',
        sterilityMarkers: 'No growth on sterility check'
      };

      const response = await fetch('/api/compliance/media-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('actionsRequired');
      expect(result).toHaveProperty('documentation');
    });

    it('detects expired media', async () => {
      const testData = {
        testType: 'Blood Agar',
        lotNumber: 'BA-2023-001',
        expirationDate: '2023-12-31', // Expired
        currentDate: '2024-01-15',
        tempLog: [],
        visualNotes: 'No contamination observed',
        techId: 'TECH001'
      };

      const response = await fetch('/api/compliance/media-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.status).toBe('REJECT');
      expect(result.actionsRequired).toContain('Discard expired media immediately');
    });
  });

  describe('AI Chat API', () => {
    it('processes compliance-related queries', async () => {
      const testMessage = {
        role: 'user',
        content: 'I need help with CAP compliance for our molecular testing procedures'
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [testMessage],
          stream: false
        })
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result).toHaveProperty('role', 'assistant');
      expect(result).toHaveProperty('content');
      expect(result.content).toContain('compliance');
    });

    it('handles tool requests', async () => {
      const testMessage = {
        role: 'user',
        content: 'Open PCR verification tool'
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [testMessage],
          stream: false
        })
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.content).toContain('PCR Verification');
    });
  });
});

describe('LabGuard Compliance Assistant - Error Handling', () => {
  it('handles API failures gracefully', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal server error' })
      })
    );

    render(
      <SessionProvider session={mockSession.data}>
        <ResultValidationSystem />
      </SessionProvider>
    );

    const validateButton = screen.getByRole('button', { name: /validate/i });
    fireEvent.click(validateButton);

    await waitFor(() => {
      expect(screen.getByText(/Validation Error/i)).toBeInTheDocument();
    });
  });

  it('handles network timeouts', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network timeout'))
    );

    render(
      <SessionProvider session={mockSession.data}>
        <BiomniAssistant />
      </SessionProvider>
    );

    const input = screen.getByPlaceholderText(/Ask me anything about laboratory compliance/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/technical difficulties/i)).toBeInTheDocument();
    });
  });
});

describe('LabGuard Compliance Assistant - Performance', () => {
  it('responds to user input within acceptable time', async () => {
    const startTime = Date.now();

    render(
      <SessionProvider session={mockSession.data}>
        <BiomniAssistant />
      </SessionProvider>
    );

    const input = screen.getByPlaceholderText(/Ask me anything about laboratory compliance/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Quick test' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(3000); // Should respond within 3 seconds
    });
  });

  it('handles concurrent requests', async () => {
    render(
      <SessionProvider session={mockSession.data}>
        <ResultValidationSystem />
      </SessionProvider>
    );

    const validateButtons = screen.getAllByRole('button', { name: /validate/i });
    
    // Click multiple validation buttons simultaneously
    validateButtons.forEach(button => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(validateButtons.length);
    });
  });
});

describe('LabGuard Compliance Assistant - Security', () => {
  it('validates user authentication', async () => {
    const unauthorizedSession = {
      data: null
    };

    render(
      <SessionProvider session={unauthorizedSession.data}>
        <BiomniAssistant />
      </SessionProvider>
    );

    // Should show authentication required message
    expect(screen.getByText(/Please sign in to access the compliance assistant/i)).toBeInTheDocument();
  });

  it('sanitizes user input', async () => {
    render(
      <SessionProvider session={mockSession.data}>
        <BiomniAssistant />
      </SessionProvider>
    );

    const input = screen.getByPlaceholderText(/Ask me anything about laboratory compliance/i);
    const maliciousInput = '<script>alert("xss")</script>Check PCR compliance';

    fireEvent.change(input, { target: { value: maliciousInput } });

    // Input should be sanitized and not execute scripts
    expect(input).toHaveValue(maliciousInput);
  });
}); 