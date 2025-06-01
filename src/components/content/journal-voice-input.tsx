'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceToText } from '@/components/voice-input/enhanced/voice-to-text';
import { KeyStage } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Journal Voice Input Component
 * 
 * This component integrates voice-to-text functionality into the journal entry workflow,
 * allowing students to dictate their reflections and thoughts instead of typing.
 */
export default function JournalVoiceInput({
  keyStage = 'ks3',
}: {
  keyStage?: KeyStage;
}) {
  // State
  const [entries, setEntries] = useState<Record<string, string>>({
    'today': '',
    'goals': '',
    'learning': '',
    'feelings': '',
    'questions': '',
  });
  
  // Handle save entry
  const handleSaveEntry = (type: string, content: string) => {
    setEntries(prev => ({
      ...prev,
      [type]: content,
    }));
    
    // In a real implementation, this would save to a database
    console.log(`Saving ${type} entry:`, content);
  };
  
  // Journal entry types
  const entryTypes = [
    { id: 'today', label: 'Today\'s Journal', placeholder: 'Dictate what happened today...' },
    { id: 'goals', label: 'Goals', placeholder: 'Dictate your goals...' },
    { id: 'learning', label: 'Learning Journal', placeholder: 'Dictate what you learned today...' },
    { id: 'feelings', label: 'Feelings', placeholder: 'Dictate how you feel...' },
    { id: 'questions', label: 'Questions', placeholder: 'Dictate any questions you have...' },
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Journal</CardTitle>
        <CardDescription>
          Use voice dictation to record your thoughts and reflections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="grid grid-cols-5 mb-4">
            {entryTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id}>{type.label}</TabsTrigger>
            ))}
          </TabsList>
          
          {entryTypes.map(type => (
            <TabsContent key={type.id} value={type.id}>
              <div className="space-y-4">
                <VoiceToText
                  initialValue={entries[type.id]}
                  placeholder={type.placeholder}
                  onChange={(content) => {
                    setEntries(prev => ({
                      ...prev,
                      [type.id]: content,
                    }));
                  }}
                  onSave={(content) => handleSaveEntry(type.id, content)}
                  keyStage={keyStage}
                  minRows={8}
                  maxRows={12}
                />
                
                {entries[type.id] && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                    <h3 className="text-sm font-medium mb-2">Saved Entry:</h3>
                    <p className="whitespace-pre-wrap">{entries[type.id]}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Your journal entries are private and can only be seen by you and your teachers.
        </p>
      </CardFooter>
    </Card>
  );
}
