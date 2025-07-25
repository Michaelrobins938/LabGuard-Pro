import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Dashboard from '../app/dashboard/page';

// Fix the session mock type
const mockSession = {
  data: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN',
      laboratoryId: 'test-lab-id',
      laboratoryName: 'Test Laboratory'
    },
    expires: '2024-12-31'
  }
};

// Mock fetch properly
const mockFetch = global.fetch as jest.Mock;

// Set up mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: 'mock data' })
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Dashboard Integration', () => {
  it('renders dashboard with all components', async () => {
    render(
      <SessionProvider session={mockSession.data}>
        <Dashboard />
      </SessionProvider>
    );

    // Fix all the test assertions
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
    expect(screen.getByText('Total Equipment')).toBeInTheDocument();
    expect(screen.getByText('Compliance Rate')).toBeInTheDocument();
    expect(screen.getByText('System Uptime')).toBeInTheDocument();
    expect(screen.getByText('Accuracy Rate')).toBeInTheDocument();
  });

  it('loads dashboard data on mount', async () => {
    render(
      <SessionProvider session={mockSession.data}>
        <Dashboard />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/dashboard'),
        expect.any(Object)
      );
    });
  });

  it('handles equipment calibration click', async () => {
    render(
      <SessionProvider session={mockSession.data}>
        <Dashboard />
      </SessionProvider>
    );

    const calibrateButton = await screen.findByRole('button', { name: /calibrate/i });
    fireEvent.click(calibrateButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/equipment'),
        expect.any(Object)
      );
    });
  });

  it('displays error message on API failure', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' })
      })
    );

    render(
      <SessionProvider session={mockSession.data}>
        <Dashboard />
      </SessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('refreshes data when refresh button is clicked', async () => {
    render(
      <SessionProvider session={mockSession.data}>
        <Dashboard />
      </SessionProvider>
    );

    const refreshButton = await screen.findByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial load + refresh
    });
  });
}); 