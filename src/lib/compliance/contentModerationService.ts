/**
 * Content Moderation Service
 * 
 * This service implements content moderation features for the EdPsych-AI-Education-Platform,
 * ensuring that all content is appropriate, safe, and aligned with educational standards.
 */

import {
  ContentModerationService,
  ContentModerationResult,
  ContentModerationAction,
  ContentModerationReason,
  AgeAppropriatenessRating,
  ContentFilteringSettings,
  SupportedLanguage
} from './types';

/**
 * Implementation of the Content Moderation Service
 * 
 * This class provides methods for moderating text, images, and documents,
 * filtering user content, and managing content filtering settings.
 */
export class ContentModerationServiceImpl implements ContentModerationService {
  // Content moderation results
  private moderationResults: Map<string, ContentModerationResult> = new Map();
  
  // User content filtering settings
  private userFilteringSettings: Map<string, ContentFilteringSettings> = new Map();
  
  // Inappropriate content patterns
  private inappropriatePatterns: Map<string, RegExp[]> = new Map();
  
  /**
   * Constructor for the Content Moderation Service
   */
  constructor() {
    this.initializeInappropriatePatterns();
  }
  
  /**
   * Moderate text content
   * 
   * @param text The text to moderate
   * @param context The context of the moderation
   * @returns The moderation result
   */
  async moderateText(text: string, context: {
    contentType: string;
    authorId: string;
    targetAudience: AgeAppropriatenessRating;
    language: SupportedLanguage;
  }): Promise<ContentModerationResult> {
    console.log(`Moderating text for ${context.contentType}, target audience: ${context.targetAudience}`);
    
    // Generate a unique ID for the moderation result
    const id = `moderation-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Get inappropriate patterns for the specified language
    const patterns = this.inappropriatePatterns.get(context.language) || 
                     this.inappropriatePatterns.get('en-GB') || 
                     [];
    
    // Check for inappropriate content
    let moderationAction = ContentModerationAction.APPROVE;
    let moderationReason: ContentModerationReason | undefined;
    let confidenceScore = 1.0;
    let modifiedContent: string | undefined;
    
    // Check each pattern
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        // Determine the action based on the severity and context
        if (this.isHighSeverity(pattern)) {
          moderationAction = ContentModerationAction.REJECT;
          moderationReason = ContentModerationReason.HARMFUL_CONTENT;
          confidenceScore = 0.95;
          break;
        } else if (this.isMediumSeverity(pattern)) {
          moderationAction = ContentModerationAction.MODIFY;
          moderationReason = ContentModerationReason.INAPPROPRIATE_LANGUAGE;
          confidenceScore = 0.85;
          modifiedContent = this.redactInappropriateContent(text, pattern);
        } else {
          moderationAction = ContentModerationAction.FLAG_FOR_REVIEW;
          moderationReason = ContentModerationReason.INAPPROPRIATE_LANGUAGE;
          confidenceScore = 0.7;
        }
      }
    }
    
    // Check age appropriateness
    if (moderationAction === ContentModerationAction.APPROVE) {
      const ageAppropriate = this.checkAgeAppropriateness(text, context.targetAudience);
      if (!ageAppropriate) {
        moderationAction = ContentModerationAction.FLAG_FOR_REVIEW;
        moderationReason = ContentModerationReason.AGE_INAPPROPRIATE;
        confidenceScore = 0.8;
      }
    }
    
    // Create the moderation result
    const result: ContentModerationResult = {
      id,
      contentId: `content-${Date.now()}`,
      contentType: context.contentType,
      contentHash: this.generateContentHash(text),
      moderationAction,
      moderationReason,
      confidenceScore,
      moderatedBy: 'automated',
      moderatedAt: new Date(),
      originalContent: text,
      modifiedContent
    };
    
    // Store the result
    this.moderationResults.set(id, result);
    
    return result;
  }
  
  /**
   * Moderate an image
   * 
   * @param imageUrl The URL of the image to moderate
   * @param context The context of the moderation
   * @returns The moderation result
   */
  async moderateImage(imageUrl: string, context: {
    contentType: string;
    authorId: string;
    targetAudience: AgeAppropriatenessRating;
  }): Promise<ContentModerationResult> {
    console.log(`Moderating image: ${imageUrl}`);
    
    // Generate a unique ID for the moderation result
    const id = `moderation-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // In a real implementation, this would use image analysis services
    // to detect inappropriate content
    
    // Mock implementation
    const moderationAction = ContentModerationAction.APPROVE;
    const confidenceScore = 0.9;
    
    // Create the moderation result
    const result: ContentModerationResult = {
      id,
      contentId: `content-${Date.now()}`,
      contentType: context.contentType,
      contentHash: this.generateContentHash(imageUrl),
      moderationAction,
      confidenceScore,
      moderatedBy: 'automated',
      moderatedAt: new Date(),
      originalContent: imageUrl
    };
    
    // Store the result
    this.moderationResults.set(id, result);
    
    return result;
  }
  
