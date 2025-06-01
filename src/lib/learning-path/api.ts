/**
 * API functions for the Personalized Learning Path feature
 */

import {
  LearningStyle,
  KeyStage,
  Subject,
  ProficiencyLevel,
  TopicStatus,
  AssessmentResult,
  CurriculumTopic,
  LearningResource,
  UserLearningProfile,
  LearningPathUnit,
  LearningPath,
  PathGenerationParams,
  PathAdaptationEvent
} from './types';

import {
  determineStartingProficiency,
  identifyPrerequisites,
  filterResourcesByUserPreferences,
  generateTopicSequence,
  adjustUnitDifficulty,
  estimateCompletionDate,
  generatePersonalizedPath,
  adaptPathBasedOnAssessment
} from './utils';

/**
 * Fetches the user's learning profile
 * @param userId User ID
 * @returns Promise resolving to the user's learning profile
 */
export async function fetchUserLearningProfile(userId: string): Promise<UserLearningProfile> {
  try {
    const response = await fetch(`/api/users/${userId}/learning-profile`);
    if (!response.ok) {
      throw new Error(`Failed to fetch learning profile: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user learning profile:', error);
    throw error;
  }
}

/**
 * Fetches assessment results for a user
 * @param userId User ID
 * @param subjectId Optional subject ID to filter results
 * @returns Promise resolving to array of assessment results
 */
export async function fetchAssessmentResults(
  userId: string,
  subjectId?: string
): Promise<AssessmentResult[]> {
  try {
    const url = subjectId 
      ? `/api/users/${userId}/assessments?subjectId=${subjectId}`
      : `/api/users/${userId}/assessments`;
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch assessment results: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    throw error;
  }
}

/**
 * Fetches curriculum topics
 * @param subjectId Optional subject ID to filter topics
 * @param keyStage Optional key stage to filter topics
 * @returns Promise resolving to array of curriculum topics
 */
export async function fetchCurriculumTopics(
  subjectId?: string,
  keyStage?: KeyStage
): Promise<CurriculumTopic[]> {
  try {
    let url = '/api/curriculum/topics';
    const params = new URLSearchParams();
    
    if (subjectId) {
      params.append('subjectId', subjectId);
    }
    
    if (keyStage) {
      params.append('keyStage', keyStage);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch curriculum topics: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching curriculum topics:', error);
    throw error;
  }
}

/**
 * Fetches learning resources
 * @param topicIds Optional array of topic IDs to filter resources
 * @param learningStyle Optional learning style to filter resources
 * @returns Promise resolving to array of learning resources
 */
export async function fetchLearningResources(
  topicIds?: string[],
  learningStyle?: LearningStyle
): Promise<LearningResource[]> {
  try {
    let url = '/api/resources';
    const params = new URLSearchParams();
    
    if (topicIds && topicIds.length > 0) {
      params.append('topicIds', topicIds.join(','));
    }
    
    if (learningStyle) {
      params.append('learningStyle', learningStyle);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch learning resources: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    throw error;
  }
}

/**
 * Fetches a user's learning path
 * @param userId User ID
 * @param subjectId Subject ID
 * @param keyStage Key stage
 * @returns Promise resolving to the learning path or null if not found
 */
export async function fetchLearningPath(
  userId: string,
  subjectId: string,
  keyStage: KeyStage
): Promise<LearningPath | null> {
  try {
    const response = await fetch(
      `/api/users/${userId}/learning-paths?subjectId=${subjectId}&keyStage=${keyStage}`
    );
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch learning path: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching learning path:', error);
    throw error;
  }
}

/**
 * Creates or updates a learning path
 * @param path Learning path to save
 * @returns Promise resolving to the saved learning path
 */
export async function saveLearningPath(path: LearningPath): Promise<LearningPath> {
  try {
    const response = await fetch(`/api/learning-paths/${path.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(path),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save learning path: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving learning path:', error);
    throw error;
  }
}

/**
 * Records a path adaptation event
 * @param event Path adaptation event to record
 * @returns Promise resolving to the saved event
 */
export async function recordPathAdaptationEvent(
  event: PathAdaptationEvent
): Promise<PathAdaptationEvent> {
  try {
    const response = await fetch('/api/learning-paths/adaptation-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to record adaptation event: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording adaptation event:', error);
    throw error;
  }
}

/**
 * Updates a learning path unit's status
 * @param pathId Learning path ID
 * @param unitId Unit ID
 * @param status New status
 * @param progress New progress value
 * @returns Promise resolving to the updated learning path
 */
export async function updateUnitStatus(
  pathId: string,
  unitId: string,
  status: TopicStatus,
  progress: number
): Promise<LearningPath> {
  try {
    const response = await fetch(`/api/learning-paths/${pathId}/units/${unitId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, progress }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update unit status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating unit status:', error);
    throw error;
  }
}

/**
 * Creates a new personalized learning path for a user
 * @param userId User ID
 * @param subjectId Subject ID
 * @param keyStage Key stage
 * @returns Promise resolving to the created learning path
 */
export async function createPersonalizedLearningPath(
  userId: string,
  subjectId: string,
  keyStage: KeyStage
): Promise<LearningPath> {
  try {
    // Fetch required data
    const [userProfile, assessmentResults, topics, allResources] = await Promise.all([
      fetchUserLearningProfile(userId),
      fetchAssessmentResults(userId, subjectId),
      fetchCurriculumTopics(subjectId, keyStage),
      fetchLearningResources()
    ]);
    
    // Generate path parameters
    const params: PathGenerationParams = {
      userId,
      subjectId,
      keyStage,
      includePrerequisites: true,
      adaptToLearningStyle: true,
      adaptToInterests: true,
      difficulty: 5 // Default medium difficulty
    };
    
    // Generate the personalized path
    const path = generatePersonalizedPath(
      params,
      topics,
      allResources,
      userProfile,
      assessmentResults
    );
    
    // Save the path
    return await saveLearningPath(path);
  } catch (error) {
    console.error('Error creating personalized learning path:', error);
    throw error;
  }
}

/**
 * Updates a learning path based on new assessment results
 * @param userId User ID
 * @param pathId Learning path ID
 * @returns Promise resolving to the updated learning path
 */
export async function updatePathBasedOnAssessment(
  userId: string,
  pathId: string
): Promise<LearningPath> {
  try {
    // Fetch required data
    const [path, userProfile, newAssessmentResults, topics, allResources] = await Promise.all([
      fetchLearningPath(userId, '', ''), // We'll use pathId directly in the API call
      fetchUserLearningProfile(userId),
      fetchAssessmentResults(userId), // Get all recent assessments
      fetchCurriculumTopics(),
      fetchLearningResources()
    ]);
    
    if (!path) {
      throw new Error('Learning path not found');
    }
    
    // Adapt the path based on assessment results
    const { updatedPath, adaptationEvent } = adaptPathBasedOnAssessment(
      path,
      newAssessmentResults,
      topics,
      allResources,
      userProfile
    );
    
    // Save the updated path and record the adaptation event
    await Promise.all([
      saveLearningPath(updatedPath),
      recordPathAdaptationEvent(adaptationEvent)
    ]);
    
    return updatedPath;
  } catch (error) {
    console.error('Error updating path based on assessment:', error);
    throw error;
  }
}
