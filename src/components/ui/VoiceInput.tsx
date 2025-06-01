import React, { useState, useEffect } from 'react';

interface VoiceInputProps {
  onSpeechResult: (text: string) => void;
  placeholder?: string;
  language?: string;
  continuous?: boolean;
  className?: string;
  buttonPosition?: 'left' | 'right';
  showTranscript?: boolean;
  disabled?: boolean;
}

/**
 * VoiceInput component that enables speech-to-text functionality
 * for children who struggle with typing
 */
const VoiceInput: React.FC<VoiceInputProps> = ({
  onSpeechResult,
  placeholder = 'Speak to enter text...',
  language = 'en-GB',
  continuous = false,
  className = '',
  buttonPosition = 'right',
  showTranscript = true,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = continuous;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptValue = result[0].transcript;
        
        setTranscript(transcriptValue);
        
        if (result.isFinal) {
          onSpeechResult(transcriptValue);
          
          if (!continuous) {
            setIsListening(false);
          }
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        if (isListening && continuous) {
          recognitionInstance.start();
        } else {
          setIsListening(false);
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      console.error('Speech recognition is not supported in this browser');
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [continuous, language, onSpeechResult]);

  // Toggle listening state
  const toggleListening = () => {
    if (!isSupported || disabled) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className={`voice-input-container relative ${className}`}>
      <div className={`flex items-centre border rounded-lg overflow-hidden ${disabled ? 'opacity-60' : ''}`}>
        {buttonPosition === 'left' && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isListening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            } ${!isSupported || disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-opacity-90'}`}
            disabled={!isSupported || disabled}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        )}
        
        <div className="flex-grow px-4 py-2 min-h-[44px] flex items-centre">
          {showTranscript && transcript ? (
            <p className="text-grey-800">{transcript}</p>
          ) : (
            <p className="text-grey-400">{placeholder}</p>
          )}
        </div>
        
        {buttonPosition === 'right' && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isListening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            } ${!isSupported || disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-opacity-90'}`}
            disabled={!isSupported || disabled}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      {!isSupported && (
        <p className="text-red-500 text-sm mt-1">
          Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.
        </p>
      )}
      
      {/* Visual feedback for speech recognition */}
      {isListening && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-centre">
          <div className="flex space-x-1 py-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
