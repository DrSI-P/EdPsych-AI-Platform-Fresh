import { 
  CurriculumContent, 
  ContentMetadata,
  ContentSearchFilters,
  ContentDifficultyLevel
} from '@/lib/curriculum-content/types';
import { 
  LearningStyle, 
  UKKeyStage, 
  UKSubject, 
  LearningPathItem,
  LearningProfile,
  ProficiencyLevel,
  AssessmentResult
} from '@/lib/learning-path/types';
import { searchCurriculumContent } from '@/lib/curriculum-content/api';
import { 
  determineStartingProficiencyLevel, 
  identifyPrerequisites,
  filterResourcesByLearningStyle,
  filterResourcesByInterests
} from '@/lib/learning-path/utils';

/**
 * Integrates curriculum content with personalized learning paths
 * Provides functions for content discovery, selection, and adaptation
 */

/**
 * Find curriculum content matching learning path requirements
 * @param keyStage The UK key stage
 * @param subject The subject
 * @param topics Optional list of topics to filter by
 * @param proficiencyLevel The student's proficiency level
 * @param learningStyle The student's preferred learning style
 * @param interests Optional list of student interests for content filtering
 * @returns Promise resolving to matching curriculum content
 */
export async function findMatchingCurriculumContent(
  keyStage: UKKeyStage,
  subject: UKSubject,
  topics: string[] = [],
  proficiencyLevel: ProficiencyLevel,
  learningStyle: LearningStyle,
  interests: string[] = []
): Promise<CurriculumContent[]> {
  try {
    // Map proficiency level to content difficulty
    const difficultyLevel = mapProficiencyToDifficulty(proficiencyLevel);
    
    // Create search filters
    const filters: ContentSearchFilters = {
      keyStage: [keyStage],
      subject: [subject],
      difficultyLevel: [difficultyLevel]
    };
    
    // Add topics if provided
    if (topics.length > 0) {
      filters.topics = topics;
    }
    
    // Search for matching content
    const searchResults = await searchCurriculumContent(filters);
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return [];
    }
    
    // Fetch full content for each result
    const contentPromises = searchResults.results.map(async (metadata: ContentMetadata) => {
      // In a real implementation, this would fetch the full content
      // For now, we'll create a placeholder
      return {
        metadata,
        variants: [],
        defaultVariant: null
      } as unknown as CurriculumContent;
    });
    
    let matchingContent = await Promise.all(contentPromises);
    
    // Filter by learning style if specified
    if (learningStyle) {
      matchingContent = filterContentByLearningStyle(matchingContent, learningStyle);
    }
    
    // Filter by interests if provided
    if (interests.length > 0) {
      matchingContent = filterContentByInterests(matchingContent, interests);
    }
    
    return matchingContent;
  } catch (error) {
    console.error('Error finding matching curriculum content:', error);
    throw error;
  }
}

/**
 * Generate learning path items from curriculum content
 * @param content The curriculum content to convert
 * @param learningProfile The student's learning profile
 * @returns Array of learning path items
 */
export function generateLearningPathItemsFromContent(
  content: CurriculumContent[],
  learningProfile: LearningProfile
): LearningPathItem[] {
  return content.map(item => {
    // Find the appropriate variant for the student's learning style
    const variant = item.variants.find(v => v.learningStyle === learningProfile.learningStyle) || item.defaultVariant;
    
    return {
      id: `path-item-${item.metadata.id}`,
      title: item.metadata.title,
      description: item.metadata.description,
      contentId: item.metadata.id,
      keyStage: item.metadata.keyStage,
      subject: item.metadata.subject,
      topics: item.metadata.topics || [],
      learningObjectives: item.metadata.learningObjectives || [],
      estimatedDuration: item.metadata.estimatedDuration || 30,
      contentType: item.metadata.contentType,
      contentFormat: item.metadata.contentFormat,
      difficultyLevel: item.metadata.difficultyLevel,
      variantId: variant?.id,
      learningStyle: learningProfile.learningStyle,
      completed: false,
      startedAt: null,
      completedAt: null,
      score: null,
      prerequisiteIds: item.metadata.prerequisiteIds || []
    };
  });
}

