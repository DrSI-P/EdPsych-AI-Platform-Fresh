/**
 * Main entry point for the Curriculum Content feature
 * Exports all types, utilities, and API functions
 */

// Re-export all types from types.ts
export * from './types';

// Re-export UKKeyStage, UKSubject, and LearningStyle from learning-path
export { UKKeyStage, UKSubject, LearningStyle } from '@/lib/learning-path/types';

// Export services
export * from './api';
export * from './analytics-service';
export * from './learning-style-service';
export * from './permission-service';
export * from './search-service';
export * from './student-interest-service';
export * from './unit-management-service';
export * from './version-control-service';