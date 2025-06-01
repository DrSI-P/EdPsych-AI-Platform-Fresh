'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TranscriptionTranslationSystem from '@/components/student-voice/transcription-translation-system';
import AnonymousSuggestionSystem from '@/components/student-voice/anonymous-suggestion-system';

export default function StudentVoiceClient() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Student Voice Amplification System</h1>
        <p className="text-xl text-muted-foreground">
          Tools to collect, amplify, and respond to student perspectives
        </p>
      </div>
      
      <Tabs defaultValue="transcription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="transcription">Transcription & Translation</TabsTrigger>
          <TabsTrigger value="suggestions">Anonymous Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcription">
          <TranscriptionTranslationSystem />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <AnonymousSuggestionSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}