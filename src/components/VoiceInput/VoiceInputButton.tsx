'use client';

import React, { useState, useEffect } from 'react';
import { useVoiceInput } from './VoiceInputProvider';

interface VoiceInputButtonProps {
  onTranscriptChange?: (transcript: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  className?: string;
  buttonText?: {
    start: string;
    stop: string;
    notSupported: string;
  };
  ageGroup?: 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'standard';
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscriptChange,
  onListeningChange,
  className = '',
  buttonText = {
    start: 'Start Speaking',
    stop: 'Stop Speaking',
    notSupported: 'Voice Input Not Available'
  },
  ageGroup = 'standard'
}) => {
  const { isListening, transcript, startListening, stopListening, supported, error } = useVoiceInput();
  const [buttonSize, setButtonSize] = useState('');
  const [buttonStyle, setButtonStyle] = useState('');
  const [iconSize, setIconSize] = useState('');

  // Configure button appearance based on age group
  useEffect(() => {
    switch (ageGroup) {
      case 'nursery':
        setButtonSize('text-xl p-4 rounded-full');
        setButtonStyle('bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-lg');
        setIconSize('w-8 h-8');
        break;
      case 'early-primary':
        setButtonSize('text-lg p-3 rounded-xl');
        setButtonStyle('bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md');
        setIconSize('w-7 h-7');
        break;
      case 'late-primary':
        setButtonSize('text-base p-3 rounded-lg');
        setButtonStyle('bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm');
        setIconSize('w-6 h-6');
        break;
      case 'secondary':
        setButtonSize('text-sm p-2 rounded-md');
        setButtonStyle('bg-indigo-500 hover:bg-indigo-600 text-white font-medium');
        setIconSize('w-5 h-5');
        break;
      default:
        setButtonSize('text-base p-3 rounded-md');
        setButtonStyle('bg-primary text-white font-medium');
        setIconSize('w-6 h-6');
    }
  }, [ageGroup]);

  // Pass transcript to parent component when it changes
  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  // Pass listening state to parent component when it changes
  useEffect(() => {
    if (onListeningChange) {
      onListeningChange(isListening);
    }
  }, [isListening, onListeningChange]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Microphone icon SVG - changes color based on listening state
  const MicrophoneIcon = () => (
    <svg 
      className={`${iconSize} inline-block mr-2`} 
      fill={isListening ? 'red' : 'currentColor'} 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );

  if (!supported) {
    return (
      <button 
        className={`${buttonSize} ${buttonStyle} opacity-50 cursor-not-allowed ${className}`}
        disabled
        title={error || "Speech recognition not supported in this browser"}
      >
        <MicrophoneIcon />
        {buttonText.notSupported}
      </button>
    );
  }

  return (
    <button 
      className={`${buttonSize} ${buttonStyle} transition-all duration-300 ${isListening ? 'animate-pulse' : ''} ${className}`}
      onClick={handleClick}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      <MicrophoneIcon />
      {isListening ? buttonText.stop : buttonText.start}
    </button>
  );
};

export default VoiceInputButton;
