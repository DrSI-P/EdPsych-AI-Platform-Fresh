/**
 * Performance Monitoring Configuration
 * 
 * This module configures performance monitoring for the EdPsych-AI-Education-Platform.
 * It provides tools for tracking application performance metrics and identifying bottlenecks.
 */

import { NextWebVitalsMetric } from 'next/app';
import { logInfo } from './logger';

// Store performance metrics
const performanceMetrics: Record<string, any[]> = {
  webVitals: [],
  apiCalls: [],
  pageLoads: [],
  resourceLoads: [],
};

// Maximum number of metrics to store in memory
const MAX_METRICS_STORED = 100;

// Allow injection of timing function for testing
let getNow = () => typeof performance !== 'undefined' ? performance.now() : Date.now();

/**
 * Set custom timing function (primarily for testing)
 * 
 * @param timingFn - Custom function that returns current time in ms
 */
export function setTimingFunction(timingFn: () => number) {
  getNow = timingFn;
}

/**
 * Reset to default timing function
 */
export function resetTimingFunction() {
  getNow = () => typeof performance !== 'undefined' ? performance.now() : Date.now();
}

/**
 * Track Web Vitals metrics
 * 
 * @param metric - Web Vitals metric object
 */
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Log the metric
  logInfo(`Web Vital: ${metric.name}`, {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    startTime: metric.startTime,
    label: metric.label,
  });
  
  // Store the metric
  performanceMetrics.webVitals.push({
    timestamp: Date.now(),
    ...metric,
  });
  
  // Trim array if it gets too large
  if (performanceMetrics.webVitals.length > MAX_METRICS_STORED) {
    performanceMetrics.webVitals.shift();
  }
  
  // Send to analytics if available
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' && 
      typeof window !== 'undefined' && 
      window.gtag) {
    window.gtag('event', 'web-vitals', {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

/**
 * Track API call performance
 * 
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param duration - Call duration in milliseconds
 * @param status - HTTP status code
 * @param error - Error message if applicable
 */
export function trackApiCall(
  endpoint: string,
  method: string,
  duration: number,
  status: number,
  error?: string
) {
  // Log the API call
  logInfo(`API Call: ${method} ${endpoint}`, {
    endpoint,
    method,
    duration,
    status,
    error,
  });
  
  // Store the metric
  performanceMetrics.apiCalls.push({
    timestamp: Date.now(),
    endpoint,
    method,
    duration,
    status,
    error,
  });
  
  // Trim array if it gets too large
  if (performanceMetrics.apiCalls.length > MAX_METRICS_STORED) {
    performanceMetrics.apiCalls.shift();
  }
}

/**
 * Track page load performance
 * 
 * @param page - Page path
 * @param loadTime - Load time in milliseconds
 * @param isInitialLoad - Whether this is the initial page load
 */
export function trackPageLoad(
  page: string,
  loadTime: number,
  isInitialLoad: boolean = false
) {
  // Log the page load
  logInfo(`Page Load: ${page}`, {
    page,
    loadTime,
    isInitialLoad,
  });
  
  // Store the metric
  performanceMetrics.pageLoads.push({
    timestamp: Date.now(),
    page,
    loadTime,
    isInitialLoad,
  });
  
  // Trim array if it gets too large
  if (performanceMetrics.pageLoads.length > MAX_METRICS_STORED) {
    performanceMetrics.pageLoads.shift();
  }
}

/**
 * Track resource load performance
 * 
 * @param resource - Resource URL
 * @param type - Resource type (script, style, image, etc.)
 * @param loadTime - Load time in milliseconds
 */
export function trackResourceLoad(
  resource: string,
  type: string,
  loadTime: number
) {
  // Log the resource load
  logInfo(`Resource Load: ${type} ${resource}`, {
    resource,
    type,
    loadTime,
  });
  
  // Store the metric
  performanceMetrics.resourceLoads.push({
    timestamp: Date.now(),
    resource,
    type,
    loadTime,
  });
  
  // Trim array if it gets too large
  if (performanceMetrics.resourceLoads.length > MAX_METRICS_STORED) {
    performanceMetrics.resourceLoads.shift();
  }
}

/**
 * Get performance metrics
 * 
 * @returns Current performance metrics
 */
export function getPerformanceMetrics() {
  return performanceMetrics;
}

/**
 * Clear performance metrics
 */
export function clearPerformanceMetrics() {
  Object.keys(performanceMetrics).forEach(key => {
    performanceMetrics[key] = [];
  });
}

/**
 * Create a performance measurement
 * 
 * @param name - Measurement name
 * @returns Object with start and end functions
 */
export function measure(name: string) {
  const startTime = getNow();
  
  return {
    start: () => {
      return startTime;
    },
    end: () => {
      const endTime = getNow();
      const duration = endTime - startTime;
      
      logInfo(`Performance Measurement: ${name}`, {
        name,
        duration,
      });
      
      return duration;
    },
  };
}

export default {
  reportWebVitals,
  trackApiCall,
  trackPageLoad,
  trackResourceLoad,
  getPerformanceMetrics,
  clearPerformanceMetrics,
  measure,
  setTimingFunction,
  resetTimingFunction,
};
