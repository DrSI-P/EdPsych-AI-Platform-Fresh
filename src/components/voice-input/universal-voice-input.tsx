'use client';

import React from 'react';
import { useVoiceInput } from '@/components/VoiceInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UniversalVoiceInputProps {
  onTranscriptChange?: (transcript: string) => void;
  onComplete?: (finalTranscript: string) => void;
  placeholder?: string;
  mode?: 'standard' | 'continuous' | 'command';
  showSettings?: boolean;
  className?: string;
}

/**
 * Universal Voice Input Component
 * 
 * A flexible voice input component that adapts to the user's age group
 * and provides appropriate UI and functionality.
 */
export const UniversalVoiceInput: React.FC<UniversalVoiceInputProps> = ({
  onTranscriptChange,
  onComplete,
  placeholder = "Speak to see your words appear here...",
  mode = 'standard',
  showSettings = false,
  className = '',
}) => {
  const { 
    isAvailable, 
    isListening, 
    startListening, 
    stopListening,
    transcript,
    interimTranscript,
    clearTranscript,
    volume,
    ageGroup
  } = useVoiceInput();
  
  // Handle transcript changes
  React.useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript + (interimTranscript ? ' ' + interimTranscript : ''));
    }
  }, [transcript, interimTranscript, onTranscriptChange]);
  
  // Handle completion
  React.useEffect(() => {
    if (mode === 'standard' && !isListening && transcript && onComplete) {
      onComplete(transcript);
    }
  }, [isListening, transcript, mode, onComplete]);
  
  // Start listening with appropriate options
  const handleStartListening = () => {
    startListening({
      continuous: mode === 'continuous',
    });
  };
  
  // Render appropriate UI based on age group
  const renderAgeSpecificUI = () => {
    switch (ageGroup) {
      case 'nursery':
        return (
          <NurseryVoiceUI 
            isListening={isListening}
            startListening={handleStartListening}
            stopListening={stopListening}
            clearTranscript={clearTranscript}
            transcript={transcript}
            interimTranscript={interimTranscript}
            volume={volume}
            placeholder={placeholder}
          />
        );
      case 'early-primary':
        return (
          <EarlyPrimaryVoiceUI 
            isListening={isListening}
            startListening={handleStartListening}
            stopListening={stopListening}
            clearTranscript={clearTranscript}
            transcript={transcript}
            interimTranscript={interimTranscript}
            volume={volume}
            placeholder={placeholder}
          />
        );
      case 'late-primary':
        return (
          <LatePrimaryVoiceUI 
            isListening={isListening}
            startListening={handleStartListening}
            stopListening={stopListening}
            clearTranscript={clearTranscript}
            transcript={transcript}
            interimTranscript={interimTranscript}
            volume={volume}
            placeholder={placeholder}
          />
        );
      case 'secondary':
        return (
          <SecondaryVoiceUI 
            isListening={isListening}
            startListening={handleStartListening}
            stopListening={stopListening}
            clearTranscript={clearTranscript}
            transcript={transcript}
            interimTranscript={interimTranscript}
            volume={volume}
            placeholder={placeholder}
          />
        );
      default:
        return (
          <LatePrimaryVoiceUI 
            isListening={isListening}
            startListening={handleStartListening}
            stopListening={stopListening}
            clearTranscript={clearTranscript}
            transcript={transcript}
            interimTranscript={interimTranscript}
            volume={volume}
            placeholder={placeholder}
          />
        );
    }
  };
  
  if (!isAvailable) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Voice Input Not Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Voice input is not supported in your browser. Please try using Chrome, Edge, or Safari.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={className}>
      {renderAgeSpecificUI()}
    </div>
  );
};

// Shared interface for age-specific UI components
interface AgeSpecificVoiceUIProps {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  transcript: string;
  interimTranscript: string;
  volume: number;
  placeholder: string;
}

