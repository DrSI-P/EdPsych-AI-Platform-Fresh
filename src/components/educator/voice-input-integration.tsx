'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * VoiceInputIntegration Component
 * 
 * This component provides comprehensive voice input capabilities for the Educator Dashboard,
 * allowing educators who struggle with typing to control the platform using voice commands.
 * It includes voice command recognition, text-to-speech feedback, and command suggestions.
 */
export function VoiceInputIntegration() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
  const [commandHistory, setCommandHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock voice commands for demonstration
  const voiceCommands = {
    navigation: [
      { command: "Go to dashboard", description: "Navigate to the main dashboard" },
      { command: "Show students", description: "View student list" },
      { command: "Open analytics", description: "View analytics dashboard" },
      { command: "Show calendar", description: "View calendar and schedule" },
      { command: "Go to resources", description: "Access teaching resources" }
    ],
    actions: [
      { command: "Create new assignment", description: "Start assignment creation workflow" },
      { command: "Take attendance", description: "Open attendance taking interface" },
      { command: "Generate report for [student name]", description: "Create a report for specific student" },
      { command: "Schedule parent meeting", description: "Open meeting scheduler" },
      { command: "Send message to [class name]", description: "Compose message to a class" }
    ],
    data: [
      { command: "Show progress for [student name]", description: "View specific student's progress" },
      { command: "Compare class performance", description: "View comparative class analytics" },
      { command: "Show attendance trends", description: "View attendance analytics" },
      { command: "Summarize term results", description: "Generate term summary" },
      { command: "Identify at-risk students", description: "Show students needing intervention" }
    ],
    system: [
      { command: "Enable voice input", description: "Turn on voice recognition" },
      { command: "Disable voice input", description: "Turn off voice recognition" },
      { command: "Read aloud", description: "Read current page content" },
      { command: "Stop speaking", description: "Stop text-to-speech" },
      { command: "Help", description: "Show voice command help" }
    ]
  };
  
  // Simulate voice recognition start/stop
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate starting voice recognition
      setFeedback('Listening...');
      // In a real implementation, this would connect to the Web Speech API
    } else {
      // Simulate stopping voice recognition
      setFeedback('Voice recognition stopped');
    }
  };
  
  // Simulate processing a voice command
  const processCommand = (command) => {
    setTranscript(command);
    setCommandHistory(prev => [command, ...prev.slice(0, 4)]);
    
    // Simple command processing logic
    let response = '';
    if (command.toLowerCase().includes('dashboard')) {
      response = 'Navigating to dashboard';
    } else if (command.toLowerCase().includes('student')) {
      response = 'Showing student information';
    } else if (command.toLowerCase().includes('analytics')) {
      response = 'Opening analytics view';
    } else if (command.toLowerCase().includes('create') || command.toLowerCase().includes('new')) {
      response = 'Starting creation workflow';
    } else if (command.toLowerCase().includes('help')) {
      response = 'Showing voice command help';
    } else {
      response = 'Command not recognized. Please try again.';
    }
    
    setFeedback(response);
    if (textToSpeechEnabled) {
      speakFeedback(response);
    }
  };
  
  // Simulate text-to-speech
  const speakFeedback = (text) => {
    setIsSpeaking(true);
    // In a real implementation, this would use the Web Speech API
    setTimeout(() => {
      setIsSpeaking(false);
    }, 2000);
  };
  
  // Stop text-to-speech
  const stopSpeaking = () => {
    setIsSpeaking(false);
    // In a real implementation, this would cancel any ongoing speech
  };
  
  // Demo command execution
  const executeDemo = (command) => {
    processCommand(command);
  };
  
  // Filter commands by category
  const filteredCommands = selectedCategory === 'all' 
    ? [...voiceCommands.navigation, ...voiceCommands.actions, ...voiceCommands.data, ...voiceCommands.system]
    : voiceCommands[selectedCategory];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {isListening ? (
              <Mic className="h-5 w-5 mr-2 text-green-500 animate-pulse" />
            ) : (
              <MicOff className="h-5 w-5 mr-2 text-muted-foreground" />
            )}
            Voice Input Controls
          </CardTitle>
          <CardDescription>
            Control the dashboard using voice commands
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="voice-toggle" className="font-medium">Voice Input</Label>
              <p className="text-sm text-muted-foreground">Enable voice command recognition</p>
            </div>
            <Switch 
              id="voice-toggle" 
              checked={voiceEnabled} 
              onCheckedChange={setVoiceEnabled}
              aria-label="Toggle voice input"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="tts-toggle" className="font-medium">Text-to-Speech Feedback</Label>
              <p className="text-sm text-muted-foreground">Read responses aloud</p>
            </div>
            <Switch 
              id="tts-toggle" 
              checked={textToSpeechEnabled} 
              onCheckedChange={setTextToSpeechEnabled}
              aria-label="Toggle text-to-speech"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={toggleListening} 
              disabled={!voiceEnabled}
              className={`flex-1 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className="flex-1"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop Speaking
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Read Aloud
                </>
              )}
            </Button>
          </div>
          
          {transcript && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Last command:</p>
              <p className="text-base">{transcript}</p>
            </div>
          )}
          
          {feedback && (
            <Alert className={isSpeaking ? 'border-primary' : ''}>
              <AlertTitle className="flex items-center">
                {isSpeaking ? (
                  <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                ) : (
                  <HelpCircle className="h-4 w-4 mr-2" />
                )}
                System Response
              </AlertTitle>
              <AlertDescription>
                {feedback}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Voice Command Reference</CardTitle>
          <CardDescription>
            Available commands you can use with voice input
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCommands.map((cmd, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-start p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{cmd.command}</p>
                    <p className="text-sm text-muted-foreground">{cmd.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => executeDemo(cmd.command)}
                    aria-label={`Try ${cmd.command}`}
                  >
                    Try
                  </Button>
                </div>
              ))}
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <h4 className="text-sm font-medium mb-2">Recent Commands</h4>
          <div className="w-full space-y-2">
            {commandHistory.length > 0 ? (
              commandHistory.map((cmd, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-sm">{cmd}</p>
                  <Badge variant="outline" className="text-xs">
                    {new Date().toLocaleTimeString()}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No commands yet</p>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Voice Input Accessibility</CardTitle>
          <CardDescription>
            Tips for effective voice command usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Speaking Clearly</h3>
            <p className="text-sm text-muted-foreground">
              Speak at a moderate pace and articulate clearly. Pause briefly between commands.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Command Structure</h3>
            <p className="text-sm text-muted-foreground">
              Use simple, direct phrases. Start with verbs like "show," "open," "create," or "go to."
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Background Noise</h3>
            <p className="text-sm text-muted-foreground">
              Minimize background noise for optimal recognition. Use a headset in noisy environments.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Accessibility Support</h3>
            <p className="text-sm text-muted-foreground">
              Voice input is designed to support educators with mobility limitations, dyslexia, or other conditions that make typing difficult.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View Complete Voice Command Documentation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
