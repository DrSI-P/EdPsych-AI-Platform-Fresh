// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InteractiveGuidance from '../../components/ui/InteractiveGuidance';

// Mock the animation library
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div data-testid="motion-div" {...props}>{children}</div>,
    path: ({ children, ...props }) => <path data-testid="motion-path" {...props}>{children}</path>,
    svg: ({ children, ...props }) => <svg data-testid="motion-svg" {...props}>{children}</svg>,
  },
  AnimatePresence: ({ children }) => <div data-testid="animate-presence">{children}</div>,
}));

describe('InteractiveGuidance Component', () => {
  const mockSteps = [
    { id: 'step1', title: 'Introduction', content: 'Welcome to the interactive guide.' },
    { id: 'step2', title: 'Step 1', content: 'This is the first step of the guide.' },
    { id: 'step3', title: 'Step 2', content: 'This is the second step of the guide.' },
    { id: 'step4', title: 'Conclusion', content: 'You have completed the guide.' },
  ];

  it('renders interactive guidance component correctly', () => {
    render(<InteractiveGuidance steps={mockSteps} />);
    
    // Check that the component renders with the first step
    expect(screen.getByText(/Introduction/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the interactive guide/i)).toBeInTheDocument();
    
    // Check that navigation controls are present
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it('navigates to next step when next button is clicked', async () => {
    render(<InteractiveGuidance steps={mockSteps} />);
    
    // Find and click next button
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    // Check that second step is displayed
    await waitFor(() => {
      expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
      expect(screen.getByText(/This is the first step of the guide/i)).toBeInTheDocument();
    });
  });

  it('navigates to previous step when previous button is clicked', async () => {
    render(<InteractiveGuidance steps={mockSteps} />);
    
    // Go to second step
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    // Wait for second step
    await waitFor(() => {
      expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
    });
    
    // Find and click previous button
    const prevButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(prevButton);
    
    // Check that first step is displayed again
    await waitFor(() => {
      expect(screen.getByText(/Introduction/i)).toBeInTheDocument();
      expect(screen.getByText(/Welcome to the interactive guide/i)).toBeInTheDocument();
    });
  });

  it('shows progress indicator with correct step count', () => {
    render(<InteractiveGuidance steps={mockSteps} />);
    
    // Check that progress indicator shows correct step
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    
    // Go to second step
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    // Check that progress indicator updates
    waitFor(() => {
      expect(screen.getByText(/Step 2 of 4/i)).toBeInTheDocument();
    });
  });

  it('disables previous button on first step', () => {
    render(<InteractiveGuidance steps={mockSteps} />);
    
    // Check that previous button is disabled on first step
    const prevButton = screen.getByRole('button', { name: /Previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('shows finish button on last step', async () => {
    render(<InteractiveGuidance steps={mockSteps} />);
    
    // Go to last step
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton); // Step 2
    fireEvent.click(nextButton); // Step 3
    fireEvent.click(nextButton); // Step 4 (last)
    
    // Check that finish button is displayed on last step
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Finish/i })).toBeInTheDocument();
    });
  });

  it('calls onComplete callback when guide is finished', async () => {
    const mockOnComplete = vi.fn();
    render(<InteractiveGuidance steps={mockSteps} onComplete={mockOnComplete} />);
    
    // Go to last step
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton); // Step 2
    fireEvent.click(nextButton); // Step 3
    fireEvent.click(nextButton); // Step 4 (last)
    
    // Wait for finish button and click it
    await waitFor(() => {
      const finishButton = screen.getByRole('button', { name: /Finish/i });
      fireEvent.click(finishButton);
    });
    
    // Check that onComplete callback was called
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('provides anxiety support when requested', async () => {
    render(<InteractiveGuidance steps={mockSteps} anxietySupport={true} />);
    
    // Find and click anxiety support button
    const anxietyButton = screen.getByRole('button', { name: /Need Support/i });
    fireEvent.click(anxietyButton);
    
    // Check that anxiety support dialogue is displayed
    await waitFor(() => {
      expect(screen.getByText(/Anxiety Support/i)).toBeInTheDocument();
      expect(screen.getByText(/Take a deep breath/i)).toBeInTheDocument();
    });
    
    // Find and click breathing exercise button
    const breathingButton = screen.getByRole('button', { name: /Start Breathing Exercise/i });
    fireEvent.click(breathingButton);
    
    // Check that breathing exercise is displayed
    await waitFor(() => {
      expect(screen.getByTestId('breathing-animation')).toBeInTheDocument();
    });
  });

  it('allows jumping to specific steps', async () => {
    render(<InteractiveGuidance steps={mockSteps} allowJumpToStep={true} />);
    
    // Find and click step selector
    const stepSelector = screen.getByLabelText(/Go to step/i);
    fireEvent.change(stepSelector, { target: { value: 'step3' } });
    
    // Check that third step is displayed
    await waitFor(() => {
      expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
      expect(screen.getByText(/This is the second step of the guide/i)).toBeInTheDocument();
    });
  });

  it('supports different guidance modes', async () => {
    render(<InteractiveGuidance steps={mockSteps} guidanceMode="detailed" />);
    
    // Check that detailed mode elements are present
    expect(screen.getByTestId('detailed-guidance')).toBeInTheDocument();
    expect(screen.getByText(/Detailed Instructions/i)).toBeInTheDocument();
    
    // Change to simple mode
    const modeSelector = screen.getByLabelText(/Guidance Mode/i);
    fireEvent.change(modeSelector, { target: { value: 'simple' } });
    
    // Check that simple mode elements are present
    await waitFor(() => {
      expect(screen.getByTestId('simple-guidance')).toBeInTheDocument();
      expect(screen.getByText(/Simple Instructions/i)).toBeInTheDocument();
    });
  });

  it('tracks completion status of each step', async () => {
    render(<InteractiveGuidance steps={mockSteps} trackCompletion={true} />);
    
    // Complete first step
    const completeButton = screen.getByRole('button', { name: /Mark as Complete/i });
    fireEvent.click(completeButton);
    
    // Check that step is marked as complete
    expect(screen.getByTestId('step-status-step1')).toHaveClass('completed');
    
    // Go to next step
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    // Check that completion status is maintained
    await waitFor(() => {
      expect(screen.getByTestId('step-status-step1')).toHaveClass('completed');
      expect(screen.getByTestId('step-status-step2')).not.toHaveClass('completed');
    });
  });
});
