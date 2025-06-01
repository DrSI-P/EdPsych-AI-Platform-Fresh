'use client';

import React from 'react';
import { useVoiceInput } from '@/providers/voice-input-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImmersiveVoiceInputProps {
  onCommand?: (command: string) => void;
  onTranscriptChange?: (transcript: string) => void;
  className?: string;
}

/**
 * Immersive Voice Input Component
 * 
 * Specialised voice input component for immersive learning environments,
 * optimised for navigation and interaction commands.
 */
export const ImmersiveVoiceInput: React.FC<ImmersiveVoiceInputProps> = ({
  onCommand,
  onTranscriptChange,
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
    ageGroup
  } = useVoiceInput();
  
  const [activeTab, setActiveTab] = React.useState<string>('commands');
  const [lastCommand, setLastCommand] = React.useState<string>('');
  
  // Process transcript for commands
  React.useEffect(() => {
    if (!transcript && !interimTranscript) return;
    
    const fullText = transcript + ' ' + interimTranscript;
    const lowerText = fullText.toLowerCase().trim();
    
    // Check for navigation commands
    if (lowerText.includes('move forward') || lowerText.includes('go forward')) {
      handleCommand('move_forward');
    } else if (lowerText.includes('move backward') || lowerText.includes('go backward') || lowerText.includes('go back')) {
      handleCommand('move_backward');
    } else if (lowerText.includes('turn left')) {
      handleCommand('turn_left');
    } else if (lowerText.includes('turn right')) {
      handleCommand('turn_right');
    } else if (lowerText.includes('look up')) {
      handleCommand('look_up');
    } else if (lowerText.includes('look down')) {
      handleCommand('look_down');
    } else if (lowerText.includes('stop') || lowerText.includes('halt')) {
      handleCommand('stop');
    }
    
    // Check for interaction commands
    if (lowerText.includes('select') || lowerText.includes('choose') || lowerText.includes('pick')) {
      handleCommand('select');
    } else if (lowerText.includes('open') || lowerText.includes('activate')) {
      handleCommand('open');
    } else if (lowerText.includes('close') || lowerText.includes('exit')) {
      handleCommand('close');
    } else if (lowerText.includes('help') || lowerText.includes('assistance')) {
      handleCommand('help');
    }
    
    // Update transcript
    if (onTranscriptChange) {
      onTranscriptChange(fullText);
    }
  }, [transcript, interimTranscript, onTranscriptChange]);
  
  // Handle command
  const handleCommand = (command: string) => {
    setLastCommand(command);
    
    if (onCommand) {
      onCommand(command);
    }
    
    // Clear transcript after processing command
    clearTranscript();
  };
  
  // Get age-appropriate command list
  const getCommandList = () => {
    switch (ageGroup) {
      case 'nursery':
      case 'early-primary':
        return [
          { command: 'Go forward', description: 'Move forward in the environment' },
          { command: 'Go back', description: 'Move backward in the environment' },
          { command: 'Turn left', description: 'Turn to the left' },
          { command: 'Turn right', description: 'Turn to the right' },
          { command: 'Stop', description: 'Stop moving' },
          { command: 'Select', description: 'Select or interact with an object' },
          { command: 'Help', description: 'Get help' },
        ];
      case 'late-primary':
        return [
          { command: 'Move forward', description: 'Move forward in the environment' },
          { command: 'Move backward', description: 'Move backward in the environment' },
          { command: 'Turn left', description: 'Turn to the left' },
          { command: 'Turn right', description: 'Turn to the right' },
          { command: 'Look up', description: 'Look upward' },
          { command: 'Look down', description: 'Look downward' },
          { command: 'Stop', description: 'Stop moving' },
          { command: 'Select', description: 'Select or interact with an object' },
          { command: 'Open', description: 'Open or activate something' },
          { command: 'Close', description: 'Close or exit something' },
          { command: 'Help', description: 'Get help' },
        ];
      case 'secondary':
        return [
          { command: 'Move forward', description: 'Move forward in the environment' },
          { command: 'Move backward', description: 'Move backward in the environment' },
          { command: 'Turn left', description: 'Turn to the left' },
          { command: 'Turn right', description: 'Turn to the right' },
          { command: 'Look up', description: 'Look upward' },
          { command: 'Look down', description: 'Look downward' },
          { command: 'Stop', description: 'Stop moving' },
          { command: 'Select [object]', description: 'Select or interact with a specific object' },
          { command: 'Open [object]', description: 'Open or activate a specific object' },
          { command: 'Close [object]', description: 'Close or exit a specific object' },
          { command: 'Examine [object]', description: 'Look closely at a specific object' },
          { command: 'Help', description: 'Get help' },
        ];
      default:
        return [
          { command: 'Move forward', description: 'Move forward in the environment' },
          { command: 'Move backward', description: 'Move backward in the environment' },
          { command: 'Turn left', description: 'Turn to the left' },
          { command: 'Turn right', description: 'Turn to the right' },
          { command: 'Stop', description: 'Stop moving' },
          { command: 'Select', description: 'Select or interact with an object' },
          { command: 'Help', description: 'Get help' },
        ];
    }
  };
  
  if (!isAvailable) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Voice Commands Not Available</AlertTitle>
        <AlertDescription>
          Voice commands are not supported in your browser. Please try using Chrome, Edge, or Safari.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-centre justify-between">
          <span className="flex items-centre gap-2">
            {isListening ? (
              <Mic className="h-5 w-5 text-green-500" />
            ) : (
              <MicOff className="h-5 w-5 text-grey-400" />
            )}
            Voice Commands
          </span>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="commands">Commands</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="commands" className="mt-0 space-y-4">
          <div className="flex justify-centre">
            {isListening ? (
              <Button 
                variant="destructive"
                onClick={stopListening}
                className="flex items-centre gap-2"
              >
                <MicOff className="h-4 w-4" />
                Stop Voice Commands
              </Button>
            ) : (
              <Button 
                variant="default"
                onClick={() => startListening({ continuous: true })}
                className="flex items-centre gap-2"
              >
                <Mic className="h-4 w-4" />
                Start Voice Commands
              </Button>
            )}
          </div>
          
          <div className="border rounded-md p-3">
            <h3 className="text-sm font-medium mb-2">Available Commands</h3>
            <ul className="space-y-1">
              {getCommandList().map((item, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="font-medium">{item.command}:</span>
                  <span className="text-grey-500">{item.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="status" className="mt-0">
          <div className="space-y-4">
            <div className="border rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Voice Status</h3>
              <div className="space-y-2">
                <div className="flex items-centre justify-between">
                  <span className="text-sm">Listening:</span>
                  <span className={`text-sm font-medium ${isListening ? 'text-green-500' : 'text-grey-500'}`}>
                    {isListening ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-centre justify-between">
                  <span className="text-sm">Last Command:</span>
                  <span className="text-sm font-medium">
                    {lastCommand ? lastCommand.replace('_', ' ') : 'None'}
                  </span>
                </div>
                <div className="flex items-centre justify-between">
                  <span className="text-sm">Mode:</span>
                  <span className="text-sm font-medium">
                    Immersive Navigation
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Current Transcript</h3>
              <div className="min-h-[60px] bg-grey-50 p-2 rounded text-sm">
                {transcript || interimTranscript ? (
                  <div>
                    <span>{transcript}</span>
                    <span className="text-grey-400">{interimTranscript}</span>
                  </div>
                ) : (
                  <p className="text-grey-400">No speech detected yet...</p>
                )}
              </div>
            </div>
            
            {isListening && (
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <AlertTitle>Voice Commands Active</AlertTitle>
                <AlertDescription>
                  Speak clearly to navigate and interact with the immersive environment.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default ImmersiveVoiceInput;
