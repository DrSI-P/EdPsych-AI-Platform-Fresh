/**
 * Utility functions for the Personalized Learning Path feature
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
  PathGenerationParams
} from './types';

/**
 * Determines the appropriate starting proficiency level based on assessment results
 * @param assessmentResults Array of assessment results for a specific subject
 * @param subjectId The subject ID to filter results for
 * @returns The calculated proficiency level
 */
export function determineStartingProficiency(
  assessmentResults: AssessmentResult[],
  subjectId: string
): ProficiencyLevel {
  // Filter results for the specific subject
  const subjectResults = assessmentResults.filter(result => result.subjectId === subjectId);
  
  if (subjectResults.length === 0) {
    return ProficiencyLevel.BEGINNER;
  }
  
  // Calculate average score
  const totalScore = subjectResults.reduce((sum, result) => sum + result.score, 0);
  const averageScore = totalScore / subjectResults.length;
  
  // Determine proficiency level based on average score
  if (averageScore >= 90) {
    return ProficiencyLevel.MASTERY;
  } else if (averageScore >= 80) {
    return ProficiencyLevel.EXCEEDING;
  } else if (averageScore >= 65) {
    return ProficiencyLevel.SECURE;
  } else if (averageScore >= 50) {
    return ProficiencyLevel.DEVELOPING;
  } else {
    return ProficiencyLevel.BEGINNER;
  }
}

/**
 * Identifies prerequisite topics that need to be included in the learning path
 * @param topics Array of all available curriculum topics
 * @param targetTopicIds Array of topic IDs that are the primary focus
 * @returns Array of prerequisite topic IDs that should be included
 */
export function identifyPrerequisites(
  topics: CurriculumTopic[],
  targetTopicIds: string[]
): string[] {
  const prerequisites: Set<string> = new Set();
  const processedTopics: Set<string> = new Set();
  
  // Helper function to recursively find prerequisites
  function findPrerequisites(topicId: string) {
    if (processedTopics.has(topicId)) {
      return;
    }
    
    processedTopics.add(topicId);
    const topic = topics.find(t => t.id === topicId);
    
    if (!topic) {
      return;
    }
    
    for (const prereqId of topic.prerequisites) {
      prerequisites.add(prereqId);
      findPrerequisites(prereqId);
    }
  }
  
  // Process each target topic
  for (const topicId of targetTopicIds) {
    findPrerequisites(topicId);
  }
  
  return Array.from(prerequisites);
}

/**
 * Filters learning resources based on user's learning style and interests
 * @param resources Array of all available learning resources for a topic
 * @param userProfile The user's learning profile
 * @returns Array of resources sorted by relevance to the user
 */
