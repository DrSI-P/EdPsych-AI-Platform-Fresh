'use client';

// Export all analytics components
export * from './accessibility-validator';
export * from './analytics-and-reporting';
export * from './analytics-dashboard';
export * from './analytics-integration';
export * from './curriculum-alignment-validator';
export * from './custom-report-builder';
export * from './dashboard-widget';
export * from './educator-analytics';
export * from './educator-performance-analytics';
export * from './resource-and-assessment-analytics';
export * from './student-progress-tracking';
export * from './Analytics';

// Export the main Analytics component for use in _app.tsx
export { Analytics } from './Analytics';
export { default } from './Analytics';

// No need to re-export components individually as they're already exported via the wildcard exports above
// This ensures we don't have issues with components that don't have default exports