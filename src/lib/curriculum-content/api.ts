/**
 * API functions for Advanced Curriculum Content
 * Provides CRUD operations and search capabilities for curriculum content
 */

import { 
  ContentMetadata, 
  ContentVariant, 
  CurriculumContent, 
  ContentSearchFilters, 
  ContentSearchResult,
  ContentStatus,
  ContentChangeRecord,
  CurriculumUnit,
  UserContentPermission,
  ContentPermission
} from './types';

/**
 * Create new curriculum content
 */
export async function createCurriculumContent(content: Partial<CurriculumContent>): Promise<CurriculumContent> {
  try {
    const response = await fetch('/api/curriculum-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create curriculum content: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating curriculum content:', error);
    throw error;
  }
}

/**
 * Get curriculum content by ID
 */
export async function getCurriculumContent(id: string): Promise<CurriculumContent> {
  try {
    const response = await fetch(`/api/curriculum-content/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch curriculum content: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching curriculum content:', error);
    throw error;
  }
}

/**
 * Update existing curriculum content
 */
export async function updateCurriculumContent(id: string, updates: Partial<CurriculumContent>): Promise<CurriculumContent> {
  try {
    const response = await fetch(`/api/curriculum-content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update curriculum content: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating curriculum content:', error);
    throw error;
  }
}

/**
 * Delete curriculum content
 */
export async function deleteCurriculumContent(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/curriculum-content/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete curriculum content: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting curriculum content:', error);
    throw error;
  }
}

/**
 * Search curriculum content
 */
export async function searchCurriculumContent(
  filters: ContentSearchFilters, 
  page: number = 1, 
  pageSize: number = 20
): Promise<ContentSearchResult> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => acc[`${key}[]`] = v);
        } else if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    });
    
    const response = await fetch(`/api/curriculum-content/search?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to search curriculum content: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching curriculum content:', error);
    throw error;
  }
}

/**
 * Create content variant for specific learning style
 */
export async function createContentVariant(contentId: string, variant: Partial<ContentVariant>): Promise<ContentVariant> {
  try {
    const response = await fetch(`/api/curriculum-content/${contentId}/variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variant),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create content variant: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating content variant:', error);
    throw error;
  }
}

/**
 * Update content variant
 */
export async function updateContentVariant(contentId: string, variantId: string, updates: Partial<ContentVariant>): Promise<ContentVariant> {
  try {
    const response = await fetch(`/api/curriculum-content/${contentId}/variants/${variantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update content variant: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating content variant:', error);
    throw error;
  }
}

/**
 * Get content change history
 */
export async function getContentChangeHistory(contentId: string): Promise<ContentChangeRecord[]> {
  try {
    const response = await fetch(`/api/curriculum-content/${contentId}/history`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content history: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching content history:', error);
    throw error;
  }
}

/**
 * Update content status (workflow)
 */
export async function updateContentStatus(contentId: string, status: ContentStatus, comment?: string): Promise<ContentMetadata> {
  try {
    const response = await fetch(`/api/curriculum-content/${contentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, comment }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update content status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating content status:', error);
    throw error;
  }
}

/**
 * Create curriculum unit
 */
export async function createCurriculumUnit(unit: Partial<CurriculumUnit>): Promise<CurriculumUnit> {
  try {
    const response = await fetch('/api/curriculum-units', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unit),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create curriculum unit: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating curriculum unit:', error);
    throw error;
  }
}

/**
 * Get user content permissions
 */
export async function getUserContentPermissions(userId: string): Promise<UserContentPermission[]> {
  try {
    const response = await fetch(`/api/curriculum-content/permissions/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user permissions: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
}

/**
 * Update user content permissions
 */
export async function updateUserContentPermission(permission: UserContentPermission): Promise<UserContentPermission> {
  try {
    const response = await fetch('/api/curriculum-content/permissions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permission),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user permission: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user permission:', error);
    throw error;
  }
}

/**
 * Check if user has specific permission for content
 */
export async function checkUserContentPermission(
  userId: string, 
  contentId: string, 
  requiredPermission: ContentPermission
): Promise<boolean> {
  try {
    const response = await fetch(`/api/curriculum-content/permissions/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, contentId, requiredPermission }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check user permission: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.hasPermission;
  } catch (error) {
    console.error('Error checking user permission:', error);
    throw error;
  }
}
