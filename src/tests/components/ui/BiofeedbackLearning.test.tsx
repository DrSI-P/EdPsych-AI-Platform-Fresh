// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BiofeedbackLearning from '../../components/ui/BiofeedbackLearning';

// Mock the WebSocket connection
vi.mock('@/lib/websocket-service', () => ({
  connectBiofeedbackDevice: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(true),
    disconnect: vi.fn(),
    onData: vi.fn(),
    onError: vi.fn(),
  })),
}));

describe('BiofeedbackLearning Component', () => {
  const mockBiofeedbackData = {
    attention: 75,
    meditation: 60,
    stress: 30,
    engagement: 85,
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders biofeedback learning component correctly', () => {
    render(<BiofeedbackLearning />);
    
    // Check that the component renders with the title
    expect(screen.getByText(/Biofeedback Learning/i)).toBeInTheDocument();
    
    // Check that the connect button is displayed
    expect(screen.getByRole('button', { name: /Connect Device/i })).toBeInTheDocument();
  });

  it('connects to biofeedback device when connect button is clicked', async () => {
    // Import directly instead of using require
    const websocketService = await import('@/lib/websocket-service');
    const mockConnect = vi.fn().mockResolvedValue(true);
    websocketService.connectBiofeedbackDevice.mockImplementation(() => ({
      connect: mockConnect,
      disconnect: vi.fn(),
      onData: vi.fn(),
      onError: vi.fn(),
    }));
    
    render(<BiofeedbackLearning />);
    
    // Find and click connect button
    const connectButton = screen.getByRole('button', { name: /Connect Device/i });
    fireEvent.click(connectButton);
    
    // Check that connect was called
    expect(mockConnect).toHaveBeenCalled();
    
    // Check that connecting status is displayed
    expect(screen.getByText(/Connecting/i)).toBeInTheDocument();
    
    // Wait for connection to complete
    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
  });

  it('displays biofeedback metrics when data is received', async () => {
    // Import directly instead of using require
    const websocketService = await import('@/lib/websocket-service');
    let dataCallback;
    websocketService.connectBiofeedbackDevice.mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(true),
      disconnect: vi.fn(),
      onData: (callback) => {
        dataCallback = callback;
        return { remove: vi.fn() };
      },
      onError: vi.fn(),
    }));
    
    render(<BiofeedbackLearning />);
    
    // Connect to device
    const connectButton = screen.getByRole('button', { name: /Connect Device/i });
    fireEvent.click(connectButton);
    
    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
    
    // Simulate receiving data
    dataCallback(mockBiofeedbackData);
    
    // Check that metrics are displayed
    await waitFor(() => {
      expect(screen.getByText(/Attention: 75%/i)).toBeInTheDocument();
      expect(screen.getByText(/Meditation: 60%/i)).toBeInTheDocument();
      expect(screen.getByText(/Stress: 30%/i)).toBeInTheDocument();
      expect(screen.getByText(/Engagement: 85%/i)).toBeInTheDocument();
    });
  });

  it('adapts content based on attention level', async () => {
    // Import directly instead of using require
    const websocketService = await import('@/lib/websocket-service');
    let dataCallback;
    websocketService.connectBiofeedbackDevice.mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(true),
      disconnect: vi.fn(),
      onData: (callback) => {
        dataCallback = callback;
        return { remove: vi.fn() };
      },
      onError: vi.fn(),
    }));
    
    render(
      <BiofeedbackLearning>
        <div data-testid="learning-content">Test Content</div>
      </BiofeedbackLearning>
    );
    
    // Connect to device
    const connectButton = screen.getByRole('button', { name: /Connect Device/i });
    fireEvent.click(connectButton);
    
    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
    
    // Simulate low attention data
    dataCallback({
      ...mockBiofeedbackData,
      attention: 30,
    });
    
    // Check that content is adapted for low attention
    await waitFor(() => {
      const content = screen.getByTestId('learning-content');
      expect(content).toHaveClass('low-attention-adaptation');
    });
    
    // Simulate high attention data
    dataCallback({
      ...mockBiofeedbackData,
      attention: 90,
    });
    
    // Check that content is adapted for high attention
    await waitFor(() => {
      const content = screen.getByTestId('learning-content');
      expect(content).toHaveClass('high-attention-adaptation');
    });
  });

  it('provides breaks based on stress levels', async () => {
    // Import directly instead of using require
    const websocketService = await import('@/lib/websocket-service');
    let dataCallback;
    websocketService.connectBiofeedbackDevice.mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(true),
      disconnect: vi.fn(),
      onData: (callback) => {
        dataCallback = callback;
        return { remove: vi.fn() };
      },
      onError: vi.fn(),
    }));
    
    render(<BiofeedbackLearning />);
    
    // Connect to device
    const connectButton = screen.getByRole('button', { name: /Connect Device/i });
    fireEvent.click(connectButton);
    
    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
    
    // Simulate high stress data
    dataCallback({
      ...mockBiofeedbackData,
      stress: 85,
    });
    
    // Check that break suggestion is displayed
    await waitFor(() => {
      expect(screen.getByText(/Break Recommended/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Take a Break/i })).toBeInTheDocument();
    });
    
    // Click take a break button
    fireEvent.click(screen.getByRole('button', { name: /Take a Break/i }));
    
    // Check that break activities are displayed
    await waitFor(() => {
      expect(screen.getByText(/Breathing Exercise/i)).toBeInTheDocument();
    });
  });

  it('handles device connection errors gracefully', async () => {
    // Import directly instead of using require
    const websocketService = await import('@/lib/websocket-service');
    const mockConnect = vi.fn().mockRejectedValue(new Error('Connection failed'));
    websocketService.connectBiofeedbackDevice.mockImplementation(() => ({
      connect: mockConnect,
      disconnect: vi.fn(),
      onData: vi.fn(),
      onError: vi.fn(),
    }));
    
    render(<BiofeedbackLearning />);
    
    // Find and click connect button
    const connectButton = screen.getByRole('button', { name: /Connect Device/i });
    fireEvent.click(connectButton);
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
    });
    
    // Check that retry button is displayed
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('disconnects from device when component unmounts', async () => {
    // Import directly instead of using require
    const websocketService = await import('@/lib/websocket-service');
    const mockDisconnect = vi.fn();
    websocketService.connectBiofeedbackDevice.mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(true),
      disconnect: mockDisconnect,
      onData: vi.fn(),
      onError: vi.fn(),
    }));
    
    const { unmount } = render(<BiofeedbackLearning />);
    
    // Connect to device
    const connectButton = screen.getByRole('button', { name: /Connect Device/i });
    fireEvent.click(connectButton);
    
    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
    
    // Unmount component
    unmount();
    
    // Check that disconnect was called
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('allows calibration of the biofeedback device', async () => {
    render(<BiofeedbackLearning />);
    
    // Connect to device first
    const connectButton = screen.getByRole('button', { name: /Connect Device/i });
    fireEvent.click(connectButton);
    
    // Wait for connection
    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });
    
    // Find and click calibrate button
    const calibrateButton = screen.getByRole('button', { name: /Calibrate/i });
    fireEvent.click(calibrateButton);
    
    // Check that calibration instructions are displayed
    expect(screen.getByText(/Calibration/i)).toBeInTheDocument();
    expect(screen.getByText(/Please relax and focus/i)).toBeInTheDocument();
    
    // Find and click start calibration button
    const startButton = screen.getByRole('button', { name: /Start Calibration/i });
    fireEvent.click(startButton);
    
    // Check that calibration progress is displayed
    await waitFor(() => {
      expect(screen.getByTestId('calibration-progress')).toBeInTheDocument();
    });
    
    // Wait for calibration to complete
    await waitFor(() => {
      expect(screen.getByText(/Calibration Complete/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
