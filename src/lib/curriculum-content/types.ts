/**
 * Type definitions for Advanced Curriculum Content
 * Provides comprehensive type system for UK curriculum-aligned educational content
 */

import { UKKeyStage, UKSubject, LearningStyle } from '@/lib/learning-path/types';

/**
 * Content difficulty levels
 */
export enum ContentDifficultyLevel {
  FOUNDATION = 'foundation',
  CORE = 'core',
  EXTENDED = 'extended',
  ADVANCED = 'advanced'
}

/**
 * Content types
 */
export enum ContentType {
  EXPLANATION = 'explanation',
  EXERCISE = 'exercise',
  ASSESSMENT = 'assessment',
  EXAMPLE = 'example',
  RESOURCE = 'resource',
  PROJECT = 'project',
  DISCUSSION = 'discussion'
}

/**
 * Content format
 */
export enum ContentFormat {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  INTERACTIVE = 'interactive',
  DOCUMENT = 'document',
  PRESENTATION = 'presentation'
}

/**
 * Content status in workflow
 */
export enum ContentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  REJECTED = 'rejected'
}

/**
 * UK curriculum region
 */
export enum UKCurriculumRegion {
  ENGLAND = 'england',
  WALES = 'wales',
  SCOTLAND = 'scotland',
  NORTHERN_IRELAND = 'northern_ireland'
}

/**
 * Content metadata interface
 */
export interface ContentMetadata {
  id: string;
  title: string;
  description: string;
  keyStage: UKKeyStage;
  subject: UKSubject;
  topics: string[];
  learningObjectives: string[];
  keywords: string[];
  difficultyLevel: ContentDifficultyLevel;
  contentType: ContentType;
  contentFormat: ContentFormat;
  estimatedDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  status: ContentStatus;
  region: UKCurriculumRegion;
  prerequisiteIds?: string[];
  relatedContentIds?: string[];
}

/**
 * Content variant for different learning styles
 */
export interface ContentVariant {
  id: string;
  contentId: string;
  learningStyle: LearningStyle;
  content: string; // Can be HTML, markdown, or JSON depending on content type
  mediaUrls?: string[];
  interactiveElements?: any;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

/**
 * Complete curriculum content item
 */
export interface CurriculumContent {
  metadata: ContentMetadata;
  variants: ContentVariant[];
  defaultVariant: ContentVariant;
  assessments?: string[]; // IDs of linked assessments
  feedback?: ContentFeedback[];
  analytics?: ContentAnalytics;
}

/**
 * Content feedback from educators and students
 */
export interface ContentFeedback {
  id: string;
  contentId: string;
  userId: string;
  userRole: 'student' | 'educator' | 'parent';
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

/**
 * Content usage analytics
 */
export interface ContentAnalytics {
  contentId: string;
  views: number;
  completions: number;
  averageTimeSpent: number; // in seconds
  averageRating: number;
  successRate?: number; // for assessments
  lastUpdated: string;
}

/**
 * Curriculum unit containing multiple content items
 */
export interface CurriculumUnit {
  id: string;
  title: string;
  description: string;
  keyStage: UKKeyStage;
  subject: UKSubject;
  contentIds: string[];
  learningObjectives: string[];
  prerequisiteUnitIds?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  status: ContentStatus;
}

/**
 * Content creation permission levels
 */
export enum ContentPermission {
  VIEW = 'view',
  COMMENT = 'comment',
  EDIT = 'edit',
  APPROVE = 'approve',
  ADMIN = 'admin'
}

/**
 * User content permissions
 */
export interface UserContentPermission {
  userId: string;
  contentId?: string; // If undefined, applies to all content
  subjectId?: string; // If defined, applies to all content in subject
  keyStage?: UKKeyStage; // If defined, applies to all content in key stage
  permission: ContentPermission;
}

/**
 * Content change history record
 */
export interface ContentChangeRecord {
  id: string;
  contentId: string;
  userId: string;
  timestamp: string;
  previousVersion: number;
  newVersion: number;
  changeDescription: string;
  changeType: 'create' | 'update' | 'status' | 'delete';
}

/**
 * Content search filters
 */
export interface ContentSearchFilters {
  keyStage?: UKKeyStage[];
  subject?: UKSubject[];
  contentType?: ContentType[];
  difficultyLevel?: ContentDifficultyLevel[];
  status?: ContentStatus[];
  createdBy?: string;
  topics?: string[];
  keywords?: string[];
  region?: UKCurriculumRegion[];
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Content search result
 */
export interface ContentSearchResult {
  totalResults: number;
  page: number;
  pageSize: number;
  results: ContentMetadata[];
}
