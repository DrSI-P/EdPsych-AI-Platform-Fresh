'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContextualResourceRecommendation } from '@/components/resource/contextual-resource-recommendation';

interface SmartLessonPlanningIntegrationProps {
  lessonPlanId?: string;
  lessonPlanContent?: string;
  className?: string;
}

export function SmartLessonPlanningIntegration({
  lessonPlanId,
  lessonPlanContent = '',
  className = ''
}: SmartLessonPlanningIntegrationProps) {
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  return (
    <div className={`smart-lesson-planning-integration ${className}`}>
      {showRecommendations && (
        <div className="mb-6">
          <ContextualResourceRecommendation 
            contextSource="lesson-plan"
            contextId={lessonPlanId}
            contextContent={lessonPlanContent}
          />
          <div className="flex justify-end mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowRecommendations(false)}
            >
              Hide Recommendations
            </Button>
          </div>
        </div>
      )}
      
      {!showRecommendations && (
        <div className="mb-6 text-right">
          <Button 
            variant="outline" 
            onClick={() => setShowRecommendations(true)}
          >
            Show Resource Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
