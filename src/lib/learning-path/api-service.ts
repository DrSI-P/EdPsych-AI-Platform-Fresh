/**
 * Personalized Learning Paths API Service
 * 
 * This service provides backend integration for the Personalized Learning Paths feature,
 * handling data persistence, retrieval, and synchronization with the database.
 */

import { 
  LearningPath, 
  LearningPathUnit, 
  UserLearningProfile, 
  PathGenerationParams,
  AssessmentResult,
  TopicStatus,
  ProficiencyLevel,
  Subject,
  KeyStage,
  LearningStyle
} from './types';

/**
 * Fetches all learning paths for a user
 * @param userId The user ID
 * @returns Promise resolving to an array of learning paths
 */
export async function fetchUserLearningPaths(userId: string): Promise<LearningPath[]> {
  try {
    const response = await fetch(`/api/learning-paths?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching learning paths: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchUserLearningPaths:', error);
    throw error;
  }
}

/**
 * Fetches a specific learning path by ID
 * @param pathId The learning path ID
 * @returns Promise resolving to a learning path
 */
export async function fetchLearningPath(pathId: string): Promise<LearningPath> {
  try {
    const response = await fetch(`/api/learning-paths/${pathId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching learning path: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchLearningPath:', error);
    throw error;
  }
}

/**
 * Creates a new personalized learning path
 * @param userId The user ID
 * @param subjectId The subject ID
 * @param keyStage The key stage
 * @param params Additional parameters for path generation
 * @returns Promise resolving to the created learning path
 */
export async function createPersonalizedLearningPath(
  userId: string, 
  subjectId: string, 
  keyStage: KeyStage,
  params?: Partial<PathGenerationParams>
): Promise<LearningPath> {
  try {
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

    return await response.json();
  } catch (error) {
    console.error('Error in createPersonalizedLearningPath:', error);
    throw error;
  }
}

/**
 * Updates a learning path
 * @param pathId The learning path ID
 * @param updates The updates to apply
 * @returns Promise resolving to the updated learning path
 */
export async function updateLearningPath(
  pathId: string, 
  updates: Partial<LearningPath>
): Promise<LearningPath> {
  try {
    const response = await fetch(`/api/learning-paths/${pathId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Error updating learning path: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateLearningPath:', error);
    throw error;
  }
}

/**
 * Updates the status of a learning path unit
 * @param pathId The learning path ID
 * @param unitId The unit ID
 * @param status The new status
 * @param progress The new progress percentage
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
      body: JSON.stringify({
        status,
        progress
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating unit status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateUnitStatus:', error);
    throw error;
  }
}

/**
 * Fetches curriculum topics for a subject and key stage
 * @param subjectId The subject ID
 * @param keyStage The key stage
 * @returns Promise resolving to an array of topics
 */
export async function fetchCurriculumTopics(
  subjectId: string, 
  keyStage: KeyStage
): Promise<Array<{id: string, name: string}>> {
  try {
    const response = await fetch(`/api/curriculum/topics?subjectId=${subjectId}&keyStage=${keyStage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching curriculum topics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchCurriculumTopics:', error);
    throw error;
  }
}

/**
 * Fetches a user's learning profile
 * @param userId The user ID
 * @returns Promise resolving to the user's learning profile
 */
export async function fetchUserLearningProfile(userId: string): Promise<UserLearningProfile> {
  try {
    const response = await fetch(`/api/users/${userId}/learning-profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user learning profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchUserLearningProfile:', error);
    throw error;
  }
}

/**
 * Updates a user's learning profile
 * @param userId The user ID
 * @param profile The updated profile
 * @returns Promise resolving to the updated profile
 */
export async function updateUserLearningProfile(
  userId: string, 
  profile: Partial<UserLearningProfile>
): Promise<UserLearningProfile> {
  try {
    const response = await fetch(`/api/users/${userId}/learning-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(`Error updating user learning profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateUserLearningProfile:', error);
    throw error;
  }
}

/**
 * Fetches assessment results for a user
 * @param userId The user ID
 * @param subjectId Optional subject ID filter
 * @returns Promise resolving to an array of assessment results
 */
export async function fetchAssessmentResults(
  userId: string, 
  subjectId?: string
): Promise<AssessmentResult[]> {
  try {
    let url = `/api/assessments/results?userId=${userId}`;
    if (subjectId) {
      url += `&subjectId=${subjectId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching assessment results: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchAssessmentResults:', error);
    throw error;
  }
}

/**
 * Submits an assessment result
 * @param result The assessment result to submit
 * @returns Promise resolving to the saved assessment result
 */
export async function submitAssessmentResult(result: AssessmentResult): Promise<AssessmentResult> {
  try {
    const response = await fetch('/api/assessments/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error(`Error submitting assessment result: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in submitAssessmentResult:', error);
    throw error;
  }
}

/**
 * Fetches learning resources for a unit
 * @param unitId The unit ID
 * @returns Promise resolving to an array of learning resources
 */
export async function fetchUnitResources(unitId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/learning-paths/units/${unitId}/resources`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching unit resources: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchUnitResources:', error);
    throw error;
  }
}

/**
 * Tracks a user's progress on a learning path
 * @param pathId The learning path ID
 * @param userId The user ID
 * @param progress The overall progress percentage
 * @returns Promise resolving to the updated learning path
 */
export async function trackLearningPathProgress(
  pathId: string,
  userId: string,
  progress: number
): Promise<LearningPath> {
  try {
    const response = await fetch(`/api/learning-paths/${pathId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        progress
      }),
    });

    if (!response.ok) {
      throw new Error(`Error tracking learning path progress: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in trackLearningPathProgress:', error);
    throw error;
  }
}
