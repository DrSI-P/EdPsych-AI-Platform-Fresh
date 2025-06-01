'use client';

/**
 * Types for the Adaptive Complexity Adjustment feature
 * 
 * This module defines the core types and interfaces for the adaptive complexity
 * adjustment system, which dynamically adjusts content difficulty based on user
 * performance and learning patterns.
 */

/**
 * Represents the difficulty level of content
 */
export enum ComplexityLevel {
  FOUNDATIONAL = 'foundational',
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Maps complexity levels to numerical values for calculations
 */
export const ComplexityLevelValue: Record<ComplexityLevel, number> = {
  [ComplexityLevel.FOUNDATIONAL]: 1,
  [ComplexityLevel.BASIC]: 2,
  [ComplexityLevel.INTERMEDIATE]: 3,
  [ComplexityLevel.ADVANCED]: 4,
  [ComplexityLevel.EXPERT]: 5
};

/**
 * Represents a user's performance on a specific task or assessment
 */
export interface PerformanceMetric {
  userId: string;
  contentId: string;
  score: number; // Normalized score between 0 and 1
  timeSpent: number; // In seconds
  completionRate: number; // Percentage of task completed (0-1)
  attemptCount: number; // Number of attempts made
  timestamp: Date;
  subjectArea: string;
  skillArea: string;
}

/**
 * Represents a user's learning profile for adaptive complexity adjustments
 */
export interface LearningProfile {
  userId: string;
  subjectPreferences: Record<string, SubjectPreference>;
  learningRate: number; // How quickly the user typically learns (0-1)
  challengePreference: number; // User's preference for challenge level (0-1)
  lastUpdated: Date;
}

/**
 * Represents a user's preferences and performance in a specific subject area
 */
export interface SubjectPreference {
  subjectId: string;
  currentComplexityLevel: ComplexityLevel;
  recommendedComplexityLevel: ComplexityLevel;
  confidenceScore: number; // How confident the system is in this recommendation (0-1)
  performanceHistory: any[];
  skillAreas: Record<string, SkillAreaProfile>;
}

/**
 * Represents a user's profile in a specific skill area within a subject
 */
export interface SkillAreaProfile {
  skillId: string;
  currentComplexityLevel: ComplexityLevel;
  recommendedComplexityLevel: ComplexityLevel;
  confidenceScore: number;
  performanceHistory: any[];
  strengths: any[]; // Specific strengths identified within this skill area
  areasForImprovement: any[]; // Specific areas needing improvement
}

/**
 * Represents content that can be adjusted for complexity
 */
export interface AdaptiveContent {
  id: string;
  title: string;
  description: string;
  subjectArea: string;
  skillAreas: any[];
  complexityLevel: ComplexityLevel;
  prerequisites: any[]; // IDs of content that should be completed first
  learningObjectives: any[];
  estimatedTimeMinutes: number;
  adaptiveElements: any[];
}

/**
 * Represents a specific element within content that can be adapted
 */
export interface AdaptiveElement {
  id: string;
  elementType: 'text' | 'question' | 'activity' | 'resource' | 'assessment';
  complexityVariants: Record<ComplexityLevel, string>; // Content variant for each complexity level
  adaptationRules?: AdaptationRule[]; // Optional rules for adapting this element
}

/**
 * Represents a rule for adapting content based on user performance or characteristics
 */
export interface AdaptationRule {
  condition: {
    metric: 'score' | 'timeSpent' | 'completionRate' | 'attemptCount' | 'learningRate' | 'challengePreference';
    operator: 'lt' | 'lte' | 'eq' | 'gte' | 'gt';
    value: number;
  };
  action: {
    adjustComplexity: 'increase' | 'decrease' | 'maintain';
    adjustmentMagnitude: number; // How much to adjust (0-1)
    provideScaffolding: boolean; // Whether to provide additional support
    scaffoldingType?: 'hint' | 'example' | 'breakdown' | 'reference';
  };
}

/**
 * Represents the result of an adaptive complexity adjustment
 */
export interface ComplexityAdjustmentResult {
  userId: string;
  contentId: string;
  previousComplexityLevel: ComplexityLevel;
  newComplexityLevel: ComplexityLevel;
  adjustmentReason: string;
  confidenceScore: number;
  timestamp: Date;
  recommendedNextSteps?: string[];
}

/**
 * Configuration options for the adaptive complexity system
 */
export interface AdaptiveComplexityConfig {
  enableAdaptiveContent: boolean;
  minPerformanceDataPoints: number; // Minimum data points needed before making adjustments
  adjustmentThreshold: number; // Minimum difference needed to trigger an adjustment
  learningRateWeight: number; // Weight given to learning rate in calculations
  challengePreferenceWeight: number; // Weight given to challenge preference in calculations
  performanceHistoryWeight: number; // Weight given to historical performance
  recentPerformanceWeight: number; // Weight given to recent performance
  maxComplexityJump: number; // Maximum number of levels to jump at once
}
