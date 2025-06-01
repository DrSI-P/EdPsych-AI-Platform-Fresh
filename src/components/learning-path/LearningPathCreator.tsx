"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { 
  KeyStage, 
  Subject, 
  PathGenerationParams,
  LearningPath
} from '@/lib/learning-path/types';
import { 
  fetchUserLearningProfile, 
  fetchCurriculumTopics,
  createPersonalizedLearningPath
} from '@/lib/learning-path/api';

interface LearningPathCreatorProps {
  userId: string;
}

export function LearningPathCreator({ userId }: LearningPathCreatorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [subject, setSubject] = useState<Subject | ''>('');
  const [keyStage, setKeyStage] = useState<KeyStage | ''>('');
  const [difficulty, setDifficulty] = useState<number>(5);
  const [includePrerequisites, setIncludePrerequisites] = useState(true);
  const [adaptToLearningStyle, setAdaptToLearningStyle] = useState(true);
  const [adaptToInterests, setAdaptToInterests] = useState(true);
  
  // Available topics state
  const [availableTopics, setAvailableTopics] = useState<Array<{id: string, name: string}>>([]);
  const [focusTopics, setFocusTopics] = useState<string[]>([]);
  const [excludeTopics, setExcludeTopics] = useState<string[]>([]);
  
  // Load topics when subject and key stage are selected
  useEffect(() => {
    if (subject && keyStage) {
      loadTopics();
    } else {
      setAvailableTopics([]);
    }
  }, [subject, keyStage]);
  
  const loadTopics = async () => {
    try {
      setIsLoading(true);
      const topics = await fetchCurriculumTopics(subject as string, keyStage as KeyStage);
      setAvailableTopics(topics.map(topic => ({ id: topic.id, name: topic.name })));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading topics:', error);
      setError('Failed to load curriculum topics. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleTopicSelection = (topicId: string, isFocus: boolean) => {
    if (isFocus) {
      // Add/remove from focus topics
      if (focusTopics.includes(topicId)) {
        setFocusTopics(focusTopics.filter(id => id !== topicId));
      } else {
        setFocusTopics([...focusTopics, topicId]);
        // Remove from exclude topics if present
        if (excludeTopics.includes(topicId)) {
          setExcludeTopics(excludeTopics.filter(id => id !== topicId));
        }
      }
    } else {
      // Add/remove from exclude topics
      if (excludeTopics.includes(topicId)) {
        setExcludeTopics(excludeTopics.filter(id => id !== topicId));
      } else {
        setExcludeTopics([...excludeTopics, topicId]);
        // Remove from focus topics if present
        if (focusTopics.includes(topicId)) {
          setFocusTopics(focusTopics.filter(id => id !== topicId));
        }
      }
    }
  };
  
  const handleCreatePath = async () => {
    if (!subject || !keyStage) {
      setError('Please select a subject and key stage.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Create path generation parameters
      const params: PathGenerationParams = {
        userId,
        subjectId: subject as string,
        keyStage: keyStage as KeyStage,
        includePrerequisites,
        adaptToLearningStyle,
        adaptToInterests,
        difficulty,
        focusTopics: focusTopics.length > 0 ? focusTopics : undefined,
        excludeTopics: excludeTopics.length > 0 ? excludeTopics : undefined
      };
      
      // Create the learning path
      const path = await createPersonalizedLearningPath(userId, subject as string, keyStage as KeyStage);
      
      setSuccess('Learning path created successfully!');
      setIsLoading(false);
      
      // Navigate to the new path
      setTimeout(() => {
        router.push(`/learning-path/${path.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating learning path:', error);
      setError('Failed to create learning path. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Personalized Learning Path</CardTitle>
        <CardDescription>
          Customize your learning journey based on your preferences and goals
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="topics">Topic Selection</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={subject}
                  onValueChange={(value) => setSubject(value as Subject)}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Subject.MATHS}>Mathematics</SelectItem>
                    <SelectItem value={Subject.ENGLISH}>English</SelectItem>
                    <SelectItem value={Subject.SCIENCE}>Science</SelectItem>
                    <SelectItem value={Subject.HISTORY}>History</SelectItem>
                    <SelectItem value={Subject.GEOGRAPHY}>Geography</SelectItem>
                    <SelectItem value={Subject.ART}>Art</SelectItem>
                    <SelectItem value={Subject.MUSIC}>Music</SelectItem>
                    <SelectItem value={Subject.PE}>Physical Education</SelectItem>
                    <SelectItem value={Subject.COMPUTING}>Computing</SelectItem>
                    <SelectItem value={Subject.LANGUAGES}>Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keyStage">Key Stage</Label>
                <Select
                  value={keyStage}
                  onValueChange={(value) => setKeyStage(value as KeyStage)}
                >
                  <SelectTrigger id="keyStage">
                    <SelectValue placeholder="Select a key stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={KeyStage.NURSERY}>Nursery</SelectItem>
                    <SelectItem value={KeyStage.RECEPTION}>Reception</SelectItem>
                    <SelectItem value={KeyStage.KS1}>Key Stage 1</SelectItem>
                    <SelectItem value={KeyStage.KS2}>Key Stage 2</SelectItem>
                    <SelectItem value={KeyStage.KS3}>Key Stage 3</SelectItem>
                    <SelectItem value={KeyStage.KS4}>Key Stage 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level: {difficulty}</Label>
              <Slider
                id="difficulty"
                min={1}
                max={10}
                step={1}
                value={[difficulty]}
                onValueChange={(value) => setDifficulty(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Easier</span>
                <span>Balanced</span>
                <span>Challenging</span>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includePrerequisites"
                  checked={includePrerequisites}
                  onCheckedChange={(checked) => setIncludePrerequisites(checked as boolean)}
                />
                <Label htmlFor="includePrerequisites">Include prerequisites</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adaptToLearningStyle"
                  checked={adaptToLearningStyle}
                  onCheckedChange={(checked) => setAdaptToLearningStyle(checked as boolean)}
                />
                <Label htmlFor="adaptToLearningStyle">Adapt to my learning style</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adaptToInterests"
                  checked={adaptToInterests}
                  onCheckedChange={(checked) => setAdaptToInterests(checked as boolean)}
                />
                <Label htmlFor="adaptToInterests">Personalize based on my interests</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="topics" className="py-4">
            {availableTopics.length === 0 ? (
              <div className="text-center py-8">
                <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Please select a subject and key stage to view available topics
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Available Topics</h3>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Focus</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Exclude</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTopics.map((topic) => (
                    <div key={topic.id} className="flex justify-between items-center p-3 border rounded-md">
                      <span>{topic.name}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant={focusTopics.includes(topic.id) ? "default" : "outline"}
                          size="sm"
                          className={focusTopics.includes(topic.id) ? "bg-green-500 hover:bg-green-600" : ""}
                          onClick={() => handleTopicSelection(topic.id, true)}
                        >
                          Focus
                        </Button>
                        <Button
                          variant={excludeTopics.includes(topic.id) ? "default" : "outline"}
                          size="sm"
                          className={excludeTopics.includes(topic.id) ? "bg-red-500 hover:bg-red-600" : ""}
                          onClick={() => handleTopicSelection(topic.id, false)}
                        >
                          Exclude
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="py-4">
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Advanced Options</AlertTitle>
                <AlertDescription>
                  These settings allow for fine-tuning your learning experience. The default values are recommended for most users.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  Advanced options will be expanded in future updates, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Custom learning pace settings</li>
                  <li>Spaced repetition configuration</li>
                  <li>Assessment frequency preferences</li>
                  <li>Learning resource type priorities</li>
                  <li>Time-based learning goals</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleCreatePath} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Learning Path'}
        </Button>
      </CardFooter>
    </Card>
  );
}