  /**
   * Moderate a document
   * 
   * @param documentUrl The URL of the document to moderate
   * @param context The context of the moderation
   * @returns The moderation result
   */
  async moderateDocument(documentUrl: string, context: {
    contentType: string;
    authorId: string;
    targetAudience: AgeAppropriatenessRating;
    language: SupportedLanguage;
  }): Promise<ContentModerationResult> {
    console.log(`Moderating document: ${documentUrl}`);
    
    // Generate a unique ID for the moderation result
    const id = `moderation-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // In a real implementation, this would extract text from the document
    // and analyse it, as well as any images in the document
    
    // Mock implementation
    const moderationAction = ContentModerationAction.APPROVE;
    const confidenceScore = 0.85;
    
    // Create the moderation result
    const result: ContentModerationResult = {
      id,
      contentId: `content-${Date.now()}`,
      contentType: context.contentType,
      contentHash: this.generateContentHash(documentUrl),
      moderationAction,
      confidenceScore,
      moderatedBy: 'automated',
      moderatedAt: new Date(),
      originalContent: documentUrl
    };
    
    // Store the result
    this.moderationResults.set(id, result);
    
    return result;
  }
  
  /**
   * Filter user content based on filtering settings
   * 
   * @param content The content to filter
   * @param filteringSettings The filtering settings to apply
   * @returns The filtered content and filtering actions
   */
  async filterUserContent(content: string, filteringSettings: ContentFilteringSettings): Promise<{
    filteredContent: string;
    filteringActions: Array<{
      originalText: string;
      replacementText: string;
      reason: ContentModerationReason;
    }>;
  }> {
    console.log(`Filtering content with level: ${filteringSettings.filteringLevel}`);
    
    let filteredContent = content;
    const filteringActions: Array<{
      originalText: string;
      replacementText: string;
      reason: ContentModerationReason;
    }> = [];
    
    // Apply custom keyword filters
    if (filteringSettings.customKeywordFilters) {
      for (const keyword of filteringSettings.customKeywordFilters) {
        const regex = new RegExp(`\\b${this.escapeRegExp(keyword)}\\b`, 'gi');
        if (regex.test(filteredContent)) {
          const replacement = '*'.repeat(keyword.length);
          filteredContent = filteredContent.replace(regex, replacement);
          
          filteringActions.push({
            originalText: keyword,
            replacementText: replacement,
            reason: ContentModerationReason.INAPPROPRIATE_LANGUAGE
          });
        }
      }
    }
    
    // Apply standard filters based on filtering level
    const patterns = this.getFilterPatternsForLevel(filteringSettings.filteringLevel);
    
    for (const pattern of patterns) {
      const matches = filteredContent.match(pattern);
      if (matches) {
        for (const match of matches) {
          const replacement = '*'.repeat(match.length);
          filteredContent = filteredContent.replace(match, replacement);
          
          filteringActions.push({
            originalText: match,
            replacementText: replacement,
            reason: ContentModerationReason.INAPPROPRIATE_LANGUAGE
          });
        }
      }
    }
    
    return {
      filteredContent,
      filteringActions
    };
  }
  
  /**
   * Get content filtering settings for a user
   * 
   * @param userId The ID of the user
   * @returns The user's content filtering settings
   */
  async getUserContentFilteringSettings(userId: string): Promise<ContentFilteringSettings> {
    console.log(`Getting content filtering settings for user: ${userId}`);
    
    // Get the user's settings or create default settings
    if (!this.userFilteringSettings.has(userId)) {
      const defaultSettings: ContentFilteringSettings = {
        userId,
        filteringLevel: 'moderate',
        allowedContentCategories: ['educational', 'informational'],
        blockedContentCategories: ['entertainment'],
        ageAppropriateContentOnly: true,
        maxAgeRating: AgeAppropriatenessRating.SECONDARY_UPPER,
        parentalControlsEnabled: false,
        lastUpdatedBy: 'system',
        lastUpdatedAt: new Date()
      };
      
      this.userFilteringSettings.set(userId, defaultSettings);
    }
    
    return this.userFilteringSettings.get(userId)!;
  }
  
  /**
   * Update content filtering settings for a user
   * 
   * @param userId The ID of the user
   * @param settings The settings to update
   * @returns Whether the update was successful
   */
  async updateUserContentFilteringSettings(userId: string, settings: Partial<ContentFilteringSettings>): Promise<boolean> {
    console.log(`Updating content filtering settings for user: ${userId}`);
    
    // Get the user's current settings
    const currentSettings = await this.getUserContentFilteringSettings(userId);
    
    // Update the settings
    const updatedSettings: ContentFilteringSettings = {
      ...currentSettings,
      ...settings,
      lastUpdatedAt: new Date()
    };
    
    // Store the updated settings
    this.userFilteringSettings.set(userId, updatedSettings);
    
    return true;
  }
  
  /**
   * Review a moderation decision
   * 
   * @param moderationResultId The ID of the moderation result to review
   * @param review The review details
   * @returns Whether the review was successful
   */
  async reviewModerationDecision(moderationResultId: string, review: {
    decision: 'uphold' | 'overturn';
    reviewedBy: string;
    notes: string;
  }): Promise<boolean> {
    console.log(`Reviewing moderation decision: ${moderationResultId}`);
    
    // Get the moderation result
    const result = this.moderationResults.get(moderationResultId);
    
    if (!result) {
      console.error(`Moderation result not found: ${moderationResultId}`);
      return false;
    }
    
    // Update the result based on the review
    if (review.decision === 'overturn') {
      // Overturn the decision
      const updatedResult: ContentModerationResult = {
        ...result,
        moderationAction: result.moderationAction === ContentModerationAction.APPROVE ? 
                          ContentModerationAction.REJECT : 
                          ContentModerationAction.APPROVE,
        moderatedBy: 'human',
        moderatorId: review.reviewedBy,
        notes: review.notes
      };
      
      // Store the updated result
      this.moderationResults.set(moderationResultId, updatedResult);
    } else {
      // Uphold the decision, just update the reviewer
      const updatedResult: ContentModerationResult = {
        ...result,
        moderatedBy: 'human',
        moderatorId: review.reviewedBy,
        notes: review.notes
      };
      
      // Store the updated result
      this.moderationResults.set(moderationResultId, updatedResult);
    }
    
    return true;
  }
  
  /**
   * Initialize inappropriate content patterns
   */
  private initializeInappropriatePatterns(): void {
    // English (UK) patterns
    const enGBPatterns: RegExp[] = [
      // High severity patterns
      /\b(hate|violent|explicit|obscene)\b/i,
      
      // Medium severity patterns
      /\b(stupid|idiot|dumb)\b/i,
      
      // Low severity patterns
      /\b(silly|weird|strange)\b/i
    ];
    
    this.inappropriatePatterns.set('en-GB', enGBPatterns);
    
    // Add patterns for other languages
    // This would be expanded for each supported language
  }
  
  /**
   * Check if a pattern is high severity
   * 
   * @param pattern The pattern to check
   * @returns Whether the pattern is high severity
   */
  private isHighSeverity(pattern: RegExp): boolean {
    // In a real implementation, this would check against a categorized list
    // of patterns with severity ratings
    
    // Mock implementation
    return pattern.toString().includes('hate') || 
           pattern.toString().includes('violent') || 
           pattern.toString().includes('explicit') || 
           pattern.toString().includes('obscene');
  }
  
  /**
   * Check if a pattern is medium severity
   * 
   * @param pattern The pattern to check
   * @returns Whether the pattern is medium severity
   */
  private isMediumSeverity(pattern: RegExp): boolean {
    // In a real implementation, this would check against a categorized list
    // of patterns with severity ratings
    
    // Mock implementation
    return pattern.toString().includes('stupid') || 
           pattern.toString().includes('idiot') || 
           pattern.toString().includes('dumb');
  }
  
  /**
   * Redact inappropriate content
   * 
   * @param text The text to redact
   * @param pattern The pattern to redact
   * @returns The redacted text
   */
  private redactInappropriateContent(text: string, pattern: RegExp): string {
    // Create a copy of the pattern with global flag
    const globalPattern = new RegExp(pattern.source, 'g');
    
    // Replace matches with asterisks
    return text.replace(globalPattern, match => '*'.repeat(match.length));
  }
  
  /**
   * Check if content is age appropriate
   * 
   * @param content The content to check
   * @param targetAudience The target audience age rating
   * @returns Whether the content is age appropriate
   */
  private checkAgeAppropriateness(content: string, targetAudience: AgeAppropriatenessRating): boolean {
    // In a real implementation, this would use more sophisticated analysis
    // based on the content and target audience
    
    // Mock implementation
    if (targetAudience === AgeAppropriatenessRating.EARLY_YEARS || 
        targetAudience === AgeAppropriatenessRating.PRIMARY_LOWER) {
      // More strict for younger audiences
      return !/(complex|difficult|scary|frightening)/i.test(content);
    } else if (targetAudience === AgeAppropriatenessRating.PRIMARY_UPPER || 
               targetAudience === AgeAppropriatenessRating.SECONDARY_LOWER) {
      // Moderate for middle audiences
      return !/(explicit|violent|disturbing)/i.test(content);
    } else {
      // Less strict for older audiences
      return !/(explicit|graphic)/i.test(content);
    }
  }
  
  /**
   * Generate a content hash
   * 
   * @param content The content to hash
   * @returns The hash
   */
  private generateContentHash(content: string): string {
    // In a real implementation, this would use a proper hashing algorithm
    
    // Mock implementation
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
  
  /**
   * Escape special characters in a string for use in a regular expression
   * 
   * @param string The string to escape
   * @returns The escaped string
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Get filter patterns for a filtering level
   * 
   * @param level The filtering level
   * @returns Array of patterns to filter
   */
  private getFilterPatternsForLevel(level: string): RegExp[] {
    switch (level) {
      case 'minimal':
        return [
          /\b(explicit|obscene)\b/i
        ];
      case 'moderate':
        return [
          /\b(explicit|obscene|violent|hate)\b/i,
          /\b(stupid|idiot|dumb)\b/i
        ];
      case 'strict':
        return [
          /\b(explicit|obscene|violent|hate)\b/i,
          /\b(stupid|idiot|dumb)\b/i,
          /\b(silly|weird|strange)\b/i
        ];
      case 'very_strict':
        return [
          /\b(explicit|obscene|violent|hate)\b/i,
          /\b(stupid|idiot|dumb)\b/i,
          /\b(silly|weird|strange)\b/i,
          /\b(difficult|challenging|hard)\b/i
        ];
      default:
        return [
          /\b(explicit|obscene|violent|hate)\b/i
        ];
    }
  }
}
