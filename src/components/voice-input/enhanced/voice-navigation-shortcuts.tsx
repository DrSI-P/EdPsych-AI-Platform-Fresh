'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Settings } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createBrowserSpeechRecognition } from './browser-compatibility-layer';
import { useUKAccentRecognition } from './uk-accent-recognition';
import { useAgeAppropriateCommands, KeyStage } from './age-appropriate-commands';

// Define types
type VoiceNavigationShortcutsProps = {
  keyStage?: KeyStage;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'floating';
  showTooltips?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

// Position classes
const positionClasses = {
  'top-left': 'fixed top-4 left-4',
  'top-right': 'fixed top-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
  'bottom-right': 'fixed bottom-4 right-4',
  'floating': 'fixed bottom-20 right-4',
};

// Size classes
const sizeClasses = {
  'sm': 'h-8 w-8',
  'md': 'h-10 w-10',
  'lg': 'h-12 w-12',
};

/**
 * Voice Navigation Shortcuts Component
 * 
 * This component provides voice-controlled navigation shortcuts throughout the application,
 * allowing users to navigate the platform using voice commands.
 * 
 * Features:
 * - Quick access to voice navigation from any page
 * - Customizable position and appearance
 * - Age-appropriate command recognition
 * - Visual feedback during listening
 * - Settings for customization
 */
export default function VoiceNavigationShortcuts({
  keyStage = 'adult',
  className = '',
  position = 'floating',
  showTooltips = true,
  size = 'md',
}: VoiceNavigationShortcutsProps) {
  // Router and pathname
  const router = useRouter();
  const pathname = usePathname();
  
  // State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean>(true);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState<boolean>(true);
  const [showFeedback, setShowFeedback] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  
  // Recognition engine reference
  const recognitionRef = React.useRef<any>(null);
  
  // Use UK accent recognition
  const accentRecognition = useUKAccentRecognition({
    initialAccent: keyStage === 'early_years' || keyStage === 'ks1' ? 'uk_children' : 'uk_general',
    adaptiveMode: true,
    sensitivityLevel: 75,
  });
  
  // Use age-appropriate commands
  const { 
    findCommandByPhrase,
    getAvailableCommands,
  } = useAgeAppropriateCommands();
  
  // Initialize speech recognition
  useEffect(() => {
    // Create recognition instance with browser compatibility
    const recognition = createBrowserSpeechRecognition({
      continuous: false,
      interimResults: true,
      lang: accentRecognition.getLanguageCode(),
    });
    
    // Update support status
    setSupported(recognition.isSupported);
    
    // Set up event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setFeedbackMessage('Listening for navigation commands...');
      setFeedbackType('info');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
      setFeedbackMessage(`Error: ${event.error}`);
      setFeedbackType('error');
      
      // Hide feedback after 3 seconds
      setTimeout(() => {
        setFeedbackMessage('');
      }, 3000);
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      
      // Process the result with accent optimization
      const processedResult = accentRecognition.processRecognitionResult([{
        transcript: result[0].transcript,
        confidence: result[0].confidence
      }]);
      
      // Apply children's speech optimizations if needed
      const optimizedTranscript = accentRecognition.applyChildrenSpeechOptimizations(
        processedResult.transcript
      );
      
      setTranscript(optimizedTranscript);
      
      // Process navigation command if final result
      if (result.isFinal) {
        processNavigationCommand(optimizedTranscript);
      }
    };
    
    // Store recognition instance
    recognitionRef.current = recognition;
    
    // Cleanup
    return () => {
      if (recognitionRef.current?.isListening) {
        recognitionRef.current.abort();
      }
    };
  }, [accentRecognition, keyStage]);
  
  // Load settings from localStorage
  useEffect(() => {
    const storedEnabled = localStorage.getItem('voiceNavigationShortcutsEnabled');
    if (storedEnabled !== null) {
      setShortcutsEnabled(storedEnabled === 'true');
    }
    
    const storedShowFeedback = localStorage.getItem('voiceNavigationShowFeedback');
    if (storedShowFeedback !== null) {
      setShowFeedback(storedShowFeedback === 'true');
    }
  }, []);
  
  // Process navigation command
  const processNavigationCommand = (command: string) => {
    if (!command) return;
    
    const lowerCommand = command.toLowerCase().trim();
    
    // Check for direct navigation commands
    if (lowerCommand.startsWith('go to') || lowerCommand.startsWith('navigate to')) {
      const destination = lowerCommand.replace(/^(go to|navigate to)\s+/i, '').trim();
      handleDirectNavigation(destination);
      return;
    }
    
    // Check for registered commands
    const matchedCommand = findCommandByPhrase(lowerCommand);
    
    if (matchedCommand) {
      // Extract action type and target from action string
      const [actionType, actionTarget] = matchedCommand.action.split(':');
      
      if (actionType === 'navigate') {
        // Handle navigation action
        if (actionTarget === 'back') {
          router.back();
          showFeedbackMessage('Going back', 'success');
        } else {
          router.push(actionTarget);
          showFeedbackMessage(`Navigating to ${matchedCommand.description}`, 'success');
        }
      } else if (actionType === 'ui') {
        // Handle UI actions
        handleUIAction(actionTarget);
      } else {
        // Handle other action types
        showFeedbackMessage(`Command recognized: ${matchedCommand.description}`, 'success');
      }
      
      return;
    }
    
    // If no command matched
    showFeedbackMessage(`Command not recognized: ${command}`, 'error');
  };
  
  // Handle direct navigation
  const handleDirectNavigation = (destination: string) => {
    // Map common destinations to routes
    const routeMap: Record<string, string> = {
      'home': '/',
      'dashboard': '/dashboard',
      'profile': '/profile',
      'settings': '/settings',
      'help': '/help',
      'about': '/about',
      'contact': '/contact',
      'login': '/login',
      'register': '/register',
      'courses': '/courses',
      'lessons': '/lessons',
      'assessments': '/assessments',
      'resources': '/resources',
      'community': '/community',
      'forum': '/forum',
      'messages': '/messages',
      'notifications': '/notifications',
      'calendar': '/calendar',
      'timetable': '/timetable',
      'schedule': '/schedule',
      'progress': '/progress',
      'achievements': '/achievements',
      'badges': '/badges',
      'certificates': '/certificates',
      'reports': '/reports',
      'analytics': '/analytics',
      'students': '/students',
      'teachers': '/teachers',
      'parents': '/parents',
      'administrators': '/administrators',
      'curriculum': '/curriculum',
      'subjects': '/subjects',
      'topics': '/topics',
      'activities': '/activities',
      'games': '/games',
      'videos': '/videos',
      'audio': '/audio',
      'documents': '/documents',
      'worksheets': '/worksheets',
      'quizzes': '/quizzes',
      'tests': '/tests',
      'exams': '/exams',
      'projects': '/projects',
      'assignments': '/assignments',
      'feedback': '/feedback',
      'support': '/support',
      'faq': '/faq',
      'terms': '/terms',
      'privacy': '/privacy',
      'accessibility': '/accessibility',
      'content creation': '/content-creation',
      'voice test': '/voice-input-test',
      'voice to text test': '/voice-to-text-test',
      'content creation demo': '/content-creation-demo',
    };
    
    // Check if destination exists in route map
    if (routeMap[destination]) {
      router.push(routeMap[destination]);
      showFeedbackMessage(`Navigating to ${destination}`, 'success');
      return;
    }
    
    // If not found in map, try direct navigation
    try {
      const formattedPath = `/${destination.replace(/\s+/g, '-').toLowerCase()}`;
      router.push(formattedPath);
      showFeedbackMessage(`Navigating to ${destination}`, 'success');
    } catch (error) {
      console.error('Navigation error:', error);
      showFeedbackMessage(`Could not navigate to ${destination}`, 'error');
    }
  };
  
  // Handle UI actions
  const handleUIAction = (action: string) => {
    switch (action) {
      case 'showMenu':
        // In a real implementation, this would trigger the menu
        showFeedbackMessage('Showing menu', 'success');
        break;
      default:
        showFeedbackMessage(`UI action not implemented: ${action}`, 'error');
        break;
    }
  };
  
  // Show feedback message
  const showFeedbackMessage = (message: string, type: 'success' | 'error' | 'info') => {
    if (!showFeedback) return;
    
    setFeedbackMessage(message);
    setFeedbackType(type);
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setFeedbackMessage('');
    }, 3000);
  };
  
  // Start listening
  const startListening = () => {
    if (!recognitionRef.current || !supported || !shortcutsEnabled) return;
    
    recognitionRef.current.start();
    setTranscript('');
  };
  
  // Stop listening
  const stopListening = () => {
    if (!recognitionRef.current || !supported) return;
    
    recognitionRef.current.stop();
  };
  
  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Toggle shortcuts enabled
  const toggleShortcutsEnabled = () => {
    const newValue = !shortcutsEnabled;
    setShortcutsEnabled(newValue);
    localStorage.setItem('voiceNavigationShortcutsEnabled', newValue.toString());
    
    if (!newValue && isListening) {
      stopListening();
    }
  };
  
  // Toggle show feedback
  const toggleShowFeedback = () => {
    const newValue = !showFeedback;
    setShowFeedback(newValue);
    localStorage.setItem('voiceNavigationShowFeedback', newValue.toString());
  };
  
  // If not supported, don't render
  if (!supported) {
    return null;
  }
  
  // Render the voice navigation shortcuts component
  return (
    <>
      <div className={`${positionClasses[position]} z-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  onClick={toggleListening}
                  disabled={!shortcutsEnabled}
                  className={`${sizeClasses[size]} ${isListening ? 'bg-red-500 hover:bg-red-600' : ''} ${!shortcutsEnabled ? 'opacity-50' : ''}`}
                >
                  {isListening ? (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              {showTooltips && (
                <TooltipContent>
                  <p>{isListening ? 'Stop voice navigation' : 'Start voice navigation'}</p>
                  {!shortcutsEnabled && <p>Voice navigation is disabled</p>}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className={sizeClasses[size === 'lg' ? 'md' : 'sm']}>
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Voice Navigation Settings</DialogTitle>
                <DialogDescription>
                  Customize your voice navigation experience
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="shortcuts-enabled">Enable Voice Navigation</Label>
                  <Switch
                    id="shortcuts-enabled"
                    checked={shortcutsEnabled}
                    onCheckedChange={toggleShortcutsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-feedback">Show Voice Feedback</Label>
                  <Switch
                    id="show-feedback"
                    checked={showFeedback}
                    onCheckedChange={toggleShowFeedback}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setSettingsOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Feedback message */}
      {feedbackMessage && showFeedback && (
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md z-50 ${
          feedbackType === 'success' ? 'bg-green-500 text-white' :
          feedbackType === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {feedbackMessage}
        </div>
      )}
    </>
  );
}
