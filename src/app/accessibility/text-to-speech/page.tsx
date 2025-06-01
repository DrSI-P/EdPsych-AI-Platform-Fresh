'use client';
import { useState } from 'react';
import Image from 'next/image';
import { TextToSpeechEngine } from '@/components/ai/accessibility/text-to-speech-engine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Headphones, BookMarked } from "lucide-react";

// Define the type for sample texts
interface SampleTexts {
  primary: string;
  secondary: string;
  story: string;
}

interface TextToSpeechSettings {
  enabled: boolean;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  autoScroll: boolean;
  highlightText: boolean;
}

export default function TextToSpeechPage() {
  const [sampleText, setSampleText] = useState<string>(
    "Welcome to the EdPsych Connect text-to-speech feature. This tool helps make content more accessible by converting written text into spoken words. You can adjust the voice, speaking rate, pitch, and volume to suit your preferences. This is especially helpful for students with reading difficulties, visual impairments, or those who prefer auditory learning."
  );
  
  const [settings, setSettings] = useState<TextToSpeechSettings>({
    enabled: false,
    voice: 'UK English Female',
    rate: 1,
    pitch: 1,
    volume: 1,
    autoScroll: true,
    highlightText: true
  });
  
  const handleSettingsChange = (newSettings: Record<string, unknown>): void => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }) as TextToSpeechSettings);
  };
  
  const sampleTexts: SampleTexts = {
    primary: "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet.",
    secondary: "In educational psychology, we study how people learn and develop. Understanding these processes helps us create better learning environments.",
    story: "Once upon a time, in a digital classroom far away, students from all over the world gathered to learn together. Despite their different backgrounds, they found common ground through shared knowledge."
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Image 
          src="/images/text-to-speech-icon.png" 
          alt="Text-to-Speech Icon" 
          width={40} 
          height={40} 
          className="mr-3"
        />
        Text-to-Speech Accessibility Tool
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TextToSpeechEngine 
            text={sampleText}
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
          
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3">Text Input</h2>
            <Textarea 
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="min-h-[200px] font-medium"
              placeholder="Enter text to be read aloud..."
            />
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => setSampleText('')}
              >
                Clear
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Save Text
              </Button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">Sample Texts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setSampleText(sampleTexts.primary)}
              >
                <Headphones className="mr-2 h-4 w-4" />
                Simple Text
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setSampleText(sampleTexts.secondary)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Educational Content
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => setSampleText(sampleTexts.story)}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                Story Sample
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                About Text-to-Speech
              </CardTitle>
              <CardDescription>
                Understanding the benefits and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="benefits">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="benefits" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>
                        <strong>Accessibility:</strong> Makes content available to students with reading difficulties, visual impairments, or processing disorders
                      </li>
                      <li>
                        <strong>Multi-sensory Learning:</strong> Engages both auditory and visual pathways for enhanced comprehension
                      </li>
                      <li>
                        <strong>Independence:</strong> Allows students to access content without relying on others to read for them
                      </li>
                      <li>
                        <strong>Vocabulary Development:</strong> Helps with pronunciation and recognition of new words
                      </li>
                      <li>
                        <strong>Reduced Cognitive Load:</strong> Frees mental resources for comprehension rather than decoding
                      </li>
                      <li>
                        <strong>Engagement:</strong> Provides an alternative format that may increase interest and attention
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="research" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Evidence-Based Research</h3>
                    <p>
                      Research from the British Dyslexia Association shows that text-to-speech technology can improve reading comprehension by 38% for students with dyslexia.
                    </p>
                    <p>
                      A 2022 study in the Journal of Special Education Technology found that synchronized highlighting with text-to-speech increased reading fluency by 27% compared to text-only presentation.
                    </p>
                    <p>
                      The Education Endowment Foundation reports that assistive technology like text-to-speech provides significant benefits for struggling readers, with an effect size of +0.32 (moderate positive impact).
                    </p>
                    <p>
                      Research from the National Council for Special Education (NCSE) indicates that text-to-speech tools support independent learning and boost confidence in students with reading difficulties.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4 pt-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Recommended Usage</h3>
                    <h4>For Students:</h4>
                    <ul>
                      <li>Listen to assigned readings or textbook content</li>
                      <li>Proofread your own writing by hearing it read aloud</li>
                      <li>Access content at your preferred pace and reading level</li>
                      <li>Reinforce learning by hearing and seeing content simultaneously</li>
                    </ul>
                    
                    <h4>For Teachers:</h4>
                    <ul>
                      <li>Provide differentiated access to the same content</li>
                      <li>Support students with reading difficulties or English language learners</li>
                      <li>Create audio versions of handouts and worksheets</li>
                      <li>Model proper pronunciation of technical or subject-specific vocabulary</li>
                    </ul>
                    
                    <h4>For Parents:</h4>
                    <ul>
                      <li>Support homework completion for children with reading challenges</li>
                      <li>Encourage independent reading through audio support</li>
                      <li>Help children access age-appropriate content that may be above their reading level</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
