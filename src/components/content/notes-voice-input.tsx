'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceToText } from '@/components/voice-input/enhanced/voice-to-text';
import { KeyStage } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Notes Voice Input Component
 * 
 * This component integrates voice-to-text functionality into the note-taking workflow,
 * allowing students to dictate their notes instead of typing.
 */
export default function NotesVoiceInput({
  subjectId,
  subjectName,
  keyStage = 'ks3',
  initialNotes = '',
  onSave,
}: {
  subjectId: string;
  subjectName: string;
  keyStage?: KeyStage;
  initialNotes?: string;
  onSave?: (notes: string) => void;
}) {
  // State
  const [notes, setNotes] = useState<string>(initialNotes);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // Handle notes change
  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    setIsSaved(false);
  };
  
  // Handle save
  const handleSave = () => {
    setIsSaving(true);
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave(notes);
    }
    
    // Simulate saving to server
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      
      // Reset saved status after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{subjectName} Notes</CardTitle>
        <CardDescription>
          Use voice dictation to take notes for {subjectName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VoiceToText
          initialValue={notes}
          placeholder={`Click the microphone and start dictating your ${subjectName} notes...`}
          onChange={handleNotesChange}
          keyStage={keyStage}
          minRows={10}
          maxRows={20}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          {isSaved && (
            <span className="text-sm text-green-600">
              Notes saved successfully!
            </span>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !notes}
        >
          {isSaving ? 'Saving...' : 'Save Notes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
