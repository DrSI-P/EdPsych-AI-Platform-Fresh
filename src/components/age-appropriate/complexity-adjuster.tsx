'use client';

import React from 'react';
import { useAgeAppropriate, ComplexityLevel } from './age-appropriate-provider';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ComplexityAdjusterProps {
  className?: string;
  onUpdate?: () => void;
}

export const ComplexityAdjuster: React.FC<ComplexityAdjusterProps> = ({
  className = '',
  onUpdate
}) => {
  const { 
    ageGroup, 
    complexityLevel,
    setComplexityLevel
  } = useAgeAppropriate();
  
  // Map complexity level to slider value
  const getSliderValue = (): number => {
    switch (complexityLevel) {
      case 'very-simple': return 0;
      case 'simple': return 1;
      case 'moderate': return 2;
      case 'advanced': return 3;
      default: return 1;
    }
  };
  
  // Map slider value to complexity level
  const getComplexityFromSlider = (value: number): ComplexityLevel => {
    switch (value) {
      case 0: return 'very-simple';
      case 1: return 'simple';
      case 2: return 'moderate';
      case 3: return 'advanced';
      default: return 'simple';
    }
  };
  
  const handleComplexityChange = (value: number[]) => {
    const newComplexity = getComplexityFromSlider(value[0]);
    setComplexityLevel(newComplexity);
    if (onUpdate) onUpdate();
  };
  
  // Get description based on complexity level
  const getComplexityDescription = (): string => {
    switch (complexityLevel) {
      case 'very-simple':
        return 'Basic vocabulary with simple sentences and concepts. Ideal for early learners.';
      case 'simple':
        return 'Clear language with straightforward explanations. Good for primary education.';
      case 'moderate':
        return 'More detailed content with some technical terms. Suitable for secondary education.';
      case 'advanced':
        return 'Complex concepts with specialized vocabulary. Appropriate for advanced learners.';
      default:
        return '';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Content Complexity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Very Simple</Label>
              <Label>Advanced</Label>
            </div>
            <Slider
              defaultValue={[getSliderValue()]}
              max={3}
              step={1}
              onValueChange={handleComplexityChange}
            />
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="font-medium mb-1 capitalize">{complexityLevel.replace('-', ' ')}</div>
            <p className="text-sm text-muted-foreground">{getComplexityDescription()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplexityAdjuster;
