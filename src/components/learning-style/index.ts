'use client';

export * from './learning-style-provider';
export * from './learning-style-preferences';
export * from './learning-style-detector';
export * from './content-adapter';
export * from './learning-style-demo';

// Re-export default components
import LearningStyleProvider from './learning-style-provider';
import LearningStylePreferences from './learning-style-preferences';
import LearningStyleDetector from './learning-style-detector';
import ContentAdapter from './content-adapter';
import LearningStyleDemo from './learning-style-demo';

export {
  LearningStyleProvider,
  LearningStylePreferences,
  LearningStyleDetector,
  ContentAdapter,
  LearningStyleDemo
};