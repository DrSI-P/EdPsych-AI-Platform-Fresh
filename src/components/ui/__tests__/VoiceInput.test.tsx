import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VoiceInput from '@/components/ui/VoiceInput';

// Mock SpeechRecognition
const mockStart = jest.fn();
const mockStop = jest.fn();

class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = 'en-GB';
  onresult = jest.fn();
  onerror = jest.fn();
  onend = jest.fn();
  
  start = mockStart;
  stop = mockStop;
}

window.SpeechRecognition = MockSpeechRecognition;
window.webkitSpeechRecognition = MockSpeechRecognition;

describe('VoiceInput', () => {
  const mockOnSpeechResult = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with default props', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} />);
    
    expect(screen.getByText('Speak to enter text...')).toBeInTheDocument();
    expect(screen.getByLabelText('Start listening')).toBeInTheDocument();
  });
  
  it('renders with custom placeholder', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} placeholder="Custom placeholder" />);
    
    expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
  });
  
  it('starts listening when button is clicked', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} />);
    
    const button = screen.getByLabelText('Start listening');
    fireEvent.click(button);
    
    expect(mockStart).toHaveBeenCalled();
    expect(screen.getByLabelText('Stop listening')).toBeInTheDocument();
  });
  
  it('stops listening when button is clicked again', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} />);
    
    // Start listening
    const startButton = screen.getByLabelText('Start listening');
    fireEvent.click(startButton);
    
    // Stop listening
    const stopButton = screen.getByLabelText('Stop listening');
    fireEvent.click(stopButton);
    
    expect(mockStop).toHaveBeenCalled();
    expect(screen.getByLabelText('Start listening')).toBeInTheDocument();
  });
  
  it('displays transcript when speech is recognised', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} showTranscript={true} />);
    
    // Start listening
    const button = screen.getByLabelText('Start listening');
    fireEvent.click(button);
    
    // Simulate speech recognition result
    const instance = new MockSpeechRecognition();
    const mockEvent = {
      resultIndex: 0,
      results: [
        [{ transcript: 'Hello world', isFinal: false }]
      ]
    };
    
    // Get the onresult callback from the mock constructor and call it
    const onresultProp = MockSpeechRecognition.mock.instances[0].onresult;
    onresultProp(mockEvent);
    
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
  
  it('calls onSpeechResult when final result is received', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} />);
    
    // Start listening
    const button = screen.getByLabelText('Start listening');
    fireEvent.click(button);
    
    // Simulate final speech recognition result
    const instance = new MockSpeechRecognition();
    const mockEvent = {
      resultIndex: 0,
      results: [
        [{ transcript: 'Final result', isFinal: true }]
      ]
    };
    
    // Get the onresult callback from the mock constructor and call it
    const onresultProp = MockSpeechRecognition.mock.instances[0].onresult;
    onresultProp(mockEvent);
    
    expect(mockOnSpeechResult).toHaveBeenCalledWith('Final result');
  });
  
  it('stops listening after final result if not continuous', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} continuous={false} />);
    
    // Start listening
    const button = screen.getByLabelText('Start listening');
    fireEvent.click(button);
    
    // Simulate final speech recognition result
    const instance = new MockSpeechRecognition();
    const mockEvent = {
      resultIndex: 0,
      results: [
        [{ transcript: 'Final result', isFinal: true }]
      ]
    };
    
    // Get the onresult callback from the mock constructor and call it
    const onresultProp = MockSpeechRecognition.mock.instances[0].onresult;
    onresultProp(mockEvent);
    
    expect(screen.getByLabelText('Start listening')).toBeInTheDocument();
  });
  
  it('shows error message when speech recognition is not supported', () => {
    // Temporarily remove SpeechRecognition from window
    const originalSpeechRecognition = window.SpeechRecognition;
    const originalWebkitSpeechRecognition = window.webkitSpeechRecognition;
    
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
    
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} />);
    
    expect(screen.getByText(/Speech recognition is not supported in your browser/i)).toBeInTheDocument();
    
    // Restore SpeechRecognition
    window.SpeechRecognition = originalSpeechRecognition;
    window.webkitSpeechRecognition = originalWebkitSpeechRecognition;
  });
  
  it('disables the button when disabled prop is true', () => {
    render(<VoiceInput onSpeechResult={mockOnSpeechResult} disabled={true} />);
    
    const button = screen.getByLabelText('Start listening');
    expect(button).toHaveAttribute('disabled');
    
    fireEvent.click(button);
    expect(mockStart).not.toHaveBeenCalled();
  });
  
  it('renders button on the left when buttonPosition is left', () => {
    const { container } = render(
      <VoiceInput onSpeechResult={mockOnSpeechResult} buttonPosition="left" />
    );
    
    // Check that the button is the first child in the flex container
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer?.firstElementChild).toHaveAttribute('aria-label', 'Start listening');
  });
  
  it('renders button on the right when buttonPosition is right', () => {
    const { container } = render(
      <VoiceInput onSpeechResult={mockOnSpeechResult} buttonPosition="right" />
    );
    
    // Check that the button is the last child in the flex container
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer?.lastElementChild).toHaveAttribute('aria-label', 'Start listening');
  });
});
