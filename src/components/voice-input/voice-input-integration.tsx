'use client';

import React from 'react';
import { VoiceInputProvider } from '@/components/VoiceInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Voice Input Integration Component
 * 
 * This component wraps the application with the VoiceInputProvider
 * and provides a global voice control interface.
 */
export const VoiceInputIntegration: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [showControls, setShowControls] = React.useState(false);
  
  return (
    <VoiceInputProvider>
      <div className="relative">
        {children}
        
        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md border-grey-200"
              onClick={() => setShowControls(!showControls)}
            >
              <Mic className="h-5 w-5 text-blue-600" />
            </Button>
          </motion.div>
          
          {showControls && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-12 right-0 mb-2 w-80"
            >
              <VoiceControlPanel onClose={() => setShowControls(false)} />
            </motion.div>
          )}
        </div>
      </div>
    </VoiceInputProvider>
  );
};

/**
 * Voice Control Panel Component
 * 
 * Provides a floating control panel for voice input settings and controls.
 */
const VoiceControlPanel: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [activeTab, setActiveTab] = React.useState('controls');
  
  return (
    <Card className="shadow-lg border-grey-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-centre justify-between">
          <span className="flex items-centre gap-2">
            <Mic className="h-4 w-4 text-blue-600" />
            Voice Controls
          </span>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[180px]">
            <TabsList className="h-8 grid w-full grid-cols-2">
              <TabsTrigger value="controls" className="text-xs">Controls</TabsTrigger>
              <TabsTrigger value="help" className="text-xs">Help</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <TabsContent value="controls" className="mt-2 space-y-3">
          <VoiceControlsContent onClose={onClose} />
        </TabsContent>
        
        <TabsContent value="help" className="mt-2 space-y-3">
          <VoiceHelpContent />
        </TabsContent>
      </CardContent>
    </Card>
  );
};

/**
 * Voice Controls Content Component
 * 
 * Provides the main controls for the voice input feature.
 */
const VoiceControlsContent: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  // In a real implementation, this would use the useVoiceInput hook
  const isListening = false;
  const startListening = () => console.log('Start listening');
  const stopListening = () => console.log('Stop listening');
  
  return (
    <>
      <div className="flex justify-centre">
        {isListening ? (
          <Button 
            variant="destructive"
            size="sm"
            onClick={stopListening}
            className="flex items-centre gap-2"
          >
            <MicOff className="h-4 w-4" />
            Stop Voice Input
          </Button>
        ) : (
          <Button 
            variant="default"
            size="sm"
            onClick={startListening}
            className="flex items-centre gap-2"
          >
            <Mic className="h-4 w-4" />
            Start Voice Input
          </Button>
        )}
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-100 py-2">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-sm">Voice Input Ready</AlertTitle>
        <AlertDescription className="text-xs">
          Click the button above to start using voice input across the platform.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={onClose}
        >
          Close
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs flex items-centre gap-1"
        >
          <Settings className="h-3 w-3" />
          Settings
        </Button>
      </div>
    </>
  );
};

/**
 * Voice Help Content Component
 * 
 * Provides help and guidance for using voice input.
 */
const VoiceHelpContent: React.FC = () => {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Voice Input Help</h3>
        
        <div className="space-y-1 text-xs">
          <p className="font-medium">Getting Started:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Click the microphone button to start voice input</li>
            <li>Speak clearly at a normal pace</li>
            <li>Click the stop button when finished</li>
          </ul>
        </div>
        
        <div className="space-y-1 text-xs">
          <p className="font-medium">Tips for Best Results:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Use in a quiet environment when possible</li>
            <li>Speak directly toward your device's microphone</li>
            <li>Use short, clear phrases for commands</li>
            <li>Calibrate voice recognition in settings for better accuracy</li>
          </ul>
        </div>
        
        <div className="space-y-1 text-xs">
          <p className="font-medium">Troubleshooting:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>If voice input isn't working, check your microphone permissions</li>
            <li>Try refreshing the page if voice recognition stops responding</li>
            <li>Adjust sensitivity settings if recognition is too strict or lenient</li>
          </ul>
        </div>
      </div>
      
      <Alert variant="default" className="bg-amber-50 border-amber-100 py-2">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-sm">Need More Help?</AlertTitle>
        <AlertDescription className="text-xs">
          Visit the Accessibility section in Settings for more voice input options and tutorials.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default VoiceInputIntegration;
