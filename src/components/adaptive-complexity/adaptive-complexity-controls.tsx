'use client';

import React, { useState, useEffect } from 'react';
import { 
  ComplexityLevel, 
  LearningProfile, 
  AdaptiveContent 
} from '@/lib/adaptive-complexity/types';
import { adaptiveComplexityService } from '@/lib/adaptive-complexity/adaptive-complexity-service';

interface AdaptiveComplexityControlsProps {
  userId: string;
  subjectId: string;
  skillId?: string;
  onComplexityChange?: (newLevel: ComplexityLevel) => void;
  className?: string;
}

/**
 * Component for displaying and controlling adaptive complexity settings
 * 
 * This component allows users to view their current complexity level,
 * see recommendations, and manually override the adaptive system if needed.
 */
export const AdaptiveComplexityControls: React.FC<AdaptiveComplexityControlsProps> = ({
  userId,
  subjectId,
  skillId,
  onComplexityChange,
  className = '',
}) => {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [currentLevel, setCurrentLevel] = useState<ComplexityLevel>(ComplexityLevel.BASIC);
  const [recommendedLevel, setRecommendedLevel] = useState<ComplexityLevel>(ComplexityLevel.BASIC);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualMode, setIsManualMode] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);

  // Fetch user's learning profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll create a mock profile
        const mockProfile: LearningProfile = {
          userId,
          subjectPreferences: {
            [subjectId]: {
              subjectId,
              currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
              recommendedComplexityLevel: ComplexityLevel.ADVANCED,
              confidenceScore: 0.85,
              performanceHistory: [],
              skillAreas: skillId ? {
                [skillId]: {
                  skillId,
                  currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  recommendedComplexityLevel: ComplexityLevel.ADVANCED,
                  confidenceScore: 0.8,
                  performanceHistory: [],
                  strengths: ['Critical thinking', 'Problem solving'],
                  areasForImprovement: ['Memorization', 'Application']
                }
              } : {}
            }
          },
          learningRate: 0.7,
          challengePreference: 0.6,
          lastUpdated: new Date()
        };
        
        setProfile(mockProfile);
        
        // Determine complexity levels
        const determined = adaptiveComplexityService.determineComplexityLevel(
          mockProfile,
          subjectId,
          skillId
        );
        
        // Get current and recommended levels
        const subjectPref = mockProfile.subjectPreferences[subjectId];
        if (subjectPref) {
          if (skillId && subjectPref.skillAreas[skillId]) {
            const skillProfile = subjectPref.skillAreas[skillId];
            setCurrentLevel(skillProfile.currentComplexityLevel);
            setRecommendedLevel(skillProfile.recommendedComplexityLevel);
            setConfidenceScore(skillProfile.confidenceScore);
          } else {
            setCurrentLevel(subjectPref.currentComplexityLevel);
            setRecommendedLevel(subjectPref.recommendedComplexityLevel);
            setConfidenceScore(subjectPref.confidenceScore);
          }
        }
      } catch (error) {
        console.error('Error fetching learning profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, subjectId, skillId]);

  // Handle manual complexity change
  const handleComplexityChange = (level: ComplexityLevel) => {
    setCurrentLevel(level);
    
    if (onComplexityChange) {
      onComplexityChange(level);
    }
    
    // In a real implementation, this would update the user's profile via API
    console.log(`Manually changed complexity to ${level}`);
  };

  // Toggle between automatic and manual modes
  const toggleMode = () => {
    setIsManualMode(!isManualMode);
    
    if (isManualMode && recommendedLevel !== currentLevel) {
      // When switching back to automatic, apply the recommended level
      setCurrentLevel(recommendedLevel);
      
      if (onComplexityChange) {
        onComplexityChange(recommendedLevel);
      }
    }
  };

  // Format complexity level for display
  const formatComplexityLevel = (level: ComplexityLevel): string => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`p-4 border rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-grey-200 rounded w-3/4 mb-2"></div>
          <div className="h-10 bg-grey-200 rounded mb-4"></div>
          <div className="h-4 bg-grey-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-centre mb-4">
        <h3 className="text-lg font-medium">Content Complexity</h3>
        <div className="flex items-centre">
          <span className="text-sm mr-2">
            {isManualMode ? 'Manual' : 'Automatic'}
          </span>
          <button
            onClick={toggleMode}
            className="relative inline-flex h-6 w-11 items-centre rounded-full bg-grey-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`${
                isManualMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        </div>
      </div>

      {isManualMode ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Select complexity level:
          </label>
          <select
            value={currentLevel}
            onChange={(e) => handleComplexityChange(e.target.value as ComplexityLevel)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(ComplexityLevel).map((level) => (
              <option key={level} value={level}>
                {formatComplexityLevel(level)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex justify-between items-centre mb-1">
            <span className="text-sm font-medium">Current Level:</span>
            <span className="text-sm font-bold">{formatComplexityLevel(currentLevel)}</span>
          </div>
          
          {currentLevel !== recommendedLevel && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <div className="flex justify-between items-centre">
                <span className="text-sm text-blue-700">Recommended:</span>
                <span className="text-sm font-bold text-blue-700">
                  {formatComplexityLevel(recommendedLevel)}
                </span>
              </div>
              <div className="mt-1 flex items-centre">
                <div className="w-full bg-grey-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${confidenceScore * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-grey-500">
                  {Math.round(confidenceScore * 100)}% confidence
                </span>
              </div>
              <button
                onClick={() => handleComplexityChange(recommendedLevel)}
                className="mt-2 w-full py-1 px-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Apply Recommendation
              </button>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-grey-500">
        <p>
          Content complexity is {isManualMode ? 'manually' : 'automatically'} adjusted based on your performance and learning patterns.
        </p>
        {!isManualMode && (
          <p className="mt-1">
            Switch to manual mode to override the adaptive system.
          </p>
        )}
      </div>
    </div>
  );
};
