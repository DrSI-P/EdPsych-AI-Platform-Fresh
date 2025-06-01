"use client";

import React, { useState, useEffect } from 'react';
import { useVoiceInput } from '@/providers/voice-input-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * CrossPlatformVoiceInput Component
 * 
 * An enhanced version of the GlobalVoiceInput component that provides consistent
 * voice input capabilities across all platform areas, with improved accessibility
 * and special educational needs support.
 */
export function CrossPlatformVoiceInput() {
  const { 
    isAvailable, 
    isListening, 
    startListening, 
    stopListening, 
    transcript, 
    interimTranscript,
    clearTranscript,
    settings,
    ageGroup
  } = useVoiceInput();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Handle voice input availability
  if (!isAvailable) return null;

  // Determine UI style based on age group
  const getAgeGroupStyles = () => {
    switch(ageGroup) {
      case 'nursery':
        return {
          buttonSize: 'h-14 w-14',
          iconSize: 'h-7 w-7',
          buttonColor: 'bg-yellow-400 hover:bg-yellow-500 text-yellow-950',
          animation: 'animate-bounce',
          borderRadius: 'rounded-full'
        };
      case 'early-primary':
        return {
          buttonSize: 'h-12 w-12',
          iconSize: 'h-6 w-6',
          buttonColor: 'bg-blue-400 hover:bg-blue-500 text-white',
          animation: 'animate-pulse',
          borderRadius: 'rounded-full'
        };
      case 'late-primary':
        return {
          buttonSize: 'h-10 w-10',
          iconSize: 'h-5 w-5',
          buttonColor: 'bg-white hover:bg-slate-50 text-blue-600',
          animation: '',
          borderRadius: 'rounded-full'
        };
      case 'secondary':
        return {
          buttonSize: 'h-10 w-10',
          iconSize: 'h-5 w-5',
          buttonColor: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
          animation: '',
          borderRadius: 'rounded-md'
        };
      default:
        return {
          buttonSize: 'h-10 w-10',
          iconSize: 'h-5 w-5',
          buttonColor: 'bg-white hover:bg-slate-50 text-blue-600',
          animation: '',
          borderRadius: 'rounded-full'
        };
    }
  };
  
  const styles = getAgeGroupStyles();
  
  // Get appropriate help text based on age group
  const getHelpText = () => {
    switch(ageGroup) {
      case 'nursery':
        return "Tap the big button and speak!";
      case 'early-primary':
        return "Press the microphone button and say what you want to do.";
      case 'late-primary':
        return "Click the microphone to use your voice instead of typing. Speak clearly and at a normal pace.";
      case 'secondary':
        return "Click the microphone icon to activate voice input. For best results, speak clearly and use direct commands.";
      default:
        return "Click the microphone to activate voice input.";
    }
  };
  
  // Special needs adaptations
  const hasSpecialNeeds = settings?.specialEducationalNeeds?.articulation || 
                          settings?.specialEducationalNeeds?.fluency || 
                          settings?.specialEducationalNeeds?.processing;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="mb-2"
          >
            {!isMinimized ? (
              <Card className={`w-80 shadow-lg ${hasSpecialNeeds ? 'border-primary' : ''}`}>
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    <Mic className={`${styles.iconSize} text-primary`} />
                    <span className="font-medium text-sm">
                      {ageGroup === 'nursery' || ageGroup === 'early-primary' 
                        ? "Speak Now" 
                        : "Voice Assistant"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => setShowHelp(!showHelp)}
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Help</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => setIsMinimized(true)}
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimize</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <CardContent className="p-3 space-y-3">
                  {showHelp && (
                    <div className="bg-muted p-2 rounded text-xs">
                      {getHelpText()}
                    </div>
                  )}
                  
                  <div className={`min-h-[100px] bg-slate-50 rounded p-2 text-sm border ${hasSpecialNeeds ? 'border-primary/50' : ''}`}>
                    {transcript || interimTranscript ? (
                      <p>
                        <span>{transcript}</span>
                        <span className="text-slate-400">{interimTranscript}</span>
                      </p>
                    ) : (
                      <p className="text-slate-400">
                        {isListening 
                          ? (ageGroup === 'nursery' || ageGroup === 'early-primary' 
                              ? "I'm listening..." 
                              : "Listening...") 
                          : (ageGroup === 'nursery' || ageGroup === 'early-primary'
                              ? "Press the button and speak!"
                              : "Click the microphone to start speaking...")}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {isListening ? (
                        <Button 
                          variant="destructive"
                          size={ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'lg' : 'sm'}
                          onClick={stopListening}
                          className={`flex items-center gap-1 ${ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'h-10' : 'h-8'}`}
                        >
                          <MicOff className={ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'h-5 w-5' : 'h-3.5 w-3.5'} />
                          <span className={ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'text-sm' : 'text-xs'}>
                            {ageGroup === 'nursery' ? "Stop" : "Stop Listening"}
                          </span>
                        </Button>
                      ) : (
                        <Button 
                          variant="default"
                          size={ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'lg' : 'sm'}
                          onClick={startListening}
                          className={`flex items-center gap-1 ${ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'h-10' : 'h-8'}`}
                        >
                          <Mic className={ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'h-5 w-5' : 'h-3.5 w-3.5'} />
                          <span className={ageGroup === 'nursery' || ageGroup === 'early-primary' ? 'text-sm' : 'text-xs'}>
                            {ageGroup === 'nursery' ? "Speak" : "Start Listening"}
                          </span>
                        </Button>
                      )}
                      
                      {transcript && ageGroup !== 'nursery' && (
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
                    
                    {hasSpecialNeeds && (
                      <div className="text-xs text-primary font-medium">
                        Special Needs Support Active
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                variant="outline"
                className={`flex items-center gap-2 ${hasSpecialNeeds ? 'border-primary' : 'bg-white'} shadow-md`}
                onClick={() => setIsMinimized(false)}
              >
                <Mic className={`${styles.iconSize} text-primary`} />
                <span>{ageGroup === 'nursery' || ageGroup === 'early-primary' ? "Speak" : "Voice Assistant"}</span>
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`${styles.buttonSize} ${styles.borderRadius} ${styles.buttonColor} shadow-md border-slate-200 ${styles.animation} ${hasSpecialNeeds ? 'border-primary' : ''}`}
                  onClick={() => setIsOpen(true)}
                >
                  <Mic className={styles.iconSize} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{ageGroup === 'nursery' || ageGroup === 'early-primary' ? "Speak" : "Open Voice Assistant"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}
    </div>
  );
}
