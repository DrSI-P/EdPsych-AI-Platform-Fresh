'use client';

import React from 'react';
import { useAgeAppropriate, AgeGroup } from './age-appropriate-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AgeGroupSelectorProps {
  className?: string;
  onUpdate?: () => void;
}

export const AgeGroupSelector: React.FC<AgeGroupSelectorProps> = ({
  className = '',
  onUpdate
}) => {
  const { 
    ageGroup, 
    complexityLevel,
    setAgeGroup,
    setComplexityLevel,
    getAgeRangeText
  } = useAgeAppropriate();
  
  const handleAgeChange = (age: AgeGroup) => {
    setAgeGroup(age);
    if (onUpdate) onUpdate();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Age Group Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button 
            variant={ageGroup === 'nursery' ? 'default' : 'outline'}
            onClick={() => handleAgeChange('nursery')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">🧸</span>
            <span>Nursery</span>
            <span className="text-xs">{getAgeRangeText('nursery')}</span>
          </Button>
          
          <Button 
            variant={ageGroup === 'primary' ? 'default' : 'outline'}
            onClick={() => handleAgeChange('primary')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">📚</span>
            <span>Primary</span>
            <span className="text-xs">{getAgeRangeText('primary')}</span>
          </Button>
          
          <Button 
            variant={ageGroup === 'secondary' ? 'default' : 'outline'}
            onClick={() => handleAgeChange('secondary')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">🎒</span>
            <span>Secondary</span>
            <span className="text-xs">{getAgeRangeText('secondary')}</span>
          </Button>
          
          <Button 
            variant={ageGroup === 'adult' ? 'default' : 'outline'}
            onClick={() => handleAgeChange('adult')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-2xl mb-1">👨‍🎓</span>
            <span>Adult</span>
            <span className="text-xs">{getAgeRangeText('adult')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeGroupSelector;