export function filterResourcesByUserPreferences(
  resources: LearningResource[],
  userProfile: UserLearningProfile
): LearningResource[] {
  return resources
    .map(resource => {
      let score = 0;
      
      // Score based on learning style match
      if (resource.learningStyles.includes(userProfile.dominantLearningStyle)) {
        score += 3;
      }
      
      if (userProfile.secondaryLearningStyle && 
          resource.learningStyles.includes(userProfile.secondaryLearningStyle)) {
        score += 1;
      }
      
      // Score based on interest match
      const interestMatchCount = resource.interestCategories.filter(
        category => userProfile.interests.includes(category)
      ).length;
      
      score += interestMatchCount * 2;
      
      return { resource, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.resource);
}

/**
 * Generates a sequence of topics based on prerequisites and difficulty
 * @param topics Array of curriculum topics to sequence
 * @returns Array of topic IDs in optimal learning sequence
 */
export function generateTopicSequence(topics: CurriculumTopic[]): string[] {
  // Create a map of topics by ID for quick lookup
  const topicMap = new Map<string, CurriculumTopic>();
  topics.forEach(topic => topicMap.set(topic.id, topic));
  
  // Create a map to track dependencies
  const dependencyCount = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  
  // Initialize dependency counts
  topics.forEach(topic => {
    dependencyCount.set(topic.id, topic.prerequisites.length);
    
    // Register this topic as a dependent of each prerequisite
    topic.prerequisites.forEach(prereqId => {
      if (!dependents.has(prereqId)) {
        dependents.set(prereqId, []);
      }
      dependents.get(prereqId)?.push(topic.id);
    });
  });
  
  // Find topics with no prerequisites
  const sequence: string[] = [];
  const queue: string[] = [];
  
  topics.forEach(topic => {
    if ((dependencyCount.get(topic.id) || 0) === 0) {
      queue.push(topic.id);
    }
  });
  
  // Process the queue (topological sort)
  while (queue.length > 0) {
    // Sort the current queue by difficulty and order
    const currentBatch = [...queue];
    queue.length = 0;
    
    currentBatch.sort((a, b) => {
      const topicA = topicMap.get(a)!;
      const topicB = topicMap.get(b)!;
      
      // First sort by difficulty
      if (topicA.difficulty !== topicB.difficulty) {
        return topicA.difficulty - topicB.difficulty;
      }
      
      // Then by order
      return topicA.order - topicB.order;
    });
    
    // Add sorted batch to sequence
    for (const topicId of currentBatch) {
      sequence.push(topicId);
      
      // Update dependents
      const topicDependents = dependents.get(topicId) || [];
      for (const dependentId of topicDependents) {
        const count = dependencyCount.get(dependentId) || 0;
        if (count > 0) {
          dependencyCount.set(dependentId, count - 1);
          if (count - 1 === 0) {
            queue.push(dependentId);
          }
        }
      }
    }
  }
  
  return sequence;
}

/**
 * Adjusts the difficulty of learning units based on user proficiency
 * @param units Array of learning path units
 * @param proficiencyLevel User's proficiency level
 * @param adaptationLevel How much to adapt (1-10)
 * @returns Array of adjusted learning path units
 */
export function adjustUnitDifficulty(
  units: LearningPathUnit[],
  proficiencyLevel: ProficiencyLevel,
  adaptationLevel: number
): LearningPathUnit[] {
  // Difficulty adjustment factor based on proficiency
  let difficultyFactor = 0;
  
  switch (proficiencyLevel) {
    case ProficiencyLevel.BEGINNER:
      difficultyFactor = -2;
      break;
    case ProficiencyLevel.DEVELOPING:
      difficultyFactor = -1;
      break;
    case ProficiencyLevel.SECURE:
      difficultyFactor = 0;
      break;
    case ProficiencyLevel.EXCEEDING:
      difficultyFactor = 1;
      break;
    case ProficiencyLevel.MASTERY:
      difficultyFactor = 2;
      break;
  }
  
  // Scale the adjustment based on adaptation level (1-10)
  const scaledFactor = difficultyFactor * (adaptationLevel / 10);
  
  // Apply the adjustment to each unit
  return units.map(unit => {
    // Clone the unit to avoid mutating the original
    const adjustedUnit = { ...unit };
    
    // Filter resources based on adjusted difficulty
    adjustedUnit.resources = unit.resources.filter(resource => {
      const adjustedDifficulty = resource.difficulty + scaledFactor;
      return adjustedDifficulty >= 1 && adjustedDifficulty <= 10;
    });
    
    return adjustedUnit;
  });
}

/**
 * Estimates the completion date for a learning path
 * @param units Array of learning path units
 * @param learningPace User's learning pace (1-10)
 * @param startDate Starting date for the path
 * @returns Estimated completion date
 */
export function estimateCompletionDate(
  units: LearningPathUnit[],
  learningPace: number,
  startDate: Date
): Date {
  // Calculate total estimated duration
  const totalDuration = units.reduce((sum, unit) => sum + unit.estimatedDuration, 0);
  
  // Adjust based on learning pace (1=slow, 10=fast)
  // A pace of 5 is considered average
  const paceAdjustment = 5 / learningPace;
  const adjustedDuration = totalDuration * paceAdjustment;
  
  // Assume an average of 30 minutes of learning per day
  const daysToComplete = Math.ceil(adjustedDuration / 30);
  
  // Calculate completion date
  const completionDate = new Date(startDate);
  completionDate.setDate(completionDate.getDate() + daysToComplete);
  
  return completionDate;
}

/**
 * Generates a personalized learning path based on user profile and parameters
 * @param params Path generation parameters
 * @param topics Available curriculum topics
 * @param resources Available learning resources
 * @param userProfile User's learning profile
 * @param assessmentResults User's assessment results
 * @returns A personalized learning path
 */
export function generatePersonalizedPath(
  params: PathGenerationParams,
  topics: CurriculumTopic[],
  resources: LearningResource[],
  userProfile: UserLearningProfile,
  assessmentResults: AssessmentResult[]
): LearningPath {
  // Filter topics by subject and key stage
  const filteredTopics = topics.filter(
    topic => topic.subjectId === params.subjectId && topic.keyStage === params.keyStage
  );
  
  // Determine starting proficiency if not provided
  const startingProficiency = params.startingProficiencyLevel || 
    determineStartingProficiency(assessmentResults, params.subjectId);
  
  // Identify focus topics and prerequisites
  let targetTopicIds = params.focusTopics || filteredTopics.map(topic => topic.id);
  
  // Exclude specified topics
  if (params.excludeTopics && params.excludeTopics.length > 0) {
    targetTopicIds = targetTopicIds.filter(id => !params.excludeTopics!.includes(id));
  }
  
  // Include prerequisites if specified
  if (params.includePrerequisites) {
    const prerequisiteIds = identifyPrerequisites(topics, targetTopicIds);
    targetTopicIds = [...new Set([...prerequisiteIds, ...targetTopicIds])];
  }
  
  // Generate optimal sequence
  const topicsToInclude = filteredTopics.filter(topic => targetTopicIds.includes(topic.id));
  const topicSequence = generateTopicSequence(topicsToInclude);
  
  // Create learning path units
  const units: LearningPathUnit[] = topicSequence.map(topicId => {
    const topic = filteredTopics.find(t => t.id === topicId)!;
    
    // Filter resources for this topic
    const topicResources = resources.filter(r => r.topicIds.includes(topicId));
    
    // Adapt resources based on user preferences if specified
    let adaptedResources = topicResources;
    if (params.adaptToLearningStyle || params.adaptToInterests) {
      adaptedResources = filterResourcesByUserPreferences(topicResources, userProfile);
    }
    
    return {
      id: `unit-${topicId}`,
      title: topic.name,
      description: topic.description,
      topicId: topic.id,
      status: TopicStatus.LOCKED,
      progress: 0,
      resources: adaptedResources,
      assessments: [],
      estimatedDuration: topic.estimatedDuration,
      actualDuration: 0,
      startedAt: null,
      completedAt: null,
      proficiencyLevel: null,
      nextReviewDate: null
    };
  });
  
  // Adjust first unit to be available
  if (units.length > 0) {
    units[0].status = TopicStatus.AVAILABLE;
  }
  
  // Adjust difficulty based on proficiency
  const adjustedUnits = adjustUnitDifficulty(units, startingProficiency, params.difficulty);
  
  // Create the learning path
  const now = new Date();
  const path: LearningPath = {
    id: `path-${params.userId}-${params.subjectId}-${now.getTime()}`,
    userId: params.userId,
    subjectId: params.subjectId,
    keyStage: params.keyStage,
    title: `${params.subjectId.charAt(0).toUpperCase() + params.subjectId.slice(1)} Learning Path`,
    description: `Personalized learning path for ${params.subjectId} at ${params.keyStage} level`,
    units: adjustedUnits,
    createdAt: now,
    updatedAt: now,
    overallProgress: 0,
    estimatedCompletionDate: estimateCompletionDate(
      adjustedUnits, 
      userProfile.learningPace, 
      now
    ),
    adaptationLevel: params.difficulty,
    lastAssessmentDate: null
  };
  
  return path;
}

/**
 * Updates a learning path based on new assessment results
 * @param path Current learning path
 * @param newAssessmentResults New assessment results
 * @param topics Available curriculum topics
 * @param resources Available learning resources
 * @param userProfile User's learning profile
 * @returns Updated learning path and adaptation event
 */
export function adaptPathBasedOnAssessment(
  path: LearningPath,
  newAssessmentResults: AssessmentResult[],
  topics: CurriculumTopic[],
  resources: LearningResource[],
  userProfile: UserLearningProfile
): { updatedPath: LearningPath, adaptationEvent: any } {
  // Clone the path to avoid mutating the original
  const updatedPath = { ...path, units: [...path.units] };
  
  // Track changes for the adaptation event
  const changes = {
    addedUnits: [] as string[],
    removedUnits: [] as string[],
    reorderedUnits: false,
    difficultyChanged: false,
    resourcesChanged: false
  };
  
  // Update unit status and progress based on assessment results
  for (const result of newAssessmentResults) {
    const unitIndex = updatedPath.units.findIndex(unit => unit.topicId === result.topicId);
    
    if (unitIndex >= 0) {
      const unit = updatedPath.units[unitIndex];
      
      // Update unit with assessment result
      updatedPath.units[unitIndex] = {
        ...unit,
        proficiencyLevel: result.proficiencyLevel,
        progress: Math.round((result.score / 100) * 100),
        status: result.score >= 80 ? TopicStatus.COMPLETED : TopicStatus.IN_PROGRESS
      };
      
      // If completed, unlock the next unit
      if (result.score >= 80 && unitIndex < updatedPath.units.length - 1) {
        updatedPath.units[unitIndex + 1].status = TopicStatus.AVAILABLE;
      }
      
      // If struggling, adjust resources
      if (result.score < 50) {
        const topicResources = resources.filter(r => r.topicIds.includes(result.topicId));
        const adaptedResources = filterResourcesByUserPreferences(topicResources, userProfile);
        
        // Find easier resources
        const easierResources = adaptedResources.filter(r => r.difficulty <= 5);
        
        if (easierResources.length > 0) {
          updatedPath.units[unitIndex].resources = easierResources;
          changes.resourcesChanged = true;
        }
      }
    }
  }
  
  // Calculate overall progress
  const totalUnits = updatedPath.units.length;
  const completedUnits = updatedPath.units.filter(
    unit => unit.status === TopicStatus.COMPLETED || unit.status === TopicStatus.MASTERED
  ).length;
  
  updatedPath.overallProgress = Math.round((completedUnits / totalUnits) * 100);
  updatedPath.lastAssessmentDate = new Date();
  updatedPath.updatedAt = new Date();
  
  // Create adaptation event
  const adaptationEvent = {
    id: `adapt-${updatedPath.id}-${updatedPath.updatedAt.getTime()}`,
    pathId: updatedPath.id,
    timestamp: updatedPath.updatedAt,
    triggerType: 'assessment',
    changes,
    reason: 'Assessment results triggered path adaptation',
    performedBy: null
  };
  
  return { updatedPath, adaptationEvent };
}
