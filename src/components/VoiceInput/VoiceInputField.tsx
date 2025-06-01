'use client';

import React, { useState, useEffect } from 'react';
import { useVoiceInput } from './VoiceInputProvider';

interface VoiceInputFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  ageGroup?: 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'standard';
  autoSubmit?: boolean;
  autoSubmitDelay?: number;
}

const VoiceInputField: React.FC<VoiceInputFieldProps> = ({
  placeholder = 'Speak or type here...',
  value,
  onChange,
  onSubmit,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  ageGroup = 'standard',
  autoSubmit = false,
  autoSubmitDelay = 1500
}) => {
  const { isListening, transcript, startListening, stopListening, clearTranscript, supported } = useVoiceInput();
  const [inputValue, setInputValue] = useState(value || '');
  const [inputStyle, setInputStyle] = useState('');
  const [buttonStyle, setButtonStyle] = useState('');
  const [submitTimeout, setSubmitTimeout] = useState<NodeJS.Timeout | null>(null);

  // Configure styles based on age group
  useEffect(() => {
    switch (ageGroup) {
      case 'nursery':
        setInputStyle('text-xl p-4 rounded-2xl border-4 border-purple-300 focus:border-purple-500 focus:ring-purple-500');
        setButtonStyle('bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full p-4');
        break;
      case 'early-primary':
        setInputStyle('text-lg p-3 rounded-xl border-3 border-blue-300 focus:border-blue-500 focus:ring-blue-500');
        setButtonStyle('bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl p-3');
        break;
      case 'late-primary':
        setInputStyle('text-base p-3 rounded-lg border-2 border-teal-300 focus:border-teal-500 focus:ring-teal-500');
        setButtonStyle('bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg p-3');
        break;
      case 'secondary':
        setInputStyle('text-sm p-2 rounded-md border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500');
        setButtonStyle('bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md p-2');
        break;
      default:
        setInputStyle('text-base p-3 rounded-md border border-gray-300 focus:border-primary focus:ring-primary');
        setButtonStyle('bg-primary hover:bg-primary-dark text-white font-medium rounded-md p-3');
    }
  }, [ageGroup]);

  // Update input value when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputValue(prevValue => prevValue + transcript);
      clearTranscript();
      
      // If autoSubmit is enabled, set a timeout to submit after delay
      if (autoSubmit && onSubmit) {
        if (submitTimeout) {
          clearTimeout(submitTimeout);
        }
        
        const timeout = setTimeout(() => {
          onSubmit(inputValue + transcript);
        }, autoSubmitDelay);
        
        setSubmitTimeout(timeout);
      }
    }
  }, [transcript, clearTranscript, autoSubmit, autoSubmitDelay, onSubmit, inputValue]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (submitTimeout) {
        clearTimeout(submitTimeout);
      }
    };
  }, [submitTimeout]);

  // Update local state when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Reset auto-submit timeout if typing
    if (autoSubmit && onSubmit && submitTimeout) {
      clearTimeout(submitTimeout);
      
      const timeout = setTimeout(() => {
        onSubmit(newValue);
      }, autoSubmitDelay);
      
      setSubmitTimeout(timeout);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(inputValue);
      if (submitTimeout) {
        clearTimeout(submitTimeout);
        setSubmitTimeout(null);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Microphone icon SVG - changes color based on listening state
  const MicrophoneIcon = () => (
    <svg 
      className="w-6 h-6" 
      fill={isListening ? 'red' : 'currentColor'} 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`flex-grow ${inputStyle} ${inputClassName}`}
        aria-label="Voice input field"
      />
      {supported && (
        <button
          type="button"
          onClick={toggleListening}
          className={`ml-2 ${buttonStyle} ${isListening ? 'animate-pulse' : ''} ${buttonClassName}`}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          title={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          <MicrophoneIcon />
        </button>
      )}
    </div>
  );
};

export default VoiceInputField;
