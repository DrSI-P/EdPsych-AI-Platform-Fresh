'use client';

import React, { useState, useEffect } from 'react';
import { 
  ComplexityLevel, 
  LearningProfile,
  SubjectPreference,
  SkillAreaProfile
} from '@/lib/adaptive-complexity/types';
import { AdaptiveComplexityControls } from './adaptive-complexity-controls';

interface AdaptiveComplexityDashboardProps {
  userId: string;
  className?: string;
}

/**
 * Dashboard component for visualising and managing adaptive complexity settings
 * 
 * This component provides a comprehensive view of a user's learning profile,
 * including subject preferences, skill areas, and complexity recommendations.
 * It is designed for both educators and students to understand and manage
 * the adaptive complexity system.
 */
export const AdaptiveComplexityDashboard: React.FC<AdaptiveComplexityDashboardProps> = ({
  userId,
  className = '',
}) => {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'student' | 'educator'>('student');

  // Fetch user's learning profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll create a mock profile with multiple subjects
        const mockProfile: LearningProfile = {
          userId,
          subjectPreferences: {
            'mathematics': {
              subjectId: 'mathematics',
              currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
              recommendedComplexityLevel: ComplexityLevel.ADVANCED,
              confidenceScore: 0.85,
              performanceHistory: [],
              skillAreas: {
                'algebra': {
                  skillId: 'algebra',
                  currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  recommendedComplexityLevel: ComplexityLevel.ADVANCED,
                  confidenceScore: 0.8,
                  performanceHistory: [],
                  strengths: ['Pattern recognition', 'Equation solving'],
                  areasForImprovement: ['Word problems', 'Complex equations']
                },
                'geometry': {
                  skillId: 'geometry',
                  currentComplexityLevel: ComplexityLevel.BASIC,
                  recommendedComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  confidenceScore: 0.7,
                  performanceHistory: [],
                  strengths: ['Shape recognition', 'Basic measurements'],
                  areasForImprovement: ['Proofs', 'Spatial reasoning']
                }
              }
            },
            'english': {
              subjectId: 'english',
              currentComplexityLevel: ComplexityLevel.BASIC,
              recommendedComplexityLevel: ComplexityLevel.BASIC,
              confidenceScore: 0.6,
              performanceHistory: [],
              skillAreas: {
                'reading': {
                  skillId: 'reading',
                  currentComplexityLevel: ComplexityLevel.BASIC,
                  recommendedComplexityLevel: ComplexityLevel.BASIC,
                  confidenceScore: 0.65,
                  performanceHistory: [],
                  strengths: ['Vocabulary', 'Basic comprehension'],
                  areasForImprovement: ['Critical analysis', 'Inference']
                },
                'writing': {
                  skillId: 'writing',
                  currentComplexityLevel: ComplexityLevel.FOUNDATIONAL,
                  recommendedComplexityLevel: ComplexityLevel.BASIC,
                  confidenceScore: 0.75,
                  performanceHistory: [],
                  strengths: ['Sentence structure', 'Creativity'],
                  areasForImprovement: ['Grammar', 'Organisation']
                }
              }
            },
            'science': {
              subjectId: 'science',
              currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
              recommendedComplexityLevel: ComplexityLevel.INTERMEDIATE,
              confidenceScore: 0.9,
              performanceHistory: [],
              skillAreas: {
                'biology': {
                  skillId: 'biology',
                  currentComplexityLevel: ComplexityLevel.ADVANCED,
                  recommendedComplexityLevel: ComplexityLevel.ADVANCED,
                  confidenceScore: 0.95,
                  performanceHistory: [],
                  strengths: ['Classification', 'Systems understanding'],
                  areasForImprovement: ['Molecular biology', 'Genetics']
                },
                'chemistry': {
                  skillId: 'chemistry',
                  currentComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  recommendedComplexityLevel: ComplexityLevel.INTERMEDIATE,
                  confidenceScore: 0.8,
                  performanceHistory: [],
                  strengths: ['Element knowledge', 'Basic reactions'],
                  areasForImprovement: ['Balancing equations', 'Organic chemistry']
                }
              }
            }
          },
          learningRate: 0.7,
          challengePreference: 0.6,
          lastUpdated: new Date()
        };
        
        setProfile(mockProfile);
        
        // Set initial selected subject and skill
        if (Object.keys(mockProfile.subjectPreferences).length > 0) {
          const firstSubject = Object.keys(mockProfile.subjectPreferences)[0];
          setSelectedSubject(firstSubject);
          
          const subjectPref = mockProfile.subjectPreferences[firstSubject];
          if (subjectPref && Object.keys(subjectPref.skillAreas).length > 0) {
            setSelectedSkill(Object.keys(subjectPref.skillAreas)[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching learning profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle complexity change
  const handleComplexityChange = (newLevel: ComplexityLevel) => {
    if (!profile || !selectedSubject) return;
    
    // Create updated profile
    const updatedProfile = { ...profile };
    const subjectPref = { ...updatedProfile.subjectPreferences[selectedSubject] };
    
    if (selectedSkill && subjectPref.skillAreas[selectedSkill]) {
      // Update skill-level complexity
      const skillProfile = { ...subjectPref.skillAreas[selectedSkill] };
      skillProfile.currentComplexityLevel = newLevel;
      subjectPref.skillAreas[selectedSkill] = skillProfile;
    } else {
      // Update subject-level complexity
      subjectPref.currentComplexityLevel = newLevel;
    }
    
    updatedProfile.subjectPreferences[selectedSubject] = subjectPref;
    updatedProfile.lastUpdated = new Date();
    
    setProfile(updatedProfile);
    
    // In a real implementation, this would update via API
    console.log(`Changed complexity to ${newLevel} for ${selectedSkill || selectedSubject}`);
  };

  // Format complexity level for display
  const formatComplexityLevel = (level: ComplexityLevel): string => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`p-6 border rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-grey-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-grey-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-40 bg-grey-200 rounded"></div>
            <div className="h-40 bg-grey-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`p-6 border rounded-lg shadow-sm ${className}`}>
        <p className="text-red-500">Error loading learning profile</p>
      </div>
    );
  }

  // Get current subject preference
  const currentSubjectPref = profile.subjectPreferences[selectedSubject];
  
  // Get current skill profile if selected
  const currentSkillProfile = selectedSkill && currentSubjectPref 
    ? currentSubjectPref.skillAreas[selectedSkill] 
    : null;

  return (
    <div className={`p-6 border rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-centre mb-6">
        <h2 className="text-2xl font-bold">Learning Complexity Dashboard</h2>
        <div className="flex items-centre space-x-2">
          <button
            onClick={() => setViewMode('student')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'student' 
                ? 'bg-blue-500 text-white' 
                : 'bg-grey-200 text-grey-700 hover:bg-grey-300'
            }`}
          >
            Student View
          </button>
          <button
            onClick={() => setViewMode('educator')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'educator' 
                ? 'bg-blue-500 text-white' 
                : 'bg-grey-200 text-grey-700 hover:bg-grey-300'
            }`}
          >
            Educator View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subject Selection */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedSkill(''); // Reset skill selection
              }}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(profile.subjectPreferences).map((subjectId) => (
                <option key={subjectId} value={subjectId}>
                  {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {currentSubjectPref && Object.keys(currentSubjectPref.skillAreas).length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Skill Area:
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Overall Subject</option>
                {Object.keys(currentSubjectPref.skillAreas).map((skillId) => (
                  <option key={skillId} value={skillId}>
                    {skillId.charAt(0).toUpperCase() + skillId.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Complexity Controls */}
          <AdaptiveComplexityControls
            userId={userId}
            subjectId={selectedSubject}
            skillId={selectedSkill}
            onComplexityChange={handleComplexityChange}
            className="mt-4"
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          {currentSubjectPref && (
            <>
              <h3 className="text-xl font-semibold mb-4">
                {selectedSkill 
                  ? `${selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1)} in ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}`
                  : `${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Overview`
                }
              </h3>

              {/* Current Status */}
              <div className="bg-grey-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-grey-500">Current Level</p>
                    <p className="text-lg font-medium">
                      {formatComplexityLevel(
                        currentSkillProfile 
                          ? currentSkillProfile.currentComplexityLevel 
                          : currentSubjectPref.currentComplexityLevel
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-grey-500">Recommended Level</p>
                    <p className="text-lg font-medium">
                      {formatComplexityLevel(
                        currentSkillProfile 
                          ? currentSkillProfile.recommendedComplexityLevel 
                          : currentSubjectPref.recommendedComplexityLevel
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-grey-500">Confidence Score</p>
                    <div className="flex items-centre">
                      <div className="w-full bg-grey-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${(currentSkillProfile 
                              ? currentSkillProfile.confidenceScore 
                              : currentSubjectPref.confidenceScore) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm">
                        {Math.round((currentSkillProfile 
                          ? currentSkillProfile.confidenceScore 
                          : currentSubjectPref.confidenceScore) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-grey-500">Last Updated</p>
                    <p className="text-sm">
                      {profile.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strengths and Areas for Improvement */}
              {currentSkillProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {currentSkillProfile.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {currentSkillProfile.areasForImprovement.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Educator-specific content */}
              {viewMode === 'educator' && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium mb-3">Educator Tools</h4>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-blue-800 mb-2">Recommended Interventions</h5>
                    <p className="text-sm">
                      Based on the current learning profile, consider the following interventions:
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-2">
                      <li>Provide additional practice with visual learning materials</li>
                      <li>Introduce more collaborative learning opportunities</li>
                      <li>Consider breaking complex tasks into smaller steps</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
