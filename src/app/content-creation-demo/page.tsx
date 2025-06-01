'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceToText } from '@/components/voice-input/enhanced/voice-to-text';
import { KeyStage } from '@/components/voice-input/enhanced/age-appropriate-commands';
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands';

/**
 * Content Creation Demo Page
 * 
 * This page demonstrates all voice-to-text content creation components in one place,
 * allowing for easy testing and validation of the functionality.
 */
export default function ContentCreationDemo() {
  // State for demo data
  const [savedContent, setSavedContent] = useState<Record<string, string>>({});
  
  // Handle save content
  const handleSaveContent = (id: string, content: string) => {
    setSavedContent(prev => ({
      ...prev,
      [id]: content,
    }));
    
    // In a real implementation, this would save to a database
    console.log(`Saving ${id}:`, content);
  };
  
  return (
    <AgeAppropriateCommandsProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Voice-to-Text Content Creation Demo</h1>
        <p className="text-gray-600 mb-6">
          This demo showcases all voice-to-text content creation components integrated into the platform.
          These components enable students who struggle with typing to create content using voice dictation.
        </p>
        
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">General Content</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Content Creation</CardTitle>
                <CardDescription>
                  Create various types of content using voice dictation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <iframe 
                  src="/content-creation" 
                  className="w-full h-[600px] border rounded"
                  title="Content Creation"
                ></iframe>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  This component allows users to create different types of content using voice dictation,
                  including notes, essays, stories, reports, and reflections.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Submission</CardTitle>
                <CardDescription>
                  Complete assignments using voice dictation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['ks2', 'ks3', 'ks4'].map((stage) => (
                    <div key={stage} className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-4">
                        {stage === 'ks2' ? 'Key Stage 2' : stage === 'ks3' ? 'Key Stage 3' : 'Key Stage 4'} Assignment
                      </h3>
                      <div className="mb-4">
                        <VoiceToText
                          placeholder={`Dictate your ${stage === 'ks2' ? 'Key Stage 2' : stage === 'ks3' ? 'Key Stage 3' : 'Key Stage 4'} assignment...`}
                          keyStage={stage as KeyStage}
                          minRows={5}
                          maxRows={8}
                          onSave={(content) => handleSaveContent(`assignment-${stage}`, content)}
                        />
                      </div>
                      {savedContent[`assignment-${stage}`] && (
                        <div className="p-3 bg-gray-50 rounded border">
                          <h4 className="text-sm font-medium mb-1">Saved Assignment:</h4>
                          <p className="text-sm whitespace-pre-wrap">{savedContent[`assignment-${stage}`]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  This component allows students to complete assignments using voice dictation,
                  with age-appropriate vocabulary recognition for different key stages.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal">
            <Card>
              <CardHeader>
                <CardTitle>Journal Entries</CardTitle>
                <CardDescription>
                  Record journal entries using voice dictation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">My Journal</h3>
                    <div className="mb-4">
                      <Tabs defaultValue="today">
                        <TabsList className="grid grid-cols-3 mb-4">
                          <TabsTrigger value="today">Today's Journal</TabsTrigger>
                          <TabsTrigger value="learning">Learning Journal</TabsTrigger>
                          <TabsTrigger value="feelings">Feelings</TabsTrigger>
                        </TabsList>
                        
                        {['today', 'learning', 'feelings'].map((type) => (
                          <TabsContent key={type} value={type}>
                            <VoiceToText
                              placeholder={`Dictate your ${type === 'today' ? 'daily' : type} journal entry...`}
                              keyStage="ks3"
                              minRows={5}
                              maxRows={8}
                              onSave={(content) => handleSaveContent(`journal-${type}`, content)}
                            />
                            
                            {savedContent[`journal-${type}`] && (
                              <div className="mt-4 p-3 bg-gray-50 rounded border">
                                <h4 className="text-sm font-medium mb-1">Saved Entry:</h4>
                                <p className="text-sm whitespace-pre-wrap">{savedContent[`journal-${type}`]}</p>
                              </div>
                            )}
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  This component allows students to record journal entries using voice dictation,
                  helping them express their thoughts and reflections more easily.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Subject Notes</CardTitle>
                <CardDescription>
                  Take notes for different subjects using voice dictation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { id: 'maths', name: 'Mathematics' },
                    { id: 'science', name: 'Science' },
                    { id: 'english', name: 'English' }
                  ].map((subject) => (
                    <div key={subject.id} className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-4">{subject.name} Notes</h3>
                      <div className="mb-4">
                        <VoiceToText
                          placeholder={`Dictate your ${subject.name} notes...`}
                          keyStage="ks3"
                          minRows={5}
                          maxRows={8}
                          onSave={(content) => handleSaveContent(`notes-${subject.id}`, content)}
                        />
                      </div>
                      {savedContent[`notes-${subject.id}`] && (
                        <div className="p-3 bg-gray-50 rounded border">
                          <h4 className="text-sm font-medium mb-1">Saved Notes:</h4>
                          <p className="text-sm whitespace-pre-wrap">{savedContent[`notes-${subject.id}`]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  This component allows students to take notes for different subjects using voice dictation,
                  making note-taking more accessible for those who struggle with typing.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Voice-to-Text Integration Summary</CardTitle>
            <CardDescription>
              Overview of voice-to-text functionality in content creation areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The voice-to-text functionality has been successfully integrated into the following content creation areas:
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>General Content Creation:</strong> Notes, essays, stories, reports, and reflections
                </li>
                <li>
                  <strong>Assignment Submission:</strong> Age-appropriate dictation for different key stages
                </li>
                <li>
                  <strong>Journal Entries:</strong> Daily journals, learning journals, and emotional reflections
                </li>
                <li>
                  <strong>Subject Notes:</strong> Subject-specific note-taking with specialized vocabulary
                </li>
              </ul>
              
              <p>
                All components feature:
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>UK accent recognition with children's speech pattern support</li>
                <li>Punctuation commands for proper formatting</li>
                <li>Age-appropriate vocabulary recognition</li>
                <li>Real-time transcription with editing capabilities</li>
                <li>Saving and retrieval of dictated content</li>
                <li>Accessibility features for children with special needs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
