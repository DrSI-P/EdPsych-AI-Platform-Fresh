'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContextualResourceRecommendation } from '@/components/resource/contextual-resource-recommendation';

interface MeetingNoteIntegrationProps {
  meetingId?: string;
  meetingContent?: string;
  ehcnaCategories?: boolean;
  className?: string;
}

export function MeetingNoteIntegration({
  meetingId,
  meetingContent = '',
  ehcnaCategories = false,
  className = ''
}: MeetingNoteIntegrationProps) {
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  // Extract EHCNA-specific content if applicable
  const contextContent = ehcnaCategories 
    ? `EHCNA meeting: ${meetingContent}`
    : meetingContent;
  
  return (
    <div className={`meeting-note-integration ${className}`}>
      {showRecommendations && (
        <div className="mb-6">
          <ContextualResourceRecommendation 
            contextSource="meeting-notes"
            contextId={meetingId}
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
