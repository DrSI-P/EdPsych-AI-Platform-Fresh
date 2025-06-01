/**
 * Types for Student Progress Analytics
 * 
 * This file defines the TypeScript interfaces and types used in the Student Progress Analytics feature.
 * These types ensure data consistency and provide proper type checking for analytics data.
 */

/**
 * Student progress data structure
 */
export interface StudentProgress {
  id: string;
  studentId: string;
  assessmentId?: string;
  moduleId?: string;
  score: number;
  maxScore: number;
  completedAt: string;
  timeSpent: number; // in seconds
  attempts: number;
}

/**
 * Learning objective progress status
 */
export enum ObjectiveStatus {
  NOT_STARTED = 'not_started',
  EMERGING = 'emerging',
  DEVELOPING = 'developing',
  SECURE = 'secure',
  MASTERED = 'mastered'
}

/**
 * UK curriculum key stages
 */
export enum UKKeyStage {
  EYFS = 'eyfs',
  KS1 = 'ks1',
  KS2 = 'ks2',
  KS3 = 'ks3',
  KS4 = 'ks4',
  KS5 = 'ks5'
}

/**
 * Learning objective progress
 */
export interface ObjectiveProgress {
  id: string;
  objectiveId: string;
  objectiveTitle: string;
  keyStage: UKKeyStage;
  subject: string;
  status: ObjectiveStatus;
  lastUpdated: string;
  evidence?: string[];
}

/**
 * Learning style preference
 */
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  KINESTHETIC = 'kinesthetic',
  READING_WRITING = 'reading_writing'
}

/**
 * Student learning profile
 */
export interface StudentLearningProfile {
  id: string;
  studentId: string;
  learningStyles: {
    [key in LearningStyle]?: number; // 0-100 preference strength
  };
  interests: string[];
  strengths: string[];
  areasForImprovement: string[];
  accommodations?: string[];
  lastUpdated: string;
}

/**
 * Analytics time period options
 */
export enum AnalyticsTimePeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  TERM = 'term',
  ACADEMIC_YEAR = 'academic_year',
  CUSTOM = 'custom'
}

/**
 * Student group types for filtering
 */
export enum StudentGroup {
  ALL = 'all',
  PUPIL_PREMIUM = 'pp',
  SEND = 'send',
  EAL = 'eal',
  BOYS = 'boys',
  GIRLS = 'girls',
  CUSTOM = 'custom'
}

/**
 * Progress trend direction
 */
export enum TrendDirection {
  IMPROVING = 'improving',
  STATIC = 'static',
  DECLINING = 'declining'
}

/**
 * Intervention priority level
 */
export enum InterventionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * At-risk student data
 */
export interface AtRiskStudent {
  id: string;
  name: string;
  year: number;
  concerns: string[];
  trend: TrendDirection;
  interventions: string[];
  priority: InterventionPriority;
}

/**
 * Curriculum coverage data
 */
export interface CurriculumCoverage {
  subject: string;
  covered: number; // percentage
  target: number; // percentage
  objectives: {
    total: number;
    mastered: number;
    developing: number;
    emerging: number;
    notStarted: number;
  };
}

/**
 * Analytics filter options
 */
export interface AnalyticsFilters {
  timePeriod: AnalyticsTimePeriod;
  dateRange?: {
    from: Date;
    to: Date;
  };
  studentGroup?: StudentGroup;
  subject?: string;
  yearGroup?: string;
}

/**
 * Progress report data
 */
export interface ProgressReport {
  id: string;
  studentId: string;
  generatedAt: string;
  timePeriod: AnalyticsTimePeriod;
  overallProgress: number; // percentage
  curriculumCoverage: CurriculumCoverage[];
  objectivesProgress: {
    total: number;
    mastered: number;
    developing: number;
    emerging: number;
    notStarted: number;
  };
  learningStyleEffectiveness: {
    [key in LearningStyle]?: number; // 0-100 effectiveness score
  };
  recommendations: string[];
}
