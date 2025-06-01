'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceToText } from '@/components/voice-input/enhanced/voice-to-text';
import { KeyStage } from '@/components/voice-input/enhanced/age-appropriate-commands';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Content Creation Voice Input Component
 * 
 * This component integrates voice-to-text functionality into content creation areas,
 * allowing users to dictate content instead of typing.
 */
export default function ContentCreationVoiceInput() {
  // Content types
  const contentTypes = [
    { id: 'notes', label: 'Notes', placeholder: 'Dictate your notes here...' },
    { id: 'essay', label: 'Essay', placeholder: 'Dictate your essay here...' },
    { id: 'story', label: 'Story', placeholder: 'Dictate your story here...' },
    { id: 'report', label: 'Report', placeholder: 'Dictate your report here...' },
    { id: 'reflection', label: 'Reflection', placeholder: 'Dictate your reflection here...' },
  ];
  
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Content Creation with Voice Input</h1>
        
        <Tabs defaultValue="notes">
          <TabsList className="grid grid-cols-5 mb-4">
            {contentTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id}>{type.label}</TabsTrigger>
            ))}
          </TabsList>
          
          {contentTypes.map(type => (
            <TabsContent key={type.id} value={type.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{type.label}</CardTitle>
                  <CardDescription>
                    Create {type.label.toLowerCase()} using voice dictation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VoiceToText
                    placeholder={type.placeholder}
                    keyStage="ks3"
                    minRows={8}
                    maxRows={15}
                    onSave={(text) => {
                      // In a real implementation, this would save to a database
                      console.log(`Saving ${type.id}:`, text);
                      alert(`${type.label} saved successfully!`);
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Voice Dictation Tips</CardTitle>
              <CardDescription>
                How to get the best results when using voice input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Speak clearly and at a moderate pace</li>
                <li>Use punctuation commands like "full stop", "comma", and "new line"</li>
                <li>Pause briefly between sentences</li>
                <li>Review and edit the text after dictation</li>
                <li>Use a quiet environment for best recognition</li>
                <li>Position the microphone close to your mouth</li>
                <li>Speak in complete sentences</li>
                <li>Practice regularly to improve recognition accuracy</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Punctuation Commands</CardTitle>
              <CardDescription>
                Voice commands for adding punctuation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "full stop"</span>
                  <span className="text-gray-500 ml-2">for .</span>
                </div>
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "comma"</span>
                  <span className="text-gray-500 ml-2">for ,</span>
                </div>
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "question mark"</span>
                  <span className="text-gray-500 ml-2">for ?</span>
                </div>
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "exclamation mark"</span>
                  <span className="text-gray-500 ml-2">for !</span>
                </div>
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "new line"</span>
                  <span className="text-gray-500 ml-2">for line break</span>
                </div>
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "new paragraph"</span>
                  <span className="text-gray-500 ml-2">for paragraph break</span>
                </div>
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "open quote"</span>
                  <span className="text-gray-500 ml-2">for "</span>
                </div>
                <div className="p-2 border rounded">
                  <span className="font-medium">Say "close quote"</span>
                  <span className="text-gray-500 ml-2">for "</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