/**
 * Adapt learning path based on assessment results
 * @param currentPath The current learning path items
 * @param assessmentResults Recent assessment results
 * @param learningProfile The student's learning profile
 * @returns Promise resolving to updated learning path items
 */
export async function adaptLearningPathWithContent(
  currentPath: LearningPathItem[],
  assessmentResults: AssessmentResult[],
  learningProfile: LearningProfile
): Promise<LearningPathItem[]> {
  try {
    // Identify areas needing reinforcement based on assessment results
    const areasNeedingReinforcement = assessmentResults
      .filter(result => result.proficiencyLevel < ProficiencyLevel.PROFICIENT)
      .map(result => ({
        subject: result.subject,
        topics: result.topics,
        proficiencyLevel: result.proficiencyLevel
      }));
    
    if (areasNeedingReinforcement.length === 0) {
      // No reinforcement needed, return current path
      return currentPath;
    }
    
    // Find additional content for areas needing reinforcement
    const additionalContentPromises = areasNeedingReinforcement.map(area => 
      findMatchingCurriculumContent(
        learningProfile.keyStage,
        area.subject,
        area.topics,
        area.proficiencyLevel,
        learningProfile.learningStyle,
        learningProfile.interests
      )
    );
    
    const additionalContentArrays = await Promise.all(additionalContentPromises);
    const additionalContent = additionalContentArrays.flat();
    
    // Convert to learning path items
    const additionalPathItems = generateLearningPathItemsFromContent(
      additionalContent,
      learningProfile
    );
    
    // Filter out items already in the path
    const existingContentIds = currentPath.map(item => item.contentId);
    const newPathItems = additionalPathItems.filter(
      item => !existingContentIds.includes(item.contentId)
    );
    
    // Determine optimal insertion points in the current path
    const updatedPath = [...currentPath];
    
    for (const newItem of newPathItems) {
      // Find related items in the current path
      const relatedItemIndex = updatedPath.findIndex(
        item => item.subject === newItem.subject && 
               item.topics.some(topic => newItem.topics.includes(topic))
      );
      
      if (relatedItemIndex >= 0) {
        // Insert after the related item
        updatedPath.splice(relatedItemIndex + 1, 0, newItem);
      } else {
        // Add to the end of the path
        updatedPath.push(newItem);
      }
    }
    
    return updatedPath;
  } catch (error) {
    console.error('Error adapting learning path with content:', error);
    throw error;
  }
}

/**
 * Filter curriculum content by learning style
 * @param content Array of curriculum content
 * @param learningStyle The preferred learning style
 * @returns Filtered curriculum content
 */
function filterContentByLearningStyle(
  content: CurriculumContent[],
  learningStyle: LearningStyle
): CurriculumContent[] {
  return content.filter(item => 
    item.variants.some(variant => variant.learningStyle === learningStyle)
  );
}

/**
 * Filter curriculum content by student interests
 * @param content Array of curriculum content
 * @param interests Student interests
 * @returns Filtered curriculum content
 */
function filterContentByInterests(
  content: CurriculumContent[],
  interests: string[]
): CurriculumContent[] {
  // If no interests provided, return all content
  if (!interests || interests.length === 0) {
    return content;
  }
  
  // Score content based on relevance to interests
  const scoredContent = content.map(item => {
    let score = 0;
    
    // Check keywords for matches with interests
    if (item.metadata.keywords) {
      item.metadata.keywords.forEach(keyword => {
        if (interests.some(interest => 
          keyword.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(keyword.toLowerCase())
        )) {
          score += 1;
        }
      });
    }
    
    // Check title and description for matches
    interests.forEach(interest => {
      if (item.metadata.title.toLowerCase().includes(interest.toLowerCase())) {
        score += 2;
      }
      if (item.metadata.description.toLowerCase().includes(interest.toLowerCase())) {
        score += 1;
      }
    });
    
    return { content: item, score };
  });
  
  // Sort by score (descending) and filter out low-relevance items
  return scoredContent
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .map(item => item.content);
}

