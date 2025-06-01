'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Settings,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

// Client component that uses useSearchParams
function SpeechRecognitionClient() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [activeTab, setActiveTab] = useState('voice-commands');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  
  const recognitionRef = useRef<any>(null);
  
  // Use useSearchParams inside useEffect to avoid direct rendering issues
  useEffect(() => {
    // Get redirect URL from query params if available
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      if (redirect) {
        setRedirectUrl(redirect);
      }
    }
    
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-GB'; // Set to UK English
        
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          const confidence = event.results[current][0].confidence;
          
          setTranscript(transcript);
          setConfidence(confidence);
          
          // If it's a final result, add to command history
          if (event.results[current].isFinal) {
            setCommandHistory(prev => [transcript, ...prev].slice(0, 5));
            
            // Process commands (simplified example)
            processCommand(transcript);
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setErrorMessage(`Error: ${event.error}. Please try again.`);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current.start();
          }
        };
      } else {
        setIsSpeechSupported(false);
        setErrorMessage('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      }
      
      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          setAvailableVoices(voices);
          
          // Try to find a UK English voice
          const ukVoice = voices.find(voice => voice.lang.includes('en-GB'));
          if (ukVoice) {
            setSelectedVoice(ukVoice);
          } else if (voices.length > 0) {
            setSelectedVoice(voices[0]);
          }
        };
        
        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        
        loadVoices();
      }
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isListening]);
  
  // Toggle listening state
  const toggleListening = () => {
    if (!isSpeechSupported) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setErrorMessage('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  // Process voice commands (simplified example)
  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Navigation commands
    if (lowerCommand.includes('go to dashboard') || lowerCommand.includes('open dashboard')) {
      speakResponse('Navigating to dashboard');
      setTimeout(() => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          window.location.href = '/student/dashboard';
        }
      }, 1500);
    } 
    else if (lowerCommand.includes('go back') || lowerCommand.includes('previous page')) {
      speakResponse('Going back to previous page');
      setTimeout(() => {
        window.history.back();
      }, 1500);
    }
    else if (lowerCommand.includes('learning path') || lowerCommand.includes('open learning path')) {
      speakResponse('Opening learning path');
      setTimeout(() => {
        window.location.href = '/student/learning-path';
      }, 1500);
    }
    else if (lowerCommand.includes('resources') || lowerCommand.includes('show resources')) {
      speakResponse('Showing your resources');
      setTimeout(() => {
        window.location.href = '/student/resources';
      }, 1500);
    }
    // Help command
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can i say')) {
      speakResponse('Here are some commands you can use. Try saying: go to dashboard, open learning path, or show my resources.');
    }
    // Educator-specific commands
    else if (lowerCommand.includes('class progress') || lowerCommand.includes('show class progress')) {
      speakResponse('Showing class progress data');
      setTimeout(() => {
        window.location.href = '/educator/data-visualisation';
      }, 1500);
    }
    else if (lowerCommand.includes('generate report')) {
      speakResponse('Opening report generation tool');
      setTimeout(() => {
        window.location.href = '/educator/administrative-automation';
      }, 1500);
    }
    else if (lowerCommand.includes('parent') || lowerCommand.includes('communication')) {
      speakResponse('Opening parent communication tools');
      setTimeout(() => {
        window.location.href = '/educator/parent-communication';
      }, 1500);
    }
    // Default response
    else {
      speakResponse('I didn\'t understand that command. Please try again or say "help" for assistance.');
    }
  };
  
  // Text-to-speech function
  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Test text-to-speech with current settings
  const testVoice = () => {
    speakResponse('This is a test of the voice settings for EdPsych Connect. You can adjust the voice, volume, rate, and pitch to suit your preferences.');
  };
  
  // Common voice commands for different sections
  const commonCommands = [
    { command: "Go to dashboard", action: "Navigates to the dashboard" },
    { command: "Open learning path", action: "Opens the learning path page" },
    { command: "Show my resources", action: "Displays your learning resources" },
    { command: "Help", action: "Opens the help documentation" },
    { command: "Go back", action: "Returns to the previous page" }
  ];
  
  const studentCommands = [
    { command: "Show my progress", action: "Displays your learning progress" },
    { command: "Start next lesson", action: "Begins your next scheduled lesson" },
    { command: "Show achievements", action: "Displays your earned achievements" },
    { command: "Find resources for [subject]", action: "Searches for resources in a specific subject" },
    { command: "Read this page", action: "Reads the current page content aloud" }
  ];
  
  const educatorCommands = [
    { command: "Show class progress", action: "Displays progress for your class" },
    { command: "Generate report for [student]", action: "Creates a report for a specific student" },
    { command: "Schedule message to parents", action: "Opens the parent communication scheduler" },
    { command: "Create lesson plan", action: "Opens the lesson planning assistant" },
    { command: "Mark assignments", action: "Opens the marking assistant" }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Voice Input & Accessibility</h1>
        <p className="text-muted-foreground text-lg">
          Use voice commands to navigate and control the EdPsych Connect platform.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Voice Recognition Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-primary" />
                  Voice Recognition
                </CardTitle>
                <CardDescription className="card-description">
                  Speak commands to control the platform hands-free
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                {isSpeechSupported ? (
                  <div className="space-y-6">
                    {/* Microphone Button */}
                    <div className="flex justify-center">
                      <Button 
                        onClick={toggleListening}
                        size="lg"
                        className={`btn btn-lg rounded-full h-24 w-24 flex items-center justify-center ${
                          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                        }`}
                      >
                        {isListening ? (
                          <MicOff className="h-10 w-10" />
                        ) : (
                          <Mic className="h-10 w-10" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Status and Transcript */}
                    <div className="text-center">
                      <div className="text-lg font-medium mb-2">
                        {isListening ? 'Listening...' : 'Click the microphone to start'}
                      </div>
                      
                      {isListening && (
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="relative h-2 w-2">
                            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>
                            <div className="absolute inset-0 rounded-full bg-red-500"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">Recording</span>
                        </div>
                      )}
                      
                      {transcript && (
                        <div className="mt-4">
                          <div className="font-medium text-sm mb-1">I heard:</div>
                          <div className="bg-muted/30 p-4 rounded-lg text-lg">
                            "{transcript}"
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Confidence: {Math.round(confidence * 100)}%
                          </div>
                        </div>
                      )}
                      
                      {errorMessage && (
                        <div className="mt-4 text-red-500">
                          {errorMessage}
                        </div>
                      )}
                    </div>
                    
                    {/* Command History */}
                    {commandHistory.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recent Commands:</h3>
                        <div className="space-y-2">
                          {commandHistory.map((command, index) => (
                            <div key={index} className="bg-muted/20 p-2 rounded text-sm">
                              "{command}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Try Saying Suggestions */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Try saying:</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="badge bg-primary/10 text-primary">
                          "Go to dashboard"
                        </Badge>
                        <Badge className="badge bg-primary/10 text-primary">
                          "Open learning path"
                        </Badge>
                        <Badge className="badge bg-primary/10 text-primary">
                          "Show my resources"
                        </Badge>
                        <Badge className="badge bg-primary/10 text-primary">
                          "Help"
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Speech Recognition Not Supported</h3>
                    <p className="text-muted-foreground mb-4">
                      Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari for the best experience.
                    </p>
                    <Button className="btn btn-primary" asChild>
                      <Link href={redirectUrl || '/'}>
                        Return to Previous Page
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Voice Commands Reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Voice Commands Reference
                </CardTitle>
                <CardDescription className="card-description">
                  Available voice commands for different user roles
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <Tabs defaultValue="voice-commands" onValueChange={setActiveTab}>
                  <TabsList className="tabs-list mb-6">
                    <TabsTrigger value="voice-commands" className="tab">Common Commands</TabsTrigger>
                    <TabsTrigger value="student-commands" className="tab">Student Commands</TabsTrigger>
                    <TabsTrigger value="educator-commands" className="tab">Educator Commands</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="voice-commands" className="tab-content">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4">Command</th>
                            <th className="text-left py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commonCommands.map((cmd, index) => (
                            <tr key={index} className="border-b border-border">
                              <td className="py-3 px-4 font-medium">"{cmd.command}"</td>
                              <td className="py-3 px-4">{cmd.action}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="student-commands" className="tab-content">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4">Command</th>
                            <th className="text-left py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentCommands.map((cmd, index) => (
                            <tr key={index} className="border-b border-border">
                              <td className="py-3 px-4 font-medium">"{cmd.command}"</td>
                              <td className="py-3 px-4">{cmd.action}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="educator-commands" className="tab-content">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4">Command</th>
                            <th className="text-left py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {educatorCommands.map((cmd, index) => (
                            <tr key={index} className="border-b border-border">
                              <td className="py-3 px-4 font-medium">"{cmd.command}"</td>
                              <td className="py-3 px-4">{cmd.action}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="space-y-8">
          {/* Voice Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Voice Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                <div className="space-y-4">
                  {/* Voice Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Voice</label>
                    <select 
                      className="select select-bordered w-full"
                      value={selectedVoice?.voiceURI || ''}
                      onChange={(e) => {
                        const voice = availableVoices.find(v => v.voiceURI === e.target.value);
                        if (voice) setSelectedVoice(voice);
                      }}
                    >
                      {availableVoices.map((voice, index) => (
                        <option key={index} value={voice.voiceURI}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Volume */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {/* Rate */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rate: {rate}x
                    </label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Pitch */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pitch: {pitch}
                    </label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Test Voice Button */}
                  <Button 
                    onClick={testVoice} 
                    className="w-full btn btn-primary"
                    disabled={isSpeaking}
                  >
                    {isSpeaking ? 'Speaking...' : 'Test Voice'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Accessibility Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Accessibility Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="card-body">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Speak Clearly</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Speak at a normal pace and volume, enunciating words clearly.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Use Simple Commands</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Start with the commands listed in the reference section for best results.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Quiet Environment</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use in a quiet environment for better recognition accuracy.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Allow Microphone Access</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ensure your browser has permission to access your microphone.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* UK Accessibility Standards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="card card-bordered hover:shadow-md transition-shadow">
              <CardContent className="card-body p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">UK Accessibility Compliance</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      This feature complies with UK accessibility standards including WCAG 2.1 AA and the Public Sector Bodies Accessibility Regulations 2018.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Voice Input Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="card card-bordered bg-primary/5 hover:shadow-md transition-shadow">
          <CardHeader className="card-header">
            <CardTitle className="card-title flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              Benefits of Voice Input
            </CardTitle>
            <CardDescription className="card-description">
              How voice input enhances accessibility and learning
            </CardDescription>
          </CardHeader>
          <CardContent className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background rounded-lg p-4 border border-border">
                <h3 className="font-medium text-lg mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  Voice input provides essential access for users with motor disabilities, dyslexia, or visual impairments, allowing hands-free navigation and control.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <h3 className="font-medium text-lg mb-2">Efficiency</h3>
                <p className="text-muted-foreground">
                  Speaking commands can be faster than typing or navigating with a mouse, especially for complex tasks or when multitasking.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <h3 className="font-medium text-lg mb-2">Learning Support</h3>
                <p className="text-muted-foreground">
                  Voice input helps students who struggle with typing, allowing them to focus on content rather than input methods, improving engagement and outcomes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href={redirectUrl || '/'}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <Button variant="outline" className="btn btn-outline" asChild>
          <Link href="/accessibility">
            Accessibility Features <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SpeechRecognitionPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading Voice Recognition...</h2>
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1 max-w-md">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SpeechRecognitionClient />
    </Suspense>
  );
}
