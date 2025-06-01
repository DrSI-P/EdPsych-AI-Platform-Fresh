'use client';

import React, { useState, useEffect } from 'react';
import { useVoiceInput } from '@/components/VoiceInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, X, Minimize2, Maximize2, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

/**
 * Global Voice Input Component
 * 
 * Provides a floating voice input interface that can be used throughout the application.
 */
const GlobalVoiceInput = () => {
  const { 
    isAvailable, 
    isListening, 
    startListening, 
    stopListening, 
    transcript, 
    interimTranscript,
    clearTranscript,
    volume
  } = useVoiceInput();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Handle voice input availability
  if (!isAvailable) return null;
  
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
              <Card className="w-80 shadow-lg">
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Voice Assistant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => setIsMinimized(true)}
                          >
                            <Minimize2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimize</p>
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
                            onClick={() => setIsOpen(false)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Close</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <CardContent className="p-3 space-y-3">
                  <div className="min-h-[100px] bg-slate-50 rounded p-2 text-sm border">
                    {transcript || interimTranscript ? (
                      <p>
                        <span>{transcript}</span>
                        <span className="text-slate-400">{interimTranscript}</span>
                      </p>
                    ) : (
                      <p className="text-slate-400">
                        {isListening ? "Listening..." : "Click the microphone to start speaking..."}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {isListening ? (
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={stopListening}
                          className="flex items-center gap-1 h-8"
                        >
                          <MicOff className="h-3.5 w-3.5" />
                          <span className="text-xs">Stop</span>
                        </Button>
                      ) : (
                        <Button 
                          variant="default"
                          size="sm"
                          onClick={startListening}
                          className="flex items-center gap-1 h-8"
                        >
                          <Mic className="h-3.5 w-3.5" />
                          <span className="text-xs">Start</span>
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
                    
                    <Dialog open={showSettings} onOpenChange={setShowSettings}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 h-8"
                        >
                          <Settings className="h-3.5 w-3.5" />
                          <span className="text-xs">Settings</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Voice Input Settings</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Voice settings panel would go here.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                variant="outline"
                className="flex items-center gap-2 bg-white shadow-md"
                onClick={() => setIsMinimized(false)}
              >
                <Mic className="h-4 w-4 text-blue-600" />
                <span>Voice Assistant</span>
                <Maximize2 className="h-3.5 w-3.5 ml-2" />
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
                  className="h-10 w-10 rounded-full bg-white shadow-md border-slate-200"
                  onClick={() => setIsOpen(true)}
                >
                  <Mic className="h-5 w-5 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Voice Assistant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}
    </div>
  );
};

export default GlobalVoiceInput;
