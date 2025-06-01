/**
 * API functions for the Content Management System
 */

import { 
  ContentItem, 
  ContentCollection, 
  ContentSearchFilters, 
  ContentFeedback,
  ContentVersion,
  ReviewStatus,
  CurriculumStandard,
  LearningObjective
} from './types';

/**
 * Create a new content item
 * @param contentItem The content item to create
 * @returns The created content item
 */
export async function createContentItem(contentItem: Partial<ContentItem>): Promise<ContentItem> {
  try {
    const response = await fetch('/api/content-management/content-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentItem),
    });

    if (!response.ok) {
      throw new Error(`Failed to create content item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating content item:', error);
    throw error;
  }
}

/**
 * Get a content item by ID
 * @param id The ID of the content item
 * @returns The content item
 */
export async function getContentItem(id: string): Promise<ContentItem> {
  try {
    const response = await fetch(`/api/content-management/content-items/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to get content item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error getting content item with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update a content item
 * @param id The ID of the content item
 * @param updates The updates to apply
 * @returns The updated content item
 */
export async function updateContentItem(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
  try {
    const response = await fetch(`/api/content-management/content-items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update content item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating content item with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a content item
 * @param id The ID of the content item
 * @returns Success status
 */
export async function deleteContentItem(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/content-management/content-items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete content item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting content item with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Search for content items
 * @param filters The search filters
 * @param page The page number
 * @param limit The number of items per page
 * @returns The search results
 */
export async function searchContentItems(
  filters: ContentSearchFilters,
  page: number = 1,
  limit: number = 10
): Promise<{ items: ContentItem[]; total: number; page: number; limit: number }> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => acc[`${key}[]`] = v);
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (subValue !== undefined) {
                acc[`${key}.${subKey}`] = subValue.toString();
              }
            });
          } else {
            acc[key] = value.toString();
          }
        }
        return acc;
      }, {} as Record<string, string>),
    });

    const response = await fetch(`/api/content-management/content-items/search?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to search content items: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching content items:', error);
    throw error;
  }
}

/**
 * Change the review status of a content item
 * @param id The ID of the content item
 * @param status The new review status
 * @param comment Optional comment about the status change
 * @returns The updated content item
 */
export async function changeContentStatus(
  id: string,
  status: ReviewStatus,
  comment?: string
): Promise<ContentItem> {
  try {
    const response = await fetch(`/api/content-management/content-items/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, comment }),
    });

    if (!response.ok) {
      throw new Error(`Failed to change content status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error changing status for content item with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get version history for a content item
 * @param id The ID of the content item
 * @returns The version history
 */
export async function getContentVersionHistory(id: string): Promise<ContentVersion[]> {
  try {
    const response = await fetch(`/api/content-management/content-items/${id}/versions`);

    if (!response.ok) {
      throw new Error(`Failed to get content version history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error getting version history for content item with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Restore a previous version of a content item
 * @param contentId The ID of the content item
 * @param versionId The ID of the version to restore
 * @returns The restored content item
 */
export async function restoreContentVersion(
  contentId: string,
  versionId: string
): Promise<ContentItem> {
  try {
    const response = await fetch(`/api/content-management/content-items/${contentId}/versions/${versionId}/restore`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to restore content version: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error restoring version ${versionId} for content item with ID ${contentId}:`, error);
    throw error;
  }
}

/**
 * Create a new content collection
 * @param collection The collection to create
 * @returns The created collection
 */
export async function createContentCollection(collection: Partial<ContentCollection>): Promise<ContentCollection> {
  try {
    const response = await fetch('/api/content-management/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collection),
    });

    if (!response.ok) {
      throw new Error(`Failed to create content collection: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating content collection:', error);
    throw error;
  }
}

/**
 * Get a content collection by ID
 * @param id The ID of the collection
 * @returns The content collection
 */
export async function getContentCollection(id: string): Promise<ContentCollection> {
  try {
    const response = await fetch(`/api/content-management/collections/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to get content collection: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error getting content collection with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Update a content collection
 * @param id The ID of the collection
 * @param updates The updates to apply
 * @returns The updated collection
 */
export async function updateContentCollection(
  id: string,
  updates: Partial<ContentCollection>
): Promise<ContentCollection> {
  try {
    const response = await fetch(`/api/content-management/collections/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update content collection: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating content collection with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a content collection
 * @param id The ID of the collection
 * @returns Success status
 */
export async function deleteContentCollection(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/content-management/collections/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete content collection: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting content collection with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Add content items to a collection
 * @param collectionId The ID of the collection
 * @param contentItemIds The IDs of the content items to add
 * @returns The updated collection
 */
export async function addContentToCollection(
  collectionId: string,
  contentItemIds: string[]
): Promise<ContentCollection> {
  try {
    const response = await fetch(`/api/content-management/collections/${collectionId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentItemIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add content to collection: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error adding content to collection with ID ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Remove content items from a collection
 * @param collectionId The ID of the collection
 * @param contentItemIds The IDs of the content items to remove
 * @returns The updated collection
 */
export async function removeContentFromCollection(
  collectionId: string,
  contentItemIds: string[]
): Promise<ContentCollection> {
  try {
    const response = await fetch(`/api/content-management/collections/${collectionId}/items`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentItemIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove content from collection: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error removing content from collection with ID ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Submit feedback for a content item
 * @param feedback The feedback to submit
 * @returns The submitted feedback
 */
export async function submitContentFeedback(feedback: Partial<ContentFeedback>): Promise<ContentFeedback> {
  try {
    const response = await fetch('/api/content-management/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit content feedback: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting content feedback:', error);
    throw error;
  }
}

/**
 * Get feedback for a content item
 * @param contentId The ID of the content item
 * @returns The feedback for the content item
 */
export async function getContentFeedback(contentId: string): Promise<ContentFeedback[]> {
  try {
    const response = await fetch(`/api/content-management/feedback?contentId=${contentId}`);

    if (!response.ok) {
      throw new Error(`Failed to get content feedback: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error getting feedback for content item with ID ${contentId}:`, error);
    throw error;
  }
}

/**
 * Get curriculum standards
 * @param subject Optional subject filter
 * @param keyStage Optional key stage filter
 * @returns The curriculum standards
 */
export async function getCurriculumStandards(
  subject?: string,
  keyStage?: string
): Promise<CurriculumStandard[]> {
  try {
    const queryParams = new URLSearchParams();
    if (subject) queryParams.append('subject', subject);
    if (keyStage) queryParams.append('keyStage', keyStage);

    const response = await fetch(`/api/curriculum/standards?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to get curriculum standards: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting curriculum standards:', error);
    throw error;
  }
}

/**
 * Get learning objectives
 * @param subject Optional subject filter
 * @param keyStage Optional key stage filter
 * @returns The learning objectives
 */
export async function getLearningObjectives(
  subject?: string,
  keyStage?: string
): Promise<LearningObjective[]> {
  try {
    const queryParams = new URLSearchParams();
    if (subject) queryParams.append('subject', subject);
    if (keyStage) queryParams.append('keyStage', keyStage);

    const response = await fetch(`/api/content-management/learning-objectives?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to get learning objectives: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting learning objectives:', error);
    throw error;
  }
}

/**
 * Generate content variants for different learning styles
 * @param contentId The ID of the content item
 * @param learningStyles The learning styles to generate variants for
 * @returns The updated content item with new variants
 */
export async function generateContentVariants(
  contentId: string,
  learningStyles: string[]
): Promise<ContentItem> {
  try {
    const response = await fetch(`/api/content-management/content-items/${contentId}/variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ learningStyles }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate content variants: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error generating variants for content item with ID ${contentId}:`, error);
    throw error;
  }
}
