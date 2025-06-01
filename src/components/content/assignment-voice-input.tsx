'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceToText } from '@/components/voice-input/enhanced/voice-to-text';
import { KeyStage } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Assignment Voice Input Component
 * 
 * This component integrates voice-to-text functionality into the assignment submission workflow,
 * allowing students to dictate their assignments instead of typing.
 */
export default function AssignmentVoiceInput({
  assignmentId,
  assignmentTitle,
  keyStage = 'ks3',
  initialContent = '',
  onSubmit,
}: {
  assignmentId: string;
  assignmentTitle: string;
  keyStage?: KeyStage;
  initialContent?: string;
  onSubmit?: (content: string) => void;
}) {
  // State
  const [content, setContent] = useState<string>(initialContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsSaved(false);
  };
  
  // Handle save
  const handleSave = () => {
    setIsSaving(true);
    
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
  
  // Handle submit
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(content);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{assignmentTitle}</CardTitle>
        <CardDescription>
          Use voice dictation to complete this assignment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VoiceToText
          initialValue={content}
          placeholder="Click the microphone and start dictating your assignment..."
          onChange={handleContentChange}
          keyStage={keyStage}
          minRows={10}
          maxRows={20}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          {isSaved && (
            <span className="text-sm text-green-600">
              Assignment saved successfully!
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || !content}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving || !content}
          >
            Submit Assignment
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
