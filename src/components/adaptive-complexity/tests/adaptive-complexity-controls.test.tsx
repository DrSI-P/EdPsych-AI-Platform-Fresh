import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdaptiveComplexityControls } from '../adaptive-complexity-controls';
import { ComplexityLevel } from '@/lib/adaptive-complexity/types';

// Mock the adaptive complexity service
jest.mock('@/lib/adaptive-complexity/adaptive-complexity-service', () => ({
  adaptiveComplexityService: {
    determineComplexityLevel: jest.fn().mockReturnValue(ComplexityLevel.INTERMEDIATE)
  }
}));

describe('AdaptiveComplexityControls', () => {
  const mockProps = {
    userId: 'user123',
    subjectId: 'mathematics',
    skillId: 'algebra',
    onComplexityChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<AdaptiveComplexityControls {...mockProps} />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  test('displays current complexity level after loading', async () => {
    render(<AdaptiveComplexityControls {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Current Level:')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  test('toggles between automatic and manual modes', async () => {
    render(<AdaptiveComplexityControls {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });
    
    // Initially in automatic mode
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    
    // Toggle to manual mode
    fireEvent.click(screen.getByRole('button', { name: /toggle mode/i }));
    expect(screen.getByText('Manual')).toBeInTheDocument();
    expect(screen.getByLabelText('Select complexity level:')).toBeInTheDocument();
    
    // Toggle back to automatic mode
    fireEvent.click(screen.getByRole('button', { name: /toggle mode/i }));
    expect(screen.getByText('Automatic')).toBeInTheDocument();
  });

  test('allows manual selection of complexity level', async () => {
    render(<AdaptiveComplexityControls {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });
    
    // Switch to manual mode
    fireEvent.click(screen.getByRole('button', { name: /toggle mode/i }));
    
    // Select a different complexity level
    fireEvent.change(screen.getByLabelText('Select complexity level:'), {
      target: { value: ComplexityLevel.ADVANCED }
    });
    
    expect(mockProps.onComplexityChange).toHaveBeenCalledWith(ComplexityLevel.ADVANCED);
  });

  test('shows recommendation when current level differs from recommended', async () => {
    render(<AdaptiveComplexityControls {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Recommended:')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByText('85% confidence')).toBeInTheDocument();
  });

  test('applies recommendation when button is clicked', async () => {
    render(<AdaptiveComplexityControls {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /apply recommendation/i }));
    expect(mockProps.onComplexityChange).toHaveBeenCalledWith(ComplexityLevel.ADVANCED);
  });

  test('handles accessibility keyboard navigation', async () => {
    render(<AdaptiveComplexityControls {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });
    
    // Tab to toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle mode/i });
    toggleButton.focus();
    expect(document.activeElement).toBe(toggleButton);
    
    // Press space to activate
    fireEvent.keyDown(toggleButton, { key: ' ', code: 'Space' });
    expect(screen.getByText('Manual')).toBeInTheDocument();
    
    // Tab to select dropdown in manual mode
    const select = screen.getByLabelText('Select complexity level:');
    select.focus();
    expect(document.activeElement).toBe(select);
  });
});
