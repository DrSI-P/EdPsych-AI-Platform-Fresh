/**
 * Type definitions for Learning Path
 * Provides types for personalized learning paths and related features
 */

// Export UK curriculum types directly from this file
export type UKKeyStage = 'KS1' | 'KS2' | 'KS3' | 'KS4' | 'KS5';
export type UKSubject = 'Mathematics' | 'English' | 'Science' | 'History' | 'Geography' | 'Art' | 'Music' | 'Physical Education' | 'Computing' | 'Design and Technology' | 'Languages' | 'Religious Education' | 'Citizenship' | 'PSHE';

/**
 * Learning styles based on VARK model
 */
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
  MULTIMODAL = 'multimodal'
}

/**
 * Learning path status
 */
export enum LearningPathStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  ARCHIVED = 'archived'
}

/**
 * Learning path unit status
 */
export enum LearningPathUnitStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  NEEDS_REVIEW = 'needs_review'
}

/**
 * Learning path difficulty level
 */
export enum LearningPathDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ADAPTIVE = 'adaptive'
}

/**
 * Learning path metadata
 */
export interface LearningPathMetadata {
  id: string;
  title: string;
  description: string;
  keyStage: UKKeyStage;
  subject: UKSubject;
  topics: string[];
  difficulty: LearningPathDifficulty;
  estimatedDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  status: LearningPathStatus;
  learningStyle: LearningStyle;
  isPersonalized: boolean;
  tags: string[];
}

/**
 * Learning path unit
 */
export interface LearningPathUnit {
  id: string;
  pathId: string;
  title: string;
  description: string;
  contentIds: string[];
  order: number;
  status: LearningPathUnitStatus;
  estimatedDuration: number; // in minutes
  completedAt?: string;
  startedAt?: string;
  assessmentId?: string;
}

/**
 * Complete learning path
 */
export interface LearningPath {
  metadata: LearningPathMetadata;
  units: LearningPathUnit[];
  progress: number; // 0-100
  userNotes?: string[];
  recommendations?: string[]; // IDs of recommended learning paths
}

/**
 * User learning profile
 */
export interface UserLearningProfile {
  userId: string;
  preferredLearningStyle: LearningStyle;
  interests: string[];
  strengths: string[];
  areasForImprovement: string[];
  completedPathIds: string[];
  activePathIds: string[];
  assessmentResults: AssessmentResult[];
  lastUpdated: string;
}

/**
 * Assessment result
 */
export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  pathId?: string;
  unitId?: string;
  score: number; // 0-100
  completedAt: string;
  timeSpent: number; // in seconds
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

/**
 * Learning path creation parameters
 */
export interface LearningPathCreationParams {
  title: string;
  description: string;
  keyStage: UKKeyStage;
  subject: UKSubject;
  topics: string[];
  difficulty: LearningPathDifficulty;
  learningStyle: LearningStyle;
  isPersonalized: boolean;
  userId: string;
}

/**
 * Learning path search filters
 */
export interface LearningPathSearchFilters {
  keyStage?: UKKeyStage[];
  subject?: UKSubject[];
  difficulty?: LearningPathDifficulty[];
  status?: LearningPathStatus[];
  learningStyle?: LearningStyle[];
  topics?: string[];
  isPersonalized?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Learning path search result
 */
export interface LearningPathSearchResult {
  totalResults: number;
  page: number;
  pageSize: number;
  results: LearningPathMetadata[];
}