/**
 * Map proficiency level to content difficulty level
 * @param proficiencyLevel The student's proficiency level
 * @returns Appropriate content difficulty level
 */
function mapProficiencyToDifficulty(
  proficiencyLevel: ProficiencyLevel
): ContentDifficultyLevel {
  switch (proficiencyLevel) {
    case ProficiencyLevel.BEGINNER:
      return ContentDifficultyLevel.FOUNDATION;
    case ProficiencyLevel.DEVELOPING:
      return ContentDifficultyLevel.CORE;
    case ProficiencyLevel.PROFICIENT:
      return ContentDifficultyLevel.EXTENDED;
    case ProficiencyLevel.ADVANCED:
      return ContentDifficultyLevel.ADVANCED;
    default:
      return ContentDifficultyLevel.CORE;
  }
}

/**
 * Get recommended next content based on learning profile and progress
 * @param learningProfile The student's learning profile
 * @param completedContentIds Array of completed content IDs
 * @returns Promise resolving to recommended content
 */
export async function getRecommendedNextContent(
  learningProfile: LearningProfile,
  completedContentIds: string[]
): Promise<CurriculumContent[]> {
  try {
    // Create search filters based on learning profile
    const filters: ContentSearchFilters = {
      keyStage: [learningProfile.keyStage],
      subject: [learningProfile.currentSubject]
    };
    
    // Search for matching content
    const searchResults = await searchCurriculumContent(filters);
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return [];
    }
    
    // Filter out already completed content
    const newContentMetadata = searchResults.results.filter(
      metadata => !completedContentIds.includes(metadata.id)
    );
    
    // Fetch full content for each result
    const contentPromises = newContentMetadata.map(async (metadata: ContentMetadata) => {
      // In a real implementation, this would fetch the full content
      // For now, we'll create a placeholder
      return {
        metadata,
        variants: [],
        defaultVariant: null
      } as unknown as CurriculumContent;
    });
    
    let recommendedContent = await Promise.all(contentPromises);
    
    // Filter by learning style
    recommendedContent = filterContentByLearningStyle(
      recommendedContent, 
      learningProfile.learningStyle
    );
    
    // Filter by interests if available
    if (learningProfile.interests && learningProfile.interests.length > 0) {
      recommendedContent = filterContentByInterests(
        recommendedContent,
        learningProfile.interests
      );
    }
    
    // Sort by relevance to current learning goals
    // This would involve more sophisticated logic in a real implementation
    
    return recommendedContent;
  } catch (error) {
    console.error('Error getting recommended next content:', error);
    throw error;
  }
}

/**
 * Check for learning gaps based on curriculum coverage
 * @param learningProfile The student's learning profile
 * @param completedContentIds Array of completed content IDs
 * @returns Promise resolving to content addressing identified gaps
 */
export async function identifyLearningGaps(
  learningProfile: LearningProfile,
  completedContentIds: string[]
): Promise<CurriculumContent[]> {
  try {
    // In a real implementation, this would analyze the curriculum structure
    // to identify topics or skills that haven't been covered
    
    // For now, we'll create a simplified implementation that looks for
    // core content that hasn't been completed
    
    const filters: ContentSearchFilters = {
      keyStage: [learningProfile.keyStage],
      subject: [learningProfile.currentSubject],
      difficultyLevel: [ContentDifficultyLevel.CORE]
    };
    
    // Search for core content
    const searchResults = await searchCurriculumContent(filters);
    
    if (!searchResults.results || searchResults.results.length === 0) {
      return [];
    }
    
    // Identify content that hasn't been completed
    const gapContentMetadata = searchResults.results.filter(
      metadata => !completedContentIds.includes(metadata.id)
    );
    
    // Fetch full content for each result
    const contentPromises = gapContentMetadata.map(async (metadata: ContentMetadata) => {
      // In a real implementation, this would fetch the full content
      return {
        metadata,
        variants: [],
        defaultVariant: null
      } as unknown as CurriculumContent;
    });
    
    const gapContent = await Promise.all(contentPromises);
    
    return gapContent;
  } catch (error) {
    console.error('Error identifying learning gaps:', error);
    throw error;
  }
}
