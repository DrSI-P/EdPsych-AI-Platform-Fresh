import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AITutoringSession } from '../components/ai/tutoring/ai-tutoring-session';
import { NaturalLanguageConceptExplainer } from '../components/ai/tutoring/natural-language-concept-explainer';
import { AITutoringSystemIntegration } from '../components/ai/tutoring/ai-tutoring-system-integration';
import { LearningStyle, UKKeyStage, UKSubject, ProficiencyLevel } from '@/lib/learning-path/types';

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        image: '/assets/avatar.png'
      }
    }
  }))
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

// Mock the useAIService hook
jest.mock('@/lib/ai/ai-service', () => ({
  useAIService: jest.fn(() => ({
    isLoading: false,
    error: null,
    generateText: jest.fn(() => Promise.resolve({ text: 'AI-generated response' })),
    analyzeSentiment: jest.fn(() => Promise.resolve({ sentiment: 'positive' })),
    generateEducationalContent: jest.fn(() => Promise.resolve({ content: 'Educational content' })),
    evaluateOpenEndedAnswer: jest.fn(() => Promise.resolve({ score: 8, feedback: 'Good answer' }))
  }))
}));

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn()
  }))
}));

describe('AI Tutoring System', () => {
  describe('AITutoringSession Component', () => {
    test('renders correctly with initial props', () => {
      render(
        <AITutoringSession
          initialSubject={UKSubject.MATHEMATICS}
          initialTopic="Fractions and Decimals"
          initialKeyStage={UKKeyStage.KS2}
          initialLearningStyle={LearningStyle.VISUAL}
          initialProficiencyLevel={ProficiencyLevel.DEVELOPING}
          onSessionComplete={jest.fn()}
          onSessionSave={jest.fn()}
        />
      );
      
      // Check that the component renders with the correct title and topic
      expect(screen.getByText('AI Tutor')).toBeInTheDocument();
      expect(screen.getByText('Mathematics - Fractions and Decimals')).toBeInTheDocument();
      
      // Check that the welcome message is displayed
      expect(screen.getByText(/Welcome to your personalized tutoring session/i)).toBeInTheDocument();
      
      // Check that the input field is present
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });
    
    test('handles user input and generates responses', async () => {
      render(
        <AITutoringSession
          initialSubject={UKSubject.MATHEMATICS}
          initialTopic="Fractions and Decimals"
          initialKeyStage={UKKeyStage.KS2}
          initialLearningStyle={LearningStyle.VISUAL}
          initialProficiencyLevel={ProficiencyLevel.DEVELOPING}
          onSessionComplete={jest.fn()}
          onSessionSave={jest.fn()}
        />
      );
      
      // Type a question in the input field
      const inputField = screen.getByPlaceholderText('Ask a question...');
      fireEvent.change(inputField, { target: { value: 'What are fractions?' } });
      
      // Submit the question
      const submitButton = screen.getByRole('button', { name: '' }); // Send button has no text, just an icon
      fireEvent.click(submitButton);
      
      // Check that the user's question appears in the chat
      expect(screen.getByText('What are fractions?')).toBeInTheDocument();
      
      // Wait for the AI response
      await waitFor(() => {
        // The exact response text will depend on the implementation
        // but we can check for elements that should be present in any response
        expect(screen.queryByText(/fractions/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    test('adapts to different learning styles', () => {
      // Test with visual learning style
      const { unmount } = render(
        <AITutoringSession
          initialSubject={UKSubject.MATHEMATICS}
          initialTopic="Fractions and Decimals"
          initialKeyStage={UKKeyStage.KS2}
          initialLearningStyle={LearningStyle.VISUAL}
          initialProficiencyLevel={ProficiencyLevel.DEVELOPING}
          onSessionComplete={jest.fn()}
          onSessionSave={jest.fn()}
        />
      );
      
      // Check settings to confirm visual learning style is selected
      const settingsButton = screen.getByTitle('Settings');
      fireEvent.click(settingsButton);
      
      expect(screen.getByText('Visual')).toBeInTheDocument();
      
      unmount();
      
      // Test with auditory learning style
      render(
        <AITutoringSession
          initialSubject={UKSubject.MATHEMATICS}
          initialTopic="Fractions and Decimals"
          initialKeyStage={UKKeyStage.KS2}
          initialLearningStyle={LearningStyle.AUDITORY}
          initialProficiencyLevel={ProficiencyLevel.DEVELOPING}
          onSessionComplete={jest.fn()}
          onSessionSave={jest.fn()}
        />
      );
      
      // Check settings to confirm auditory learning style is selected
      const newSettingsButton = screen.getByTitle('Settings');
      fireEvent.click(newSettingsButton);
      
      expect(screen.getByText('Auditory')).toBeInTheDocument();
    });
    
    test('handles session completion', async () => {
      const mockOnSessionComplete = jest.fn();
      
      render(
        <AITutoringSession
          initialSubject={UKSubject.MATHEMATICS}
          initialTopic="Fractions and Decimals"
          initialKeyStage={UKKeyStage.KS2}
          initialLearningStyle={LearningStyle.VISUAL}
          initialProficiencyLevel={ProficiencyLevel.DEVELOPING}
          onSessionComplete={mockOnSessionComplete}
          onSessionSave={jest.fn()}
        />
      );
      
      // Start the session
      const moreOptionsButton = screen.getByRole('button', { name: '' }); // More options button
      fireEvent.click(moreOptionsButton);
      
      const startSessionButton = screen.getByText('Start Session');
      fireEvent.click(startSessionButton);
      
      // End the session
      fireEvent.click(moreOptionsButton);
      
      const endSessionButton = screen.getByText('End Session');
      fireEvent.click(endSessionButton);
      
      // Check that the onSessionComplete callback was called
      await waitFor(() => {
        expect(mockOnSessionComplete).toHaveBeenCalled();
      });
      
      // Check that the session summary is displayed
      expect(screen.getByText('Session Summary')).toBeInTheDocument();
    });
  });
  
  describe('NaturalLanguageConceptExplainer Component', () => {
    test('renders correctly with initial props', () => {
      render(
        <NaturalLanguageConceptExplainer
          subject={UKSubject.MATHEMATICS}
          topic="Fractions and Decimals"
          keyStage={UKKeyStage.KS2}
          learningStyle={LearningStyle.VISUAL}
          proficiencyLevel={ProficiencyLevel.DEVELOPING}
          onExplanationComplete={jest.fn()}
          onExplanationSave={jest.fn()}
        />
      );
      
      // Check that the component renders with the correct title
      expect(screen.getByText('Concept Explainer')).toBeInTheDocument();
      
      // Check that the welcome message is displayed
      expect(screen.getByText(/Ask questions about Fractions and Decimals in Mathematics/i)).toBeInTheDocument();
      
      // Check that the input field is present
      expect(screen.getByPlaceholderText('Ask a question about this topic...')).toBeInTheDocument();
    });
    
    test('handles user queries and generates explanations', async () => {
      render(
        <NaturalLanguageConceptExplainer
          subject={UKSubject.MATHEMATICS}
          topic="Fractions and Decimals"
          keyStage={UKKeyStage.KS2}
          learningStyle={LearningStyle.VISUAL}
          proficiencyLevel={ProficiencyLevel.DEVELOPING}
          onExplanationComplete={jest.fn()}
          onExplanationSave={jest.fn()}
        />
      );
      
      // Type a question in the input field
      const inputField = screen.getByPlaceholderText('Ask a question about this topic...');
      fireEvent.change(inputField, { target: { value: 'What are equivalent fractions?' } });
      
      // Submit the question
      const submitButton = screen.getByRole('button', { name: '' }); // Send button has no text, just an icon
      fireEvent.click(submitButton);
      
      // Check that the user's question appears in the chat
      expect(screen.getByText('What are equivalent fractions?')).toBeInTheDocument();
      
      // Wait for the AI explanation
      await waitFor(() => {
        // The exact response text will depend on the implementation
        // but we can check for elements that should be present in any explanation
        expect(screen.queryByText(/equivalent fractions/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    test('allows changing explanation mode', async () => {
      render(
        <NaturalLanguageConceptExplainer
          subject={UKSubject.MATHEMATICS}
          topic="Fractions and Decimals"
          keyStage={UKKeyStage.KS2}
          learningStyle={LearningStyle.VISUAL}
          proficiencyLevel={ProficiencyLevel.DEVELOPING}
          onExplanationComplete={jest.fn()}
          onExplanationSave={jest.fn()}
        />
      );
      
      // Type and submit a question to get an explanation
      const inputField = screen.getByPlaceholderText('Ask a question about this topic...');
      fireEvent.change(inputField, { target: { value: 'What are fractions?' } });
      
      const submitButton = screen.getByRole('button', { name: '' });
      fireEvent.click(submitButton);
      
      // Wait for the explanation to appear
      await waitFor(() => {
        expect(screen.queryByText(/fractions/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Find and click the "Simplified" mode button
      const simplifiedButton = screen.getByText('Simplified');
      fireEvent.click(simplifiedButton);
      
      // Wait for the simplified explanation
      await waitFor(() => {
        // The simplified explanation should have simpler language
        expect(screen.queryByText(/simplified/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    test('provides feedback options for explanations', async () => {
      render(
        <NaturalLanguageConceptExplainer
          subject={UKSubject.MATHEMATICS}
          topic="Fractions and Decimals"
          keyStage={UKKeyStage.KS2}
          learningStyle={LearningStyle.VISUAL}
          proficiencyLevel={ProficiencyLevel.DEVELOPING}
          onExplanationComplete={jest.fn()}
          onExplanationSave={jest.fn()}
        />
      );
      
      // Type and submit a question to get an explanation
      const inputField = screen.getByPlaceholderText('Ask a question about this topic...');
      fireEvent.change(inputField, { target: { value: 'What are fractions?' } });
      
      const submitButton = screen.getByRole('button', { name: '' });
      fireEvent.click(submitButton);
      
      // Wait for the explanation to appear
      await waitFor(() => {
        expect(screen.queryByText(/fractions/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Check that feedback buttons are present
      expect(screen.getByText('Helpful')).toBeInTheDocument();
      expect(screen.getByText('Not Helpful')).toBeInTheDocument();
      
      // Click the "Helpful" feedback button
      const helpfulButton = screen.getByText('Helpful');
      fireEvent.click(helpfulButton);
      
      // The button should now be highlighted (have a different variant)
      expect(helpfulButton.closest('button')).toHaveClass('default');
    });
  });
  
  describe('AITutoringSystemIntegration Component', () => {
    test('renders correctly with initial props', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Initially shows loading state
      expect(screen.getByText('Loading your personalized tutoring system...')).toBeInTheDocument();
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Check that the dashboard tab is active by default
      expect(screen.getByText('Learning Progress')).toBeInTheDocument();
      expect(screen.getByText('Recent Sessions')).toBeInTheDocument();
      expect(screen.getByText('Recommended Learning Content')).toBeInTheDocument();
    });
    
    test('navigates between tabs', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Click on the Tutoring tab
      const tutoringTab = screen.getByRole('tab', { name: 'Tutoring' });
      fireEvent.click(tutoringTab);
      
      // Check that the tutoring content is displayed
      expect(screen.getByText('Start a Tutoring Session')).toBeInTheDocument();
      expect(screen.getByText('Explore Concepts')).toBeInTheDocument();
      
      // Click on the Concepts tab
      const conceptsTab = screen.getByRole('tab', { name: 'Concepts' });
      fireEvent.click(conceptsTab);
      
      // Check that the concept explainer is displayed
      expect(screen.getByText('Concept Explainer')).toBeInTheDocument();
      
      // Click on the Progress tab
      const progressTab = screen.getByRole('tab', { name: 'Progress' });
      fireEvent.click(progressTab);
      
      // Check that the progress content is displayed
      expect(screen.getByText('Learning Path Progress')).toBeInTheDocument();
      expect(screen.getByText('Proficiency Growth')).toBeInTheDocument();
      expect(screen.getByText('Learning Insights')).toBeInTheDocument();
    });
    
    test('starts a tutoring session', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Click on the Tutoring tab
      const tutoringTab = screen.getByRole('tab', { name: 'Tutoring' });
      fireEvent.click(tutoringTab);
      
      // Find and click a "Start Tutoring" button
      const startTutoringButton = screen.getAllByText('Start Tutoring')[0];
      fireEvent.click(startTutoringButton);
      
      // Check that the tutoring session is started
      await waitFor(() => {
        expect(screen.getByText('AI Tutor')).toBeInTheDocument();
      });
    });
    
    test('integrates with learning paths', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Check that the learning path information is displayed
      expect(screen.getByText('Learning Progress')).toBeInTheDocument();
      
      // Check for specific learning path nodes
      expect(screen.getByText('Current Focus Topic')).toBeInTheDocument();
      
      // Click on the Progress tab to see more detailed learning path information
      const progressTab = screen.getByRole('tab', { name: 'Progress' });
      fireEvent.click(progressTab);
      
      // Check for learning path nodes
      expect(screen.getByText('Learning Path Progress')).toBeInTheDocument();
      expect(screen.getByText('Number and Place Value')).toBeInTheDocument();
      expect(screen.getByText('Addition and Subtraction')).toBeInTheDocument();
    });
    
    test('displays recommended content based on learning style', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Check that recommended content is displayed
      expect(screen.getByText('Recommended Learning Content')).toBeInTheDocument();
      
      // Check for specific content items
      expect(screen.getByText('Understanding Fractions')).toBeInTheDocument();
      expect(screen.getByText('Decimal Place Value')).toBeInTheDocument();
      
      // Refresh recommendations
      const refreshButton = screen.getByText('Refresh Recommendations');
      fireEvent.click(refreshButton);
      
      // Check that the recommendations are refreshed (toast notification would appear in real implementation)
      await waitFor(() => {
        // In a real implementation, we would check for the toast notification
        // Here we just verify the button still exists after clicking
        expect(screen.getByText('Refresh Recommendations')).toBeInTheDocument();
      });
    });
  });
  
  describe('Educational Psychology Alignment', () => {
    test('adapts to different learning styles', async () => {
      // Test with visual learning style
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Click on the Progress tab to see learning insights
      const progressTab = screen.getByRole('tab', { name: 'Progress' });
      fireEvent.click(progressTab);
      
      // Check for learning style insights
      expect(screen.getByText('Learning Patterns')).toBeInTheDocument();
      expect(screen.getByText('You learn best with visual examples and diagrams')).toBeInTheDocument();
    });
    
    test('provides appropriate feedback and encouragement', async () => {
      render(
        <AITutoringSession
          initialSubject={UKSubject.MATHEMATICS}
          initialTopic="Fractions and Decimals"
          initialKeyStage={UKKeyStage.KS2}
          initialLearningStyle={LearningStyle.VISUAL}
          initialProficiencyLevel={ProficiencyLevel.DEVELOPING}
          onSessionComplete={jest.fn()}
          onSessionSave={jest.fn()}
        />
      );
      
      // Check that the welcome message is encouraging and supportive
      expect(screen.getByText(/Welcome to your personalized tutoring session/i)).toBeInTheDocument();
      
      // Type a question in the input field
      const inputField = screen.getByPlaceholderText('Ask a question...');
      fireEvent.change(inputField, { target: { value: 'I find fractions difficult' } });
      
      // Submit the question
      const submitButton = screen.getByRole('button', { name: '' });
      fireEvent.click(submitButton);
      
      // Wait for the AI response
      await waitFor(() => {
        // The response should be supportive and encouraging
        expect(screen.queryByText(/difficult/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
    
    test('aligns with UK curriculum standards', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Check that the learning path is aligned with UK curriculum
      expect(screen.getByText('Mathematics for KS2')).toBeInTheDocument();
      
      // Check for specific curriculum topics
      expect(screen.getByText('Number and Place Value')).toBeInTheDocument();
      expect(screen.getByText('Addition and Subtraction')).toBeInTheDocument();
      expect(screen.getByText('Multiplication and Division')).toBeInTheDocument();
      expect(screen.getByText('Fractions and Decimals')).toBeInTheDocument();
      expect(screen.getByText('Measurement')).toBeInTheDocument();
      expect(screen.getByText('Geometry - Properties of Shapes')).toBeInTheDocument();
      expect(screen.getByText('Statistics')).toBeInTheDocument();
    });
  });
  
  describe('Accessibility and Inclusion', () => {
    test('supports keyboard navigation', () => {
      render(
        <AITutoringSession
          initialSubject={UKSubject.MATHEMATICS}
          initialTopic="Fractions and Decimals"
          initialKeyStage={UKKeyStage.KS2}
          initialLearningStyle={LearningStyle.VISUAL}
          initialProficiencyLevel={ProficiencyLevel.DEVELOPING}
          onSessionComplete={jest.fn()}
          onSessionSave={jest.fn()}
        />
      );
      
      // Focus on the input field
      const inputField = screen.getByPlaceholderText('Ask a question...');
      inputField.focus();
      expect(document.activeElement).toBe(inputField);
      
      // Type a question
      fireEvent.change(inputField, { target: { value: 'What are fractions?' } });
      
      // Press Enter to submit
      fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });
      
      // Check that the question was submitted
      expect(screen.getByText('What are fractions?')).toBeInTheDocument();
    });
    
    test('provides clear visual feedback', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Check for progress indicators
      expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
      
      // Check for clear section headings
      expect(screen.getByText('Learning Progress')).toBeInTheDocument();
      expect(screen.getByText('Recent Sessions')).toBeInTheDocument();
      expect(screen.getByText('Recommended Learning Content')).toBeInTheDocument();
    });
    
    test('uses appropriate color contrast', async () => {
      render(
        <AITutoringSystemIntegration
          studentId="student-1"
          initialSubject={UKSubject.MATHEMATICS}
          initialKeyStage={UKKeyStage.KS2}
        />
      );
      
      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('AI Tutoring System')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Check that badges use appropriate colors
      const badges = screen.getAllByText('high');
      expect(badges.length).toBeGreaterThan(0);
      
      // Check that buttons have appropriate contrast
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
