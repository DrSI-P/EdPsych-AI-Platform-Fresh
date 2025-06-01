// @ts-check
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LearningStyleAdaptiveContent from '../../components/ui/LearningStyleAdaptiveContent';

// Mock the learning style detection service
vi.mock('@/lib/learning-style-service', () => ({
  detectLearningStyle: vi.fn().mockResolvedValue({
    visual: 0.7,
    auditory: 0.3,
    readWrite: 0.5,
    kinesthetic: 0.2
  }),
  getLearningStyleRecommendations: vi.fn().mockResolvedValue({
    contentTypes: ['diagrams', 'videos', 'text'],
    presentationMethods: ['visual-first', 'include-text']
  })
}));

describe('LearningStyleAdaptiveContent Component', () => {
  const mockContent = {
    visual: <div data-testid="visual-content">Visual content with diagrams and images</div>,
    auditory: <div data-testid="auditory-content">Auditory content with narration</div>,
    readWrite: <div data-testid="read-write-content">Text-based content for reading and writing</div>,
    kinesthetic: <div data-testid="kinesthetic-content">Interactive exercises and activities</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders learning style adaptive content component correctly', async () => {
    render(<LearningStyleAdaptiveContent content={mockContent} />);
    
    // Check that the component renders with the title
    expect(screen.getByText(/Adaptive Learning Content/i)).toBeInTheDocument();
    
    // Check that learning style detection is in progress
    expect(screen.getByText(/Detecting your learning style/i)).toBeInTheDocument();
    
    // Wait for learning style detection to complete
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
  });

  it('detects learning style on mount', async () => {
    const learningStyleService = await import('@/lib/learning-style-service');
    
    render(<LearningStyleAdaptiveContent content={mockContent} />);
    
    // Check that learning style detection was called
    expect(learningStyleService.detectLearningStyle).toHaveBeenCalled();
    
    // Wait for detection to complete
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
  });

  it('prioritizes content based on detected learning style', async () => {
    const learningStyleService = await import('@/lib/learning-style-service');
    learningStyleService.detectLearningStyle.mockResolvedValue({
      visual: 0.9,  // Strongly visual
      auditory: 0.2,
      readWrite: 0.4,
      kinesthetic: 0.1
    });
    
    render(<LearningStyleAdaptiveContent content={mockContent} />);
    
    // Wait for detection and content adaptation
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
    
    // Check that visual content is prioritized (should be first in the DOM)
    const contentContainer = screen.getByTestId('adaptive-content-container');
    expect(contentContainer.firstChild).toHaveTextContent(/Visual content/i);
  });

  it('allows manual selection of learning style', async () => {
    render(<LearningStyleAdaptiveContent content={mockContent} allowManualSelection={true} />);
    
    // Wait for detection to complete
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
    
    // Find and click manual selection button
    const manualButton = screen.getByRole('button', { name: /Change Learning Style/i });
    fireEvent.click(manualButton);
    
    // Check that style selector is displayed
    expect(screen.getByText(/Select your preferred learning style/i)).toBeInTheDocument();
    
    // Select auditory style
    const auditoryOption = screen.getByLabelText(/Auditory/i);
    fireEvent.click(auditoryOption);
    
    // Apply selection
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyButton);
    
    // Check that auditory content is now prioritized
    await waitFor(() => {
      const contentContainer = screen.getByTestId('adaptive-content-container');
      expect(contentContainer.firstChild).toHaveTextContent(/Auditory content/i);
    });
  });

  it('shows learning style breakdown', async () => {
    render(<LearningStyleAdaptiveContent content={mockContent} showStyleBreakdown={true} />);
    
    // Wait for detection to complete
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
    
    // Find and click show breakdown button
    const breakdownButton = screen.getByRole('button', { name: /View Learning Style Breakdown/i });
    fireEvent.click(breakdownButton);
    
    // Check that breakdown is displayed
    expect(screen.getByText(/Your Learning Style Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Visual: 70%/i)).toBeInTheDocument();
    expect(screen.getByText(/Auditory: 30%/i)).toBeInTheDocument();
    expect(screen.getByText(/Read\/Write: 50%/i)).toBeInTheDocument();
    expect(screen.getByText(/Kinesthetic: 20%/i)).toBeInTheDocument();
  });

  it('provides learning style recommendations', async () => {
    const learningStyleService = await import('@/lib/learning-style-service');
    
    render(<LearningStyleAdaptiveContent content={mockContent} showRecommendations={true} />);
    
    // Wait for detection to complete
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
    
    // Check that recommendations were requested
    expect(learningStyleService.getLearningStyleRecommendations).toHaveBeenCalled();
    
    // Find and click recommendations button
    const recommendationsButton = screen.getByRole('button', { name: /View Recommendations/i });
    fireEvent.click(recommendationsButton);
    
    // Check that recommendations are displayed
    expect(screen.getByText(/Learning Recommendations/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Content Types/i)).toBeInTheDocument();
    expect(screen.getByText(/diagrams/i)).toBeInTheDocument();
    expect(screen.getByText(/videos/i)).toBeInTheDocument();
  });

  it('handles learning style detection errors gracefully', async () => {
    const learningStyleService = await import('@/lib/learning-style-service');
    learningStyleService.detectLearningStyle.mockRejectedValue(new Error('Detection failed'));
    
    render(<LearningStyleAdaptiveContent content={mockContent} />);
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Could not detect learning style/i)).toBeInTheDocument();
    });
    
    // Check that fallback content is displayed (should show all content types)
    expect(screen.getByTestId('visual-content')).toBeInTheDocument();
    expect(screen.getByTestId('auditory-content')).toBeInTheDocument();
    expect(screen.getByTestId('read-write-content')).toBeInTheDocument();
    expect(screen.getByTestId('kinesthetic-content')).toBeInTheDocument();
  });

  it('saves learning style preferences', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    render(<LearningStyleAdaptiveContent content={mockContent} savePreferences={true} />);
    
    // Wait for detection to complete
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
    
    // Check that preferences were saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'learningStylePreferences',
      expect.any(String)
    );
  });

  it('loads saved learning style preferences', async () => {
    // Mock localStorage with saved preferences
    const savedPreferences = {
      visual: 0.3,
      auditory: 0.8,  // Strongly auditory
      readWrite: 0.4,
      kinesthetic: 0.2
    };
    
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(savedPreferences)),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    const learningStyleService = await import('@/lib/learning-style-service');
    
    render(<LearningStyleAdaptiveContent content={mockContent} savePreferences={true} />);
    
    // Check that detection was not called (using saved preferences instead)
    expect(learningStyleService.detectLearningStyle).not.toHaveBeenCalled();
    
    // Wait for content adaptation
    await waitFor(() => {
      expect(screen.getByText(/Content adapted to your learning style/i)).toBeInTheDocument();
    });
    
    // Check that auditory content is prioritized based on saved preferences
    const contentContainer = screen.getByTestId('adaptive-content-container');
    expect(contentContainer.firstChild).toHaveTextContent(/Auditory content/i);
  });
});
