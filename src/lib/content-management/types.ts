/**
 * Type definitions for the Content Management System
 */

import { UKKeyStage, UKSubject } from '@/lib/assessment/types';
import { LearningStyle } from '@/lib/learning-path/types';

/**
 * Content item type
 */
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  format: ContentFormat;
  subject: UKSubject;
  keyStage: UKKeyStage;
  yearGroup: string[];
  curriculumStandards: CurriculumStandard[];
  learningObjectives: string[];
  content: ContentVariant[];
  author: string;
  reviewStatus: ReviewStatus;
  tags: string[];
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  prerequisites: string[]; // IDs of prerequisite content items
  relatedContent: string[]; // IDs of related content items
  assessments: string[]; // IDs of associated assessments
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Content type enum
 */
export enum ContentType {
  LESSON = 'lesson',
  ACTIVITY = 'activity',
  RESOURCE = 'resource',
  ASSESSMENT = 'assessment',
  PROJECT = 'project',
  GAME = 'game',
  VIDEO = 'video',
  READING = 'reading',
  WORKSHEET = 'worksheet',
  PRESENTATION = 'presentation',
  INTERACTIVE = 'interactive'
}

/**
 * Content format enum
 */
export enum ContentFormat {
  TEXT = 'text',
  HTML = 'html',
  MARKDOWN = 'markdown',
  PDF = 'pdf',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  INTERACTIVE = 'interactive',
  EXTERNAL = 'external'
}

/**
 * Review status enum
 */
export enum ReviewStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  REJECTED = 'rejected'
}

/**
 * Difficulty level enum
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  MIXED = 'mixed'
}

/**
 * Content variant for different learning styles
 */
export interface ContentVariant {
  learningStyle: LearningStyle;
  data: ContentData;
  isDefault: boolean;
}

/**
 * Content data type
 */
export interface ContentData {
  body: string;
  mediaUrls?: string[];
  attachments?: Attachment[];
  interactiveElements?: InteractiveElement[];
  externalResources?: ExternalResource[];
}

/**
 * Attachment type
 */
export interface Attachment {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

/**
 * Interactive element type
 */
export interface InteractiveElement {
  id: string;
  type: InteractiveElementType;
  title: string;
  description?: string;
  config: any; // Configuration specific to the element type
}

/**
 * Interactive element type enum
 */
export enum InteractiveElementType {
  QUIZ = 'quiz',
  POLL = 'poll',
  DRAG_AND_DROP = 'drag_and_drop',
  FLASHCARDS = 'flashcards',
  MATCHING = 'matching',
  TIMELINE = 'timeline',
  SIMULATION = 'simulation',
  GAME = 'game'
}

/**
 * External resource type
 */
export interface ExternalResource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: ExternalResourceType;
}

/**
 * External resource type enum
 */
export enum ExternalResourceType {
  WEBSITE = 'website',
  VIDEO = 'video',
  DOCUMENT = 'document',
  TOOL = 'tool',
  APP = 'app'
}

/**
 * Curriculum standard type
 */
export interface CurriculumStandard {
  id: string;
  code: string;
  description: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  category: string;
  subcategory?: string;
  year: string;
}

/**
 * Content collection type
 */
export interface ContentCollection {
  id: string;
  title: string;
  description: string;
  contentItems: string[]; // IDs of content items
  subject?: UKSubject;
  keyStage?: UKKeyStage;
  author: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content feedback type
 */
export interface ContentFeedback {
  id: string;
  contentId: string;
  userId: string;
  userRole: 'student' | 'teacher' | 'parent' | 'admin';
  rating: number; // 1-5
  comment?: string;
  helpfulness: 'very_helpful' | 'somewhat_helpful' | 'not_helpful';
  difficulty: 'too_easy' | 'appropriate' | 'too_difficult';
  engagement: 'very_engaging' | 'somewhat_engaging' | 'not_engaging';
  createdAt: Date;
}

/**
 * Content usage statistics type
 */
export interface ContentUsageStats {
  contentId: string;
  views: number;
  completions: number;
  averageTimeSpent: number; // in minutes
  averageRating: number;
  successRate: number; // percentage of associated assessments passed
  popularityRank: number;
  lastAccessed: Date;
}

/**
 * Content search filters type
 */
export interface ContentSearchFilters {
  query?: string;
  subjects?: UKSubject[];
  keyStages?: UKKeyStage[];
  yearGroups?: string[];
  contentTypes?: ContentType[];
  learningStyles?: LearningStyle[];
  difficultyLevels?: DifficultyLevel[];
  tags?: string[];
  reviewStatus?: ReviewStatus[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  author?: string;
  sortBy?: 'relevance' | 'date' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Content permission type
 */
export interface ContentPermission {
  contentId: string;
  userId: string;
  role: 'viewer' | 'editor' | 'owner';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content version history type
 */
export interface ContentVersion {
  id: string;
  contentId: string;
  versionNumber: number;
  changes: string;
  data: ContentItem;
  createdBy: string;
  createdAt: Date;
}

/**
 * Learning objective type
 */
export interface LearningObjective {
  id: string;
  description: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  curriculumStandards: string[]; // IDs of curriculum standards
  taxonomyLevel: BloomsTaxonomyLevel;
  tags: string[];
}

/**
 * Bloom's taxonomy level enum
 */
export enum BloomsTaxonomyLevel {
  REMEMBER = 'remember',
  UNDERSTAND = 'understand',
  APPLY = 'apply',
  ANALYZE = 'analyze',
  EVALUATE = 'evaluate',
  CREATE = 'create'
}
