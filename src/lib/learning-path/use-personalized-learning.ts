import { useEffect, useState } from 'react';
import { 
  LearningPath, 
  UserLearningProfile, 
  AssessmentResult,
  PathGenerationParams,
  KeyStage,
  Subject
} from './types';

/**
 * Custom hook for managing personalized learning paths
 * 
 * This hook provides methods for creating, fetching, and updating learning paths,
 * as well as managing user learning profiles and assessments.
 */
export function usePersonalizedLearning(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [userProfile, setUserProfile] = useState<UserLearningProfile | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  
  // Fetch user's learning paths
  const fetchLearningPaths = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/learning-paths?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching learning paths: ${response.statusText}`);
      }
      
      const data = await response.json();
      setLearningPaths(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchLearningPaths:', error);
      setError('Failed to fetch learning paths. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Fetch a specific learning path
  const fetchLearningPath = async (pathId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/learning-paths/${pathId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching learning path: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCurrentPath(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in fetchLearningPath:', error);
      setError('Failed to fetch learning path. Please try again.');
      setIsLoading(false);
      return null;
    }
  };
  
  // Create a new personalized learning path
  const createLearningPath = async (
    subjectId: Subject, 
    keyStage: KeyStage,
    params?: Partial<PathGenerationParams>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/learning-paths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subjectId,
          keyStage,
          ...params
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating learning path: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update the learning paths list
      setLearningPaths(prev => [...prev, data]);
      setCurrentPath(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in createLearningPath:', error);
      setError('Failed to create learning path. Please try again.');
      setIsLoading(false);
      return null;
    }
  };
  
  // Update a unit's status
  const updateUnitStatus = async (pathId: string, unitId: string, status: string, progress: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/learning-paths/${pathId}/units/${unitId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          progress
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating unit status: ${response.statusText}`);
      }
      
      const updatedPath = await response.json();
      
      // Update the current path and learning paths list
      setCurrentPath(updatedPath);
      setLearningPaths(prev => 
        prev.map(path => path.id === pathId ? updatedPath : path)
      );
      
      setIsLoading(false);
      return updatedPath;
    } catch (error) {
      console.error('Error in updateUnitStatus:', error);
      setError('Failed to update unit status. Please try again.');
      setIsLoading(false);
      return null;
    }
  };
  
  // Fetch user's learning profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/${userId}/learning-profile`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user profile: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUserProfile(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setError('Failed to fetch user profile. Please try again.');
      setIsLoading(false);
      return null;
    }
  };
  
  // Update user's learning profile
  const updateUserProfile = async (profile: Partial<UserLearningProfile>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/${userId}/learning-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating user profile: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUserProfile(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      setError('Failed to update user profile. Please try again.');
      setIsLoading(false);
      return null;
    }
  };
  
  // Fetch curriculum topics
  const fetchCurriculumTopics = async (subjectId: string, keyStage: KeyStage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/curriculum/topics?subjectId=${subjectId}&keyStage=${keyStage}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching curriculum topics: ${response.statusText}`);
      }
      
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in fetchCurriculumTopics:', error);
      setError('Failed to fetch curriculum topics. Please try again.');
      setIsLoading(false);
      return [];
    }
  };
  
  // Fetch assessment results
  const fetchAssessmentResults = async (subjectId?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let url = `/api/assessments/results?userId=${userId}`;
      if (subjectId) {
        url += `&subjectId=${subjectId}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching assessment results: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAssessmentResults(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in fetchAssessmentResults:', error);
      setError('Failed to fetch assessment results. Please try again.');
      setIsLoading(false);
      return [];
    }
  };
  
  // Submit assessment result
  const submitAssessmentResult = async (result: AssessmentResult) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/assessments/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...result,
          userId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error submitting assessment result: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update assessment results
      setAssessmentResults(prev => [...prev, data]);
      
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in submitAssessmentResult:', error);
      setError('Failed to submit assessment result. Please try again.');
      setIsLoading(false);
      return null;
    }
  };
  
  // Load initial data
  useEffect(() => {
    if (userId) {
      fetchLearningPaths();
      fetchUserProfile();
      fetchAssessmentResults();
    }
  }, [userId]);
  
  return {
    isLoading,
    error,
    learningPaths,
    currentPath,
    userProfile,
    assessmentResults,
    fetchLearningPaths,
    fetchLearningPath,
    createLearningPath,
    updateUnitStatus,
    fetchUserProfile,
    updateUserProfile,
    fetchCurriculumTopics,
    fetchAssessmentResults,
    submitAssessmentResult
  };
}
