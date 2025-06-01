'use client';

import React from 'react';
import { 
  AgeAppropriateProvider, 
  AgeGroupSelector, 
  ComplexityAdjuster 
} from '@/components/age-appropriate';
import { AgeAppropriateExample } from '@/components/age-appropriate/age-appropriate-example';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgeAppropriateDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Age-Appropriate Content & UI Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Age-Appropriate Content System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This demo showcases the EdPsych Connect platform's age-appropriate content and UI system. 
                The content and interface automatically adapt based on the selected age group and complexity level.
              </p>
              <p>
                Try changing the age group and complexity settings below to see how the content and UI elements 
                adapt to different educational stages within the UK curriculum.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <AgeGroupSelector className="h-full" />
        </div>
        
        <div className="md:col-span-2">
          <ComplexityAdjuster className="h-full" />
        </div>
      </div>
      
      <AgeAppropriateExample className="mt-8" />
    </div>
  );
}
