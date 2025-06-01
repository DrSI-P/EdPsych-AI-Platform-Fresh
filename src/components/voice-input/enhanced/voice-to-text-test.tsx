'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceToText } from './voice-to-text';
import { KeyStage } from './age-appropriate-commands';
import { AgeAppropriateCommandsProvider } from './age-appropriate-commands';

/**
 * Voice-to-Text Test Component
 * 
 * This component provides a testing interface for the voice-to-text functionality,
 * allowing developers to validate dictation capabilities across different key stages.
 */
export default function VoiceToTextTest() {
  // State
  const [savedTexts, setSavedTexts] = useState<Record<string, string>>({
    'early_years': '',
    'ks1': '',
    'ks2': '',
    'ks3': '',
    'ks4': '',
    'adult': '',
  });
  
  // Handle save
  const handleSave = (keyStage: KeyStage, text: string) => {
    setSavedTexts(prev => ({
      ...prev,
      [keyStage]: text,
    }));
  };
  
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Voice-to-Text Test Suite</h1>
        
        <Tabs defaultValue="early_years">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="early_years">Early Years</TabsTrigger>
            <TabsTrigger value="ks1">KS1</TabsTrigger>
            <TabsTrigger value="ks2">KS2</TabsTrigger>
            <TabsTrigger value="ks3">KS3</TabsTrigger>
            <TabsTrigger value="ks4">KS4</TabsTrigger>
            <TabsTrigger value="adult">Adult</TabsTrigger>
          </TabsList>
          
          {(['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'] as KeyStage[]).map((stage) => (
            <TabsContent key={stage} value={stage}>
              <Card>
                <CardHeader>
                  <CardTitle>{getKeyStageTitle(stage)} Voice-to-Text</CardTitle>
                  <CardDescription>
                    Test voice dictation with {getKeyStageTitle(stage)} speech patterns and vocabulary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VoiceToText
                    placeholder={`Click the microphone and start speaking with ${getKeyStageTitle(stage)} vocabulary...`}
                    keyStage={stage}
                    minRows={5}
                    maxRows={10}
                    onSave={(text) => handleSave(stage, text)}
                  />
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <h3 className="text-sm font-medium mb-2">Saved Text:</h3>
                    <div className="p-3 border rounded bg-gray-50 min-h-[100px]">
                      {savedTexts[stage] ? (
                        <p className="whitespace-pre-wrap">{savedTexts[stage]}</p>
                      ) : (
                        <p className="text-gray-400">No saved text yet</p>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Voice-to-Text Features</CardTitle>
            <CardDescription>
              Key features of the voice-to-text component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>UK accent recognition with children's speech pattern support</li>
              <li>Continuous dictation with real-time transcription</li>
              <li>Editing capabilities with voice and keyboard</li>
              <li>Punctuation commands (e.g., "full stop", "comma", "new line")</li>
              <li>Age-appropriate vocabulary and command recognition</li>
              <li>Browser compatibility with fallbacks</li>
              <li>Cursor position tracking for accurate text insertion</li>
              <li>Visual feedback during dictation</li>
              <li>Error handling and recovery</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>
              Follow these steps to test the voice-to-text functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select the appropriate key stage tab for testing</li>
              <li>Click the microphone button to start dictation</li>
              <li>Speak clearly, using vocabulary appropriate for the selected key stage</li>
              <li>Try using punctuation commands like "full stop", "comma", or "new line"</li>
              <li>Click the microphone button again to stop dictation</li>
              <li>Edit the text using the keyboard if needed</li>
              <li>Click the Save button to save the text</li>
              <li>Verify that the saved text appears correctly in the Saved Text section</li>
              <li>Test with different key stages to verify age-appropriate recognition</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AgeAppropriateCommandsProvider>
  );
}

// Helper function to get key stage title
function getKeyStageTitle(keyStage: KeyStage): string {
  switch (keyStage) {
    case 'early_years':
      return 'Early Years';
    case 'ks1':
      return 'Key Stage 1';
    case 'ks2':
      return 'Key Stage 2';
    case 'ks3':
      return 'Key Stage 3';
    case 'ks4':
      return 'Key Stage 4';
    case 'adult':
      return 'Adult';
    default:
      return keyStage;
  }
}
