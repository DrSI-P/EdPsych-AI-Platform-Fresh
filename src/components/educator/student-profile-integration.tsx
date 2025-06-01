'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContextualResourceRecommendation } from '@/components/resource/contextual-resource-recommendation';

interface StudentProfileIntegrationProps {
  studentId?: string;
  studentProfile?: {
    name: string;
    yearGroup: number;
    specialNeeds?: string[];
    interests?: string[];
    strengths?: string[];
    areasForDevelopment?: string[];
  };
  className?: string;
}

export function StudentProfileIntegration({
  studentId,
  studentProfile,
  className = ''
}: StudentProfileIntegrationProps) {
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  // Format student profile into context content
  const formatProfileContent = () => {
    if (!studentProfile) return '';
    
    const { name, yearGroup, specialNeeds, interests, strengths, areasForDevelopment } = studentProfile;
    
    let content = `${name}, Year ${yearGroup} student`;
    
    if (specialNeeds && specialNeeds.length > 0) {
      content += ` with ${specialNeeds.join(', ')}`;
    }
    
    if (interests && interests.length > 0) {
      content += `. Interests: ${interests.join(', ')}`;
    }
    
    if (strengths && strengths.length > 0) {
      content += `. Strengths: ${strengths.join(', ')}`;
    }
    
    if (areasForDevelopment && areasForDevelopment.length > 0) {
      content += `. Areas for development: ${areasForDevelopment.join(', ')}`;
    }
    
    return content;
  };
  
  const contextContent = formatProfileContent();
  
  return (
    <div className={`student-profile-integration ${className}`}>
      {showRecommendations && contextContent && (
        <div className="mb-6">
          <ContextualResourceRecommendation 
            contextSource="student-profile"
            contextId={studentId}
            contextContent={contextContent}
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
      
      {(!showRecommendations || !contextContent) && (
        <div className="mb-6 text-right">
          <Button 
            variant="outline" 
            onClick={() => setShowRecommendations(true)}
            disabled={!contextContent}
          >
            Show Resource Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}
