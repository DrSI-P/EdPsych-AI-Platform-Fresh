/**
 * Types for curriculum content
 * 
 * This file re-exports types from their original locations to provide a centralized
 * access point for curriculum content related types.
 */

// Re-export types from learning-path
import { UKKeyStage, UKSubject, LearningStyle } from '@/lib/learning-path/types';

// Re-export for use throughout the application
export type { UKKeyStage, UKSubject, LearningStyle };

// Export additional types specific to curriculum content if needed
export interface CurriculumContentMetadata {
  id: string;
  title: string;
  description: string;
  keyStage: UKKeyStage;
  subject: UKSubject;
  topics: string[];
  targetLearningStyles?: LearningStyle[];
  createdAt: Date;
  updatedAt: Date;
}

// Export MilestoneStatus enum which was also reported as missing
export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}