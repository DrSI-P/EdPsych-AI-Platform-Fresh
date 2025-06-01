import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProgressTracking from '@/components/ui/ProgressTracking';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('ProgressTracking', () => {
  const mockLearningObjectives = [
    {
      id: 'obj1',
      title: 'Learn React Basics',
      description: 'Understand components, props, and state',
      completed: false,
      progress: 30,
    },
    {
      id: 'obj2',
      title: 'Master TypeScript',
      description: 'Learn types, interfaces, and generics',
      completed: false,
      progress: 0,
    },
    {
      id: 'obj3',
      title: 'Completed Objective',
      description: 'This one is already done',
      completed: true,
      progress: 100,
    },
  ];

  const mockOnObjectiveComplete = jest.fn();
  const mockOnProgressUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders learning objectives correctly', () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    );

    // Check if all objectives are rendered
    expect(screen.getByText('Learn React Basics')).toBeInTheDocument();
    expect(screen.getByText('Master TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Completed Objective')).toBeInTheDocument();
    
    // Check descriptions
    expect(screen.getByText('Understand components, props, and state')).toBeInTheDocument();
    expect(screen.getByText('Learn types, interfaces, and generics')).toBeInTheDocument();
    expect(screen.getByText('This one is already done')).toBeInTheDocument();
    
    // Check progress indicators
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Check completed status
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('calculates overall progress correctly', () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    );

    // Overall progress should be average of all objectives: (30 + 0 + 100) / 3 = 43.33%
    expect(screen.getByText('43%')).toBeInTheDocument();
  });

  it('marks an objective as complete when button is clicked', async () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
        showCelebration={false} // Disable celebration to simplify test
      />
    );

    // Find and click the "Mark Complete" button for the first objective
    const completeButtons = screen.getAllByText('Mark Complete');
    fireEvent.click(completeButtons[0]);

    // Check if onObjectiveComplete was called with the correct ID
    expect(mockOnObjectiveComplete).toHaveBeenCalledWith('obj1');
    
    // Check if onProgressUpdate was called to set progress to 100%
    expect(mockOnProgressUpdate).toHaveBeenCalledWith('obj1', 100);
    
    // The objective should now show as completed
    await waitFor(() => {
      expect(screen.getAllByText('Completed').length).toBe(2);
    });
  });

  it('updates progress when slider is changed', () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    );

    // Find the progress slider for the first objective
    const progressSliders = screen.getAllByRole('slider');
    
    // Change the value to 50%
    fireEvent.change(progressSliders[0], { target: { value: 50 } });
    
    // Check if onProgressUpdate was called with the correct values
    expect(mockOnProgressUpdate).toHaveBeenCalledWith('obj1', 50);
  });

  it('auto-completes objective when progress reaches 100%', () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
        showCelebration={false} // Disable celebration to simplify test
      />
    );

    // Find the progress slider for the first objective
    const progressSliders = screen.getAllByRole('slider');
    
    // Change the value to 100%
    fireEvent.change(progressSliders[0], { target: { value: 100 } });
    
    // Check if onProgressUpdate was called with 100%
    expect(mockOnProgressUpdate).toHaveBeenCalledWith('obj1', 100);
    
    // Check if onObjectiveComplete was called
    expect(mockOnObjectiveComplete).toHaveBeenCalledWith('obj1');
  });

  it('shows celebration when an objective is completed and showCelebration is true', async () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
        showCelebration={true}
      />
    );

    // Find and click the "Mark Complete" button for the first objective
    const completeButtons = screen.getAllByText('Mark Complete');
    fireEvent.click(completeButtons[0]);
    
    // Check if celebration is shown
    await waitFor(() => {
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
      expect(screen.getByText(/You've completed:/)).toBeInTheDocument();
      expect(screen.getByText('Learn React Basics')).toBeInTheDocument();
    });
  });

  it('includes user name in celebration if provided', async () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
        showCelebration={true}
        userProfile={{ name: 'John' }}
      />
    );

    // Find and click the "Mark Complete" button for the first objective
    const completeButtons = screen.getAllByText('Mark Complete');
    fireEvent.click(completeButtons[0]);
    
    // Check if celebration includes user name
    await waitFor(() => {
      expect(screen.getByText('Congratulations, John!')).toBeInTheDocument();
    });
  });

  it('hides self-assessment controls when allowSelfAssessment is false', () => {
    render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
        allowSelfAssessment={false}
      />
    );

    // Self-assessment sliders should not be present
    expect(screen.queryByText('Update your progress:')).not.toBeInTheDocument();
    
    // Mark Complete buttons should not be present
    expect(screen.queryByText('Mark Complete')).not.toBeInTheDocument();
  });

  it('updates objectives when props change', () => {
    const { rerender } = render(
      <ProgressTracking 
        learningObjectives={mockLearningObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    );

    // Initial render should show 3 objectives
    expect(screen.getAllByText(/progress/i)).toHaveLength(4); // 3 objectives + overall progress
    
    // Update props with new objectives
    const newObjectives = [
      ...mockLearningObjectives,
      {
        id: 'obj4',
        title: 'New Objective',
        description: 'A newly added objective',
        completed: false,
        progress: 0,
      }
    ];
    
    rerender(
      <ProgressTracking 
        learningObjectives={newObjectives}
        onObjectiveComplete={mockOnObjectiveComplete}
        onProgressUpdate={mockOnProgressUpdate}
      />
    );
    
    // Should now show 4 objectives
    expect(screen.getByText('New Objective')).toBeInTheDocument();
    expect(screen.getAllByText(/progress/i)).toHaveLength(5); // 4 objectives + overall progress
  });
});
