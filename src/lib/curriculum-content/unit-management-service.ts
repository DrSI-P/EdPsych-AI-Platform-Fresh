/**
 * Curriculum Unit Management Service
 * Provides functionality for managing curriculum units and content organization
 */

import { 
  CurriculumUnit,
  ContentMetadata,
  UKKeyStage,
  UKSubject,
  ContentStatus
} from './types';
import { createCurriculumUnit } from './api';

/**
 * Unit content item interface
 */
export interface UnitContentItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  keyStage: UKKeyStage;
  subject: UKSubject;
  status: ContentStatus;
  order: number;
}

/**
 * Create a new curriculum unit
 */
export async function createUnit(
  title: string,
  description: string,
  keyStage: UKKeyStage,
  subject: UKSubject,
  contentIds: string[] = [],
  learningObjectives: string[] = [],
  prerequisiteUnitIds: string[] = []
): Promise<CurriculumUnit> {
  const unit: Partial<CurriculumUnit> = {
    title,
    description,
    keyStage,
    subject,
    contentIds,
    learningObjectives,
    prerequisiteUnitIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user', // In a real implementation, this would be the current user ID
    updatedBy: 'current-user', // In a real implementation, this would be the current user ID
    status: ContentStatus.DRAFT
  };
  
  return await createCurriculumUnit(unit);
}

/**
 * Get available curriculum units
 */
export async function getAvailableUnits(): Promise<CurriculumUnit[]> {
  try {
    const response = await fetch('/api/curriculum-units');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch curriculum units: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching curriculum units:', error);
    
    // Return mock data for development/testing
    return getMockCurriculumUnits();
  }
}

/**
 * Get curriculum unit by ID
 */
export async function getUnitById(unitId: string): Promise<CurriculumUnit> {
  try {
    const response = await fetch(`/api/curriculum-units/${unitId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch curriculum unit: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching curriculum unit:', error);
    
    // Return mock data for development/testing
    const mockUnits = getMockCurriculumUnits();
    const unit = mockUnits.find(u => u.id === unitId);
    
    if (!unit) {
      throw new Error(`Unit with ID ${unitId} not found`);
    }
    
    return unit;
  }
}

/**
 * Get content items for a curriculum unit
 */
export async function getUnitContentItems(unitId: string): Promise<UnitContentItem[]> {
  try {
    const response = await fetch(`/api/curriculum-units/${unitId}/content`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch unit content items: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching unit content items:', error);
    
    // Return mock data for development/testing
    return getMockUnitContentItems(unitId);
  }
}

/**
 * Update content order in a curriculum unit
 */
export async function updateContentOrder(unitId: string, contentIds: string[]): Promise<boolean> {
  try {
    const response = await fetch(`/api/curriculum-units/${unitId}/content-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentIds }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update content order: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating content order:', error);
    return false;
  }
}

/**
 * Add content to a curriculum unit
 */
export async function addContentToUnit(unitId: string, contentId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/curriculum-units/${unitId}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentId }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add content to unit: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding content to unit:', error);
    return false;
  }
}

/**
 * Remove content from a curriculum unit
 */
export async function removeContentFromUnit(unitId: string, contentId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/curriculum-units/${unitId}/content/${contentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove content from unit: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error removing content from unit:', error);
    return false;
  }
}

/**
 * Get prerequisite units for a curriculum unit
 */