// Nursery Voice UI (3-5 years)
// Focused on large, colorful buttons and minimal text
const NurseryVoiceUI: React.FC<AgeSpecificVoiceUIProps> = ({
  isListening,
  startListening,
  stopListening,
  clearTranscript,
  transcript,
  interimTranscript,
  volume,
  placeholder
}) => {
  return (
    <Card className="border-4 border-blue-300 rounded-xl bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-centre justify-centre text-centre text-2xl font-bold text-blue-600">
          {isListening ? "I'm Listening!" : "Talk to Me!"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        {/* Character animation */}
        <div className="flex justify-centre mb-4">
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 + (volume * 0.2) }}
                exit={{ scale: 0.8 }}
                className="w-24 h-24 bg-blue-200 rounded-full flex items-centre justify-centre"
              >
                <span className="text-4xl">🎤</span>
              </motion.div>
            ) : (
              <motion.div
                key="not-listening"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="w-24 h-24 bg-grey-200 rounded-full flex items-centre justify-centre"
              >
                <span className="text-4xl">🎤</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Transcript display - simplified for nursery */}
        <div className="min-h-[60px] bg-white rounded-xl p-4 text-centre text-xl">
          {transcript || interimTranscript ? (
            <p className="text-blue-800">{transcript} {interimTranscript}</p>
          ) : (
            <p className="text-grey-400">{placeholder}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-centre gap-4 pt-2">
        {isListening ? (
          <Button 
            size="lg"
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
            onClick={stopListening}
          >
            <MicOff className="h-8 w-8" />
          </Button>
        ) : (
          <Button 
            size="lg"
            className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
            onClick={startListening}
          >
            <Mic className="h-8 w-8" />
          </Button>
        )}
        
        {transcript && (
          <Button 
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-4 border-yellow-300"
            onClick={clearTranscript}
          >
            <span className="text-2xl">🧹</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Early Primary Voice UI (5-8 years)
// Friendly design with simple text and engaging visuals
const EarlyPrimaryVoiceUI: React.FC<AgeSpecificVoiceUIProps> = ({
  isListening,
  startListening,
  stopListening,
  clearTranscript,
  transcript,
  interimTranscript,
  volume,
  placeholder
}) => {
  return (
    <Card className="border-2 border-purple-300 rounded-lg bg-purple-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-centre justify-between text-xl font-bold text-purple-700">
          <span>Voice Helper</span>
          {isListening && (
            <div className="flex items-centre">
              <Volume2 className="h-5 w-5 mr-1 text-purple-500" />
              <div className="w-16 h-2 bg-grey-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-purple-500"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        {/* Animated helper */}
        <div className="flex justify-centre mb-3">
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ y: 5 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-16 h-16 bg-purple-200 rounded-full flex items-centre justify-centre"
              >
                <span className="text-3xl">🦊</span>
              </motion.div>
            ) : (
              <motion.div
                key="not-listening"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: 1, duration: 2 }}
                className="w-16 h-16 bg-grey-200 rounded-full flex items-centre justify-centre"
              >
                <span className="text-3xl">🦊</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Transcript display */}
        <div className="min-h-[80px] bg-white rounded-lg p-3 text-lg">
          {transcript || interimTranscript ? (
            <p className="text-purple-900">{transcript} <span className="text-purple-400">{interimTranscript}</span></p>
          ) : (
            <p className="text-grey-400">{placeholder}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-centre gap-3 pt-2">
        {isListening ? (
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-centre gap-2"
            onClick={stopListening}
          >
            <MicOff className="h-5 w-5" />
            <span>Stop</span>
          </Button>
        ) : (
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-centre gap-2"
            onClick={startListening}
          >
            <Mic className="h-5 w-5" />
            <span>Start</span>
          </Button>
        )}
        
        {transcript && (
          <Button 
            variant="outline"
            className="border-2 border-purple-300 text-purple-700 px-4 py-2 rounded-lg"
            onClick={clearTranscript}
          >
            Clear
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Late Primary Voice UI (8-11 years)
// Balanced design with text and visual elements
const LatePrimaryVoiceUI: React.FC<AgeSpecificVoiceUIProps> = ({
  isListening,
  startListening,
  stopListening,
  clearTranscript,
  transcript,
  interimTranscript,
  volume,
  placeholder
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-centre justify-between">
          <span className="flex items-centre gap-2">
            {isListening ? (
              <Mic className="h-5 w-5 text-green-500" />
            ) : (
              <MicOff className="h-5 w-5 text-grey-400" />
            )}
            Voice Input
          </span>
          
          {isListening && (
            <div className="flex items-centre gap-2">
              <span className="text-sm text-grey-500">Volume</span>
              <div className="w-20 h-2 bg-grey-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="relative min-h-[100px] bg-grey-50 rounded-md p-3 border">
          {transcript || interimTranscript ? (
            <div>
              <span>{transcript}</span>
              <span className="text-grey-400">{interimTranscript}</span>
            </div>
          ) : (
            <p className="text-grey-400">{placeholder}</p>
          )}
          
          {isListening && (
            <motion.div 
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-100 flex items-centre justify-centre"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Mic className="h-3 w-3 text-green-600" />
            </motion.div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          {isListening ? (
            <Button 
              variant="destructive"
              size="sm"
              onClick={stopListening}
              className="flex items-centre gap-1"
            >
              <MicOff className="h-4 w-4" />
              Stop
            </Button>
          ) : (
            <Button 
              variant="default"
              size="sm"
              onClick={startListening}
              className="flex items-centre gap-1"
            >
              <Mic className="h-4 w-4" />
              Start
            </Button>
          )}
          
          {transcript && (
            <Button 
              variant="outline"
              size="sm"
              onClick={clearTranscript}
            >
              Clear
            </Button>
          )}
        </div>
        
        <div className="text-xs text-grey-500">
          {isListening ? "Listening..." : "Ready"}
        </div>
      </CardFooter>
    </Card>
  );
};

// Secondary Voice UI (11+ years)
// Professional design with comprehensive controls
const SecondaryVoiceUI: React.FC<AgeSpecificVoiceUIProps> = ({
  isListening,
  startListening,
  stopListening,
  clearTranscript,
  transcript,
  interimTranscript,
  volume,
  placeholder
}) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-centre justify-between text-base font-medium">
          <span className="flex items-centre gap-2">
            {isListening ? (
              <Mic className="h-4 w-4 text-blue-600" />
            ) : (
              <MicOff className="h-4 w-4 text-grey-400" />
            )}
            Speech Recognition
          </span>
          
          {isListening && (
            <div className="flex items-centre gap-2">
              <div className="w-24 h-1.5 bg-grey-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-600"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="relative min-h-[120px] bg-grey-50 rounded-sm p-3 border border-grey-200 text-sm">
          {transcript || interimTranscript ? (
            <div>
              <span className="text-grey-900">{transcript}</span>
              <span className="text-grey-400">{interimTranscript}</span>
            </div>
          ) : (
            <p className="text-grey-400 text-sm">{placeholder}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          {isListening ? (
            <Button 
              variant="destructive"
              size="sm"
              onClick={stopListening}
              className="flex items-centre gap-1 h-8"
            >
              <MicOff className="h-3.5 w-3.5" />
              <span className="text-xs">Stop Recording</span>
            </Button>
          ) : (
            <Button 
              variant="default"
              size="sm"
              onClick={startListening}
              className="flex items-centre gap-1 h-8"
            >
              <Mic className="h-3.5 w-3.5" />
              <span className="text-xs">Start Recording</span>
            </Button>
          )}
          
          {transcript && (
            <Button 
              variant="outline"
              size="sm"
              onClick={clearTranscript}
              className="h-8"
            >
              <span className="text-xs">Clear</span>
            </Button>
          )}
        </div>
        
        <div className="text-xs text-grey-500">
          {isListening ? "Recording..." : "Ready"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UniversalVoiceInput;
