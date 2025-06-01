"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info, RefreshCw } from 'lucide-react';
import { 
  LearningStyle,
  UserLearningProfile
} from '@/lib/learning-path/types';
import { fetchUserLearningProfile } from '@/lib/learning-path/api';
import { AvatarVideo } from '@/components/special-needs/executive-dysfunction/working-memory/AvatarVideo';

interface LearningStylePreferencesProps {
  userId: string;
  onSave?: (profile: UserLearningProfile) => void;
}

export function LearningStylePreferences({ userId, onSave }: LearningStylePreferencesProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserLearningProfile | null>(null);
  
  // Form state
  const [dominantStyle, setDominantStyle] = useState<LearningStyle | ''>('');
  const [secondaryStyle, setSecondaryStyle] = useState<LearningStyle | ''>('');
  const [learningPace, setLearningPace] = useState<number>(5);
  const [interests, setInterests] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState<string>('any');
  const [focusDuration, setFocusDuration] = useState<number>(30);
  
  // Available interests
  const availableInterests = [
    { id: 'sports', label: 'Sports' },
    { id: 'music', label: 'Music' },
    { id: 'technology', label: 'Technology' },
    { id: 'nature', label: 'Nature' },
    { id: 'space', label: 'Space' },
    { id: 'animals', label: 'Animals' },
    { id: 'art', label: 'Art' },
    { id: 'history', label: 'History' },
    { id: 'science_fiction', label: 'Science Fiction' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'travel', label: 'Travel' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'dinosaurs', label: 'Dinosaurs' },
    { id: 'superheroes', label: 'Superheroes' }
  ];
  
  useEffect(() => {
    loadUserProfile();
  }, [userId]);
  
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, we would fetch the user profile from the API
      // For now, we'll create some mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user profile
      const mockProfile: UserLearningProfile = {
        id: 'profile-1',
        userId,
        dominantLearningStyle: LearningStyle.VISUAL,
        secondaryLearningStyle: LearningStyle.KINESTHETIC,
        learningPace: 6,
        interests: ['technology', 'space', 'science_fiction', 'gaming'],
        strengths: ['topic-1', 'topic-5'],
        areasForImprovement: ['topic-3', 'topic-7'],
        preferredLearningTime: 'afternoon',
        focusDuration: 45,
        lastUpdated: new Date('2025-05-10')
      };
      
      setProfile(mockProfile);
      
      // Set form state
      setDominantStyle(mockProfile.dominantLearningStyle);
      setSecondaryStyle(mockProfile.secondaryLearningStyle || '');
      setLearningPace(mockProfile.learningPace);
      setInterests(mockProfile.interests);
      setPreferredTime(mockProfile.preferredLearningTime);
      setFocusDuration(mockProfile.focusDuration);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleInterestToggle = (interestId: string) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter(id => id !== interestId));
    } else {
      setInterests([...interests, interestId]);
    }
  };
  
  const handleSave = async () => {
    if (!dominantStyle) {
      setError('Please select a dominant learning style.');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      // Create updated profile
      const updatedProfile: UserLearningProfile = {
        id: profile?.id || `profile-${Date.now()}`,
        userId,
        dominantLearningStyle: dominantStyle as LearningStyle,
        secondaryLearningStyle: secondaryStyle ? (secondaryStyle as LearningStyle) : null,
        learningPace,
        interests,
        strengths: profile?.strengths || [],
        areasForImprovement: profile?.areasForImprovement || [],
        preferredLearningTime: preferredTime as 'morning' | 'afternoon' | 'evening' | 'any',
        focusDuration,
        lastUpdated: new Date()
      };
      
      // In a real implementation, we would save the profile to the API
      // For now, we'll just update the local state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(updatedProfile);
      setSuccess('Learning style preferences saved successfully!');
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(updatedProfile);
      }
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving learning style preferences:', error);
      setError('Failed to save learning style preferences. Please try again.');
      setIsSaving(false);
    }
  };
  
  const getLearningStyleDescription = (style: LearningStyle) => {
    switch (style) {
      case LearningStyle.VISUAL:
        return 'You learn best through seeing and visualizing information. Visual learners benefit from diagrams, charts, pictures, and written directions.';
      case LearningStyle.AUDITORY:
        return 'You learn best through listening and hearing information. Auditory learners benefit from discussions, verbal instructions, and audio recordings.';
      case LearningStyle.READING_WRITING:
        return 'You learn best through reading and writing information. Reading/writing learners benefit from lists, notes, and text-based materials.';
      case LearningStyle.KINESTHETIC:
        return 'You learn best through physical experiences and hands-on activities. Kinesthetic learners benefit from experiments, role-playing, and movement.';
      case LearningStyle.MULTIMODAL:
        return 'You learn effectively through multiple learning styles. Multimodal learners benefit from a variety of learning approaches and materials.';
      default:
        return '';
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Learning Style Preferences</CardTitle>
        <CardDescription>
          Customize how you learn best to personalize your learning experience
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success">
            <Info className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <AvatarVideo 
              title="Learning Styles"
              description="Understanding your learning style helps us personalize your learning experience. Everyone learns differently, and there's no right or wrong style!"
            />
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Primary Learning Style</h3>
                <p className="text-sm text-muted-foreground">
                  Select the learning style that best describes how you prefer to learn new information.
                </p>
                
                <RadioGroup 
                  value={dominantStyle} 
                  onValueChange={setDominantStyle}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {Object.values(LearningStyle).map((style) => (
                    <div key={style} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={style} id={`style-${style}`} />
                        <Label htmlFor={`style-${style}`} className="font-medium">
                          {style === LearningStyle.VISUAL && 'Visual'}
                          {style === LearningStyle.AUDITORY && 'Auditory'}
                          {style === LearningStyle.READING_WRITING && 'Reading/Writing'}
                          {style === LearningStyle.KINESTHETIC && 'Kinesthetic'}
                          {style === LearningStyle.MULTIMODAL && 'Multimodal'}
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        {getLearningStyleDescription(style as LearningStyle)}
                      </p>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Secondary Learning Style (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  If you have a secondary learning style preference, select it below.
                </p>
                
                <Select value={secondaryStyle} onValueChange={setSecondaryStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a secondary learning style (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {Object.values(LearningStyle)
                      .filter(style => style !== dominantStyle)
                      .map((style) => (
                        <SelectItem key={style} value={style}>
                          {style === LearningStyle.VISUAL && 'Visual'}
                          {style === LearningStyle.AUDITORY && 'Auditory'}
                          {style === LearningStyle.READING_WRITING && 'Reading/Writing'}
                          {style === LearningStyle.KINESTHETIC && 'Kinesthetic'}
                          {style === LearningStyle.MULTIMODAL && 'Multimodal'}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Learning Pace</h3>
                <p className="text-sm text-muted-foreground">
                  Select your preferred learning pace. This helps us adjust the timing and complexity of your learning materials.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      learningPace <= 3 ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => setLearningPace(3)}
                  >
                    <h4 className="font-medium">Gradual</h4>
                    <p className="text-sm text-muted-foreground">
                      I prefer to take my time and thoroughly understand each concept before moving on.
                    </p>
                  </div>
                  
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      learningPace > 3 && learningPace <= 7 ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => setLearningPace(5)}
                  >
                    <h4 className="font-medium">Moderate</h4>
                    <p className="text-sm text-muted-foreground">
                      I prefer a balanced pace with time to practice and reflect on new concepts.
                    </p>
                  </div>
                  
                  <div 
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      learningPace > 7 ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => setLearningPace(8)}
                  >
                    <h4 className="font-medium">Accelerated</h4>
                    <p className="text-sm text-muted-foreground">
                      I prefer to move quickly through material and challenge myself with advanced concepts.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interests</h3>
                <p className="text-sm text-muted-foreground">
                  Select your interests to help us personalize examples and content to make learning more engaging.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableInterests.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`interest-${interest.id}`} 
                        checked={interests.includes(interest.id)}
                        onCheckedChange={() => handleInterestToggle(interest.id)}
                      />
                      <Label htmlFor={`interest-${interest.id}`}>{interest.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Learning Schedule Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Preferred Learning Time</Label>
                    <RadioGroup value={preferredTime} onValueChange={setPreferredTime}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="morning" id="morning" />
                        <Label htmlFor="morning">Morning (6am-12pm)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <Label htmlFor="afternoon">Afternoon (12pm-6pm)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="evening" id="evening" />
                        <Label htmlFor="evening">Evening (6pm-12am)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="any" />
                        <Label htmlFor="any">Any time</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Typical Focus Duration</Label>
                    <RadioGroup value={focusDuration.toString()} onValueChange={(value) => setFocusDuration(parseInt(value))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15" id="focus-15" />
                        <Label htmlFor="focus-15">Short sessions (15 minutes)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30" id="focus-30" />
                        <Label htmlFor="focus-30">Medium sessions (30 minutes)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="45" id="focus-45" />
                        <Label htmlFor="focus-45">Long sessions (45 minutes)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="60" id="focus-60" />
                        <Label htmlFor="focus-60">Extended sessions (60+ minutes)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );
}
