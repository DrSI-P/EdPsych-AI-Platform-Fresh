/**
 * Type definitions for Learning Path
 * Provides types for personalized learning paths and related features
 */

// Export UK curriculum types directly from this file
export type UKKeyStage = 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'ks5' | 'nursery' | 'reception';
export type UKSubject = 'Mathematics' | 'English' | 'Science' | 'History' | 'Geography' | 'Art' | 'Music' | 'Physical Education' | 'Computing' | 'Design and Technology' | 'Languages' | 'Religious Education' | 'Citizenship' | 'PSHE';

// Aliases for compatibility with other components
export type KeyStage = UKKeyStage;
export type Subject = UKSubject;

// Enhanced KeyStage namespace for enum-like access while preserving the original type
export namespace KeyStage {
  export const NURSERY: KeyStage = 'nursery';
  export const RECEPTION: KeyStage = 'reception';
  export const KS1: KeyStage = 'ks1';
  export const KS2: KeyStage = 'ks2';
  export const KS3: KeyStage = 'ks3';
  export const KS4: KeyStage = 'ks4';
  export const KS5: KeyStage = 'ks5';
}

// Enhanced Subject namespace for enum-like access while preserving the original type
export namespace Subject {
  export const MATHS: Subject = 'Mathematics';
  export const ENGLISH: Subject = 'English';
  export const SCIENCE: Subject = 'Science';
  export const HISTORY: Subject = 'History';
  export const GEOGRAPHY: Subject = 'Geography';
  export const ART: Subject = 'Art';
  export const MUSIC: Subject = 'Music';
  export const PE: Subject = 'Physical Education';
  export const COMPUTING: Subject = 'Computing';
  export const LANGUAGES: Subject = 'Languages';
}

// Enhanced UKKeyStage namespace for enum-like access
export namespace UKKeyStage {
  export const NURSERY: UKKeyStage = 'nursery';
  export const RECEPTION: UKKeyStage = 'reception';
  export const KS1: UKKeyStage = 'ks1';
  export const KS2: UKKeyStage = 'ks2';
  export const KS3: UKKeyStage = 'ks3';
  export const KS4: UKKeyStage = 'ks4';
  export const KS5: UKKeyStage = 'ks5';
}

// Enhanced UKSubject namespace for enum-like access
export namespace UKSubject {
  export const MATHEMATICS: UKSubject = 'Mathematics';
  export const ENGLISH: UKSubject = 'English';
  export const SCIENCE: UKSubject = 'Science';
  export const HISTORY: UKSubject = 'History';
  export const GEOGRAPHY: UKSubject = 'Geography';
  export const ART: UKSubject = 'Art';
  export const MUSIC: UKSubject = 'Music';
  export const PHYSICAL_EDUCATION: UKSubject = 'Physical Education';
  export const COMPUTING: UKSubject = 'Computing';
  export const DESIGN_AND_TECHNOLOGY: UKSubject = 'Design and Technology';
  export const LANGUAGES: UKSubject = 'Languages';
  export const RELIGIOUS_EDUCATION: UKSubject = 'Religious Education';
  export const CITIZENSHIP: UKSubject = 'Citizenship';
  export const PSHE: UKSubject = 'PSHE';
}

/**
 * Topic status for tracking progress
 */
export enum TopicStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  MASTERED = 'mastered',
  NEEDS_REVIEW = 'needs_review'
}

/**
 * Proficiency levels for assessments
 */
export enum ProficiencyLevel {
  NOVICE = 'novice',
  BEGINNER = 'beginner',
  DEVELOPING = 'developing',
  COMPETENT = 'competent',
  PROFICIENT = 'proficient',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

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