export async function getPrerequisiteUnits(unitId: string): Promise<CurriculumUnit[]> {
  try {
    const response = await fetch(`/api/curriculum-units/${unitId}/prerequisites`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prerequisite units: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching prerequisite units:', error);
    
    // Return mock data for development/testing
    const unit = await getUnitById(unitId);
    const allUnits = await getAvailableUnits();
    
    return allUnits.filter(u => unit.prerequisiteUnitIds?.includes(u.id) || false);
  }
}

/**
 * Generate mock curriculum units for development/testing
 */
function getMockCurriculumUnits(): CurriculumUnit[] {
  return [
    {
      id: 'unit-1',
      title: 'Introduction to Fractions',
      description: 'A comprehensive introduction to fractions for Key Stage 2',
      keyStage: 'KS2',
      subject: 'Mathematics',
      contentIds: ['content-123', 'content-124', 'content-125'],
      learningObjectives: [
        'Understand what fractions are',
        'Recognize and write fractions',
        'Compare and order fractions',
        'Add and subtract fractions with the same denominator'
      ],
      prerequisiteUnitIds: [],
      createdAt: '2025-05-01T10:00:00Z',
      updatedAt: '2025-05-15T14:30:00Z',
      createdBy: 'John Smith',
      updatedBy: 'Jane Doe',
      status: ContentStatus.PUBLISHED
    },
    {
      id: 'unit-2',
      title: 'Advanced Fractions',
      description: 'Advanced concepts in fractions for Key Stage 2',
      keyStage: 'KS2',
      subject: 'Mathematics',
      contentIds: ['content-126', 'content-127', 'content-128'],
      learningObjectives: [
        'Add and subtract fractions with different denominators',
        'Multiply fractions',
        'Divide fractions',
        'Solve word problems involving fractions'
      ],
      prerequisiteUnitIds: ['unit-1'],
      createdAt: '2025-05-05T11:15:00Z',
      updatedAt: '2025-05-20T09:45:00Z',
      createdBy: 'John Smith',
      updatedBy: 'John Smith',
      status: ContentStatus.PUBLISHED
    },
    {
      id: 'unit-3',
      title: 'Introduction to Decimals',
      description: 'A comprehensive introduction to decimals for Key Stage 2',
      keyStage: 'KS2',
      subject: 'Mathematics',
      contentIds: ['content-129', 'content-130', 'content-131'],
      learningObjectives: [
        'Understand what decimals are',
        'Recognize and write decimals',
        'Compare and order decimals',
        'Add and subtract decimals'
      ],
      prerequisiteUnitIds: ['unit-1', 'unit-2'],
      createdAt: '2025-05-10T13:30:00Z',
      updatedAt: '2025-05-25T15:20:00Z',
      createdBy: 'Jane Doe',
      updatedBy: 'Jane Doe',
      status: ContentStatus.PUBLISHED
    },
    {
      id: 'unit-4',
      title: 'Fractions and Decimals',
      description: 'Connecting fractions and decimals for Key Stage 2',
      keyStage: 'KS2',
      subject: 'Mathematics',
      contentIds: ['content-132', 'content-133', 'content-134'],
      learningObjectives: [
        'Convert fractions to decimals',
        'Convert decimals to fractions',
        'Compare fractions and decimals',
        'Solve problems involving fractions and decimals'
      ],
      prerequisiteUnitIds: ['unit-1', 'unit-2', 'unit-3'],
      createdAt: '2025-05-15T09:00:00Z',
      updatedAt: '2025-05-30T11:10:00Z',
      createdBy: 'Jane Doe',
      updatedBy: 'John Smith',
      status: ContentStatus.DRAFT
    }
  ];
}

/**
 * Generate mock unit content items for development/testing
 */
function getMockUnitContentItems(unitId: string): UnitContentItem[] {
  const contentMap: Record<string, UnitContentItem[]> = {
    'unit-1': [
      {
        id: 'content-123',
        title: 'Introduction to Fractions',
        description: 'A comprehensive introduction to fractions for Key Stage 2',
        contentType: 'EXPLANATION',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 1
      },
      {
        id: 'content-124',
        title: 'Fractions Practice Exercises',
        description: 'Practice exercises for working with fractions',
        contentType: 'EXERCISE',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 2
      },
      {
        id: 'content-125',
        title: 'Fractions Assessment',
        description: 'Assessment for understanding of fractions',
        contentType: 'ASSESSMENT',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 3
      }
    ],
    'unit-2': [
      {
        id: 'content-126',
        title: 'Adding and Subtracting Fractions with Different Denominators',
        description: 'Learn how to add and subtract fractions with different denominators',
        contentType: 'EXPLANATION',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 1
      },
      {
        id: 'content-127',
        title: 'Multiplying and Dividing Fractions',
        description: 'Learn how to multiply and divide fractions',
        contentType: 'EXPLANATION',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 2
      },
      {
        id: 'content-128',
        title: 'Advanced Fractions Assessment',
        description: 'Assessment for understanding of advanced fraction concepts',
        contentType: 'ASSESSMENT',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 3
      }
    ],
    'unit-3': [
      {
        id: 'content-129',
        title: 'Introduction to Decimals',
        description: 'A comprehensive introduction to decimals',
        contentType: 'EXPLANATION',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 1
      },
      {
        id: 'content-130',
        title: 'Decimals Practice Exercises',
        description: 'Practice exercises for working with decimals',
        contentType: 'EXERCISE',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 2
      },
      {
        id: 'content-131',
        title: 'Decimals Assessment',
        description: 'Assessment for understanding of decimals',
        contentType: 'ASSESSMENT',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.PUBLISHED,
        order: 3
      }
    ],
    'unit-4': [
      {
        id: 'content-132',
        title: 'Converting Between Fractions and Decimals',
        description: 'Learn how to convert between fractions and decimals',
        contentType: 'EXPLANATION',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.DRAFT,
        order: 1
      },
      {
        id: 'content-133',
        title: 'Fractions and Decimals Practice',
        description: 'Practice exercises for working with fractions and decimals',
        contentType: 'EXERCISE',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.DRAFT,
        order: 2
      },
      {
        id: 'content-134',
        title: 'Fractions and Decimals Assessment',
        description: 'Assessment for understanding of fractions and decimals',
        contentType: 'ASSESSMENT',
        keyStage: 'KS2',
        subject: 'Mathematics',
        status: ContentStatus.DRAFT,
        order: 3
      }
    ]
  };
  
  return contentMap[unitId] || [];
}
