/**
 * Content Creation Service
 * 
 * This service provides the core functionality for the Content Creation Studio,
 * including content management, AI generation, and collaboration features.
 */

import {
  ContentMetadata,
  ContentDocument,
  ContentLibraryFilter,
  ContentSharingInvitation,
  ContentExportOptions,
  AIGenerationPrompt,
  ContentTemplate,
  ContentType,
  KeyStage,
  LearningStyle,
  SENCategory,
  ContentElement,
  ContentElementType,
  ContentPermission,
  ContentExportFormat
} from './types';

/**
 * Content Creation Service Implementation
 */
export class ContentCreationService {
  private apiUrl: string;
  private userId: string;

  constructor(apiUrl: string, userId: string) {
    this.apiUrl = apiUrl;
    this.userId = userId;
  }

  /**
   * Initialize the content creation service
   */
  public async initialize(): Promise<boolean> {
    try {
      // Verify API connection and user permissions
      const response = await fetch(`${this.apiUrl}/api/content-creation/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: this.userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize content creation service: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Content creation service initialization failed:', error);
      return false;
    }
  }

  /**
   * Create new content with the provided metadata
   */
  public async createContent(metadata: ContentMetadata): Promise<string> {
    try {
      // Ensure required fields
      const contentMetadata: ContentMetadata = {
        ...metadata,
        authorId: this.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        isPublished: false,
        keywords: metadata.keywords || [],
        permission: metadata.permission || ContentPermission.PRIVATE
      };

      const response = await fetch(`${this.apiUrl}/api/content-creation/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metadata: contentMetadata }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create content: ${response.statusText}`);
      }

      const data = await response.json();
      return data.contentId;
    } catch (error) {
      console.error('Failed to create content:', error);
      throw error;
    }
  }

  /**
   * Get content by ID
   */
  public async getContent(id: string): Promise<ContentDocument> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get content: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error(`Failed to get content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update existing content
   */
  public async updateContent(id: string, content: Partial<ContentDocument>): Promise<void> {
    try {
      // Update the version and modified date
      const updatedContent = {
        ...content,
        metadata: {
          ...(content.metadata || {}),
          updatedAt: new Date(),
          version: (content.version || 1) + 1
        }
      };

      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update content: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to update content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete content by ID
   */
  public async deleteContent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete content: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to delete content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Publish content
   */
  public async publishContent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to publish content: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to publish content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Unpublish content
   */
  public async unpublishContent(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${id}/unpublish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to unpublish content: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to unpublish content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * List content based on filters
   */
  public async listContent(filter: ContentLibraryFilter): Promise<ContentMetadata[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filter }),
      });

      if (!response.ok) {
        throw new Error(`Failed to list content: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Failed to list content:', error);
      throw error;
    }
  }

  /**
   * Share content with other users
   */
  public async shareContent(invitation: ContentSharingInvitation): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invitation }),
      });

      if (!response.ok) {
        throw new Error(`Failed to share content: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to share content:', error);
      throw error;
    }
  }

  /**
   * Export content in various formats
   */
  public async exportContent(id: string, options: ContentExportOptions): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${id}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ options }),
      });

      if (!response.ok) {
        throw new Error(`Failed to export content: ${response.statusText}`);
      }

      const data = await response.json();
      return data.exportUrl;
    } catch (error) {
      console.error(`Failed to export content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Generate content using AI
   */
  public async generateWithAI(prompt: AIGenerationPrompt): Promise<Partial<ContentDocument>> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate content with AI: ${response.statusText}`);
      }

      const data = await response.json();
      return data.generatedContent;
    } catch (error) {
      console.error('Failed to generate content with AI:', error);
      throw error;
    }
  }

  /**
   * Get content templates
   */
  public async getTemplates(filter?: Partial<ContentTemplate>): Promise<ContentTemplate[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filter }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get templates: ${response.statusText}`);
      }

      const data = await response.json();
      return data.templates;
    } catch (error) {
      console.error('Failed to get templates:', error);
      throw error;
    }
  }

  /**
   * Create a new template
   */
  public async createTemplate(template: Omit<ContentTemplate, 'id'>): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ template }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create template: ${response.statusText}`);
      }

      const data = await response.json();
      return data.templateId;
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  }

  /**
   * Get default templates for different content types and key stages
   */
  public async getDefaultTemplates(): Promise<Record<ContentType, Record<KeyStage, ContentTemplate[]>>> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/templates/default`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get default templates: ${response.statusText}`);
      }

      const data = await response.json();
      return data.defaultTemplates;
    } catch (error) {
      console.error('Failed to get default templates:', error);
      throw error;
    }
  }

  /**
   * Adapt content for specific learning styles or SEN categories
   */
  public async adaptContent(
    contentId: string, 
    targetLearningStyles: any[], 
    senSupport?: SENCategory[]
  ): Promise<Partial<ContentDocument>> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/ai/adapt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contentId,
          targetLearningStyles,
          senSupport
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to adapt content: ${response.statusText}`);
      }

      const data = await response.json();
      return data.adaptedContent;
    } catch (error) {
      console.error(`Failed to adapt content with ID ${contentId}:`, error);
      throw error;
    }
  }

  /**
   * Get content analytics
   */
  public async getContentAnalytics(contentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${contentId}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get content analytics: ${response.statusText}`);
      }

      const data = await response.json();
      return data.analytics;
    } catch (error) {
      console.error(`Failed to get analytics for content with ID ${contentId}:`, error);
      throw error;
    }
  }

  /**
   * Add feedback for content
   */
  public async addContentFeedback(
    contentId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${contentId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          rating,
          comment,
          timestamp: new Date()
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add content feedback: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to add feedback for content with ID ${contentId}:`, error);
      throw error;
    }
  }

  /**
   * Check content for curriculum alignment
   */
  public async checkCurriculumAlignment(contentId: string): Promise<{
    alignmentScore: number;
    suggestions: any[];
    curriculumLinks: any[];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${contentId}/curriculum-check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check curriculum alignment: ${response.statusText}`);
      }

      const data = await response.json();
      return data.alignmentData;
    } catch (error) {
      console.error(`Failed to check curriculum alignment for content with ID ${contentId}:`, error);
      throw error;
    }
  }

  /**
   * Check content for accessibility compliance
   */
  public async checkAccessibility(contentId: string): Promise<{
    accessibilityScore: number;
    issues: {
      severity: 'critical' | 'serious' | 'moderate' | 'minor';
      description: string;
      recommendation: string;
    }[];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/content-creation/content/${contentId}/accessibility-check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check accessibility: ${response.statusText}`);
      }

      const data = await response.json();
      return data.accessibilityData;
    } catch (error) {
      console.error(`Failed to check accessibility for content with ID ${contentId}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
let contentCreationServiceInstance: ContentCreationService | null = null;

export const initializeContentCreationService = async (
  apiUrl: string,
  userId: string
): Promise<ContentCreationService> => {
  if (!contentCreationServiceInstance) {
    contentCreationServiceInstance = new ContentCreationService(apiUrl, userId);
    await contentCreationServiceInstance.initialize();
  }
  return contentCreationServiceInstance;
};

export const getContentCreationService = (): ContentCreationService => {
  if (!contentCreationServiceInstance) {
    throw new Error('Content creation service not initialized. Call initializeContentCreationService first.');
  }
  return contentCreationServiceInstance;
};
