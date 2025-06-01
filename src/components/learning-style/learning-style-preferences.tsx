'use client';

import React from 'react';
import { useLearningStyle, LearningStyle, AgeGroup } from './learning-style-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LearningStylePreferencesProps {
  className?: string;
  onUpdate?: () => void;
}

export const LearningStylePreferences: React.FC<LearningStylePreferencesProps> = ({
  className = '',
  onUpdate
}) => {
  const { 
    learningStyle, 
    ageGroup, 
    confidence,
    setLearningStyle,
    setAgeGroup,
    resetLearningStyle
  } = useLearningStyle();
  
  const handleStyleChange = (style: LearningStyle) => {
    setLearningStyle(style);
    if (onUpdate) onUpdate();
  };
  
  const handleAgeChange = (age: AgeGroup) => {
    setAgeGroup(age);
    if (onUpdate) onUpdate();
  };
  
  const handleReset = () => {
    resetLearningStyle();
    if (onUpdate) onUpdate();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Learning Style Preferences</span>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="style">Learning Style</TabsTrigger>
            <TabsTrigger value="age">Age Group</TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Button
                variant={learningStyle === 'visual' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 p-2"
                onClick={() => handleStyleChange('visual')}
              >
                <span className="text-2xl mb-1">👁️</span>
                <span>Visual</span>
              </Button>
              
              <Button
                variant={learningStyle === 'auditory' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 p-2"
                onClick={() => handleStyleChange('auditory')}
              >
                <span className="text-2xl mb-1">👂</span>
                <span>Auditory</span>
              </Button>
              
              <Button
                variant={learningStyle === 'reading' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 p-2"
                onClick={() => handleStyleChange('reading')}
              >
                <span className="text-2xl mb-1">📚</span>
                <span>Reading</span>
              </Button>
              
              <Button
                variant={learningStyle === 'kinesthetic' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 p-2"
                onClick={() => handleStyleChange('kinesthetic')}
              >
                <span className="text-2xl mb-1">✋</span>
                <span>Kinesthetic</span>
              </Button>
              
              <Button
                variant={learningStyle === 'multimodal' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 p-2"
                onClick={() => handleStyleChange('multimodal')}
              >
                <span className="text-2xl mb-1">🔄</span>
                <span>Multimodal</span>
              </Button>
              
              <Button
                variant={learningStyle === 'unknown' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-24 p-2"
                onClick={() => handleStyleChange('unknown')}
              >
                <span className="text-2xl mb-1">❓</span>
                <span>Not Set</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="age" className="pt-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Button 
                variant={ageGroup === 'nursery' ? 'default' : 'outline'}
                onClick={() => handleAgeChange('nursery')}
                className="flex flex-col items-center justify-center h-24"
              >
                <span className="text-2xl mb-1">🧸</span>
                <span>Nursery</span>
                <span className="text-xs">(Ages 3-5)</span>
              </Button>
              
              <Button 
                variant={ageGroup === 'primary' ? 'default' : 'outline'}
                onClick={() => handleAgeChange('primary')}
                className="flex flex-col items-center justify-center h-24"
              >
                <span className="text-2xl mb-1">📚</span>
                <span>Primary</span>
                <span className="text-xs">(Ages 5-11)</span>
              </Button>
              
              <Button 
                variant={ageGroup === 'secondary' ? 'default' : 'outline'}
                onClick={() => handleAgeChange('secondary')}
                className="flex flex-col items-center justify-center h-24"
              >
                <span className="text-2xl mb-1">🎒</span>
                <span>Secondary</span>
                <span className="text-xs">(Ages 11-18)</span>
              </Button>
              
              <Button 
                variant={ageGroup === 'adult' ? 'default' : 'outline'}
                onClick={() => handleAgeChange('adult')}
                className="flex flex-col items-center justify-center h-24"
              >
                <span className="text-2xl mb-1">👨‍🎓</span>
                <span>Adult</span>
                <span className="text-xs">(18+)</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LearningStylePreferences;
