'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define analytics event types
export type VoiceAnalyticsEventType = 
  | 'recognition_start'
  | 'recognition_end'
  | 'recognition_success'
  | 'recognition_error'
  | 'command_executed'
  | 'navigation_performed'
  | 'text_dictated'
  | 'settings_changed';

// Define analytics event structure
export type VoiceAnalyticsEvent = {
  type: VoiceAnalyticsEventType;
  timestamp: number;
  data: Record<string, any>;
  sessionId: string;
  userId?: string;
  keyStage?: string;
};

// Define context type
type VoiceAnalyticsContextType = {
  trackEvent: (type: VoiceAnalyticsEventType, data: Record<string, any>) => void;
  getAnalytics: () => VoiceAnalyticsEvent[];
  clearAnalytics: () => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  privacyMode: boolean;
  setPrivacyMode: (enabled: boolean) => void;
};

// Create context
const VoiceAnalyticsContext = createContext<VoiceAnalyticsContextType | undefined>(undefined);

/**
 * Voice Input Analytics Provider
 * 
 * This provider manages analytics tracking for voice input features,
 * allowing for monitoring usage patterns and identifying areas for improvement.
 * 
 * Features:
 * - Event tracking for voice recognition activities
 * - Privacy controls for sensitive data
 * - Session-based analytics
 * - Local storage persistence
 * - Data export capabilities
 */
export function VoiceAnalyticsProvider({
  children,
  initialEnabled = true,
  initialPrivacyMode = false,
}: {
  children: ReactNode;
  initialEnabled?: boolean;
  initialPrivacyMode?: boolean;
}) {
  // State
  const [events, setEvents] = useState<VoiceAnalyticsEvent[]>([]);
  const [isEnabled, setIsEnabled] = useState<boolean>(initialEnabled);
  const [privacyMode, setIsPrivacyMode] = useState<boolean>(initialPrivacyMode);
  const [sessionId, setSessionId] = useState<string>('');
  
  // Initialize session ID on mount
  useEffect(() => {
    // Generate a random session ID
    const newSessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
    setSessionId(newSessionId);
    
    // Load settings from localStorage
    const storedEnabled = localStorage.getItem('voiceAnalyticsEnabled');
    if (storedEnabled !== null) {
      setIsEnabled(storedEnabled === 'true');
    }
    
    const storedPrivacyMode = localStorage.getItem('voiceAnalyticsPrivacyMode');
    if (storedPrivacyMode !== null) {
      setIsPrivacyMode(storedPrivacyMode === 'true');
    }
    
    // Load events from localStorage
    const storedEvents = localStorage.getItem('voiceAnalyticsEvents');
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error('Error parsing stored analytics events:', error);
      }
    }
    
    // Clean up old events (older than 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    setEvents(prev => prev.filter(event => event.timestamp >= thirtyDaysAgo));
  }, []);
  
  // Save events to localStorage when they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('voiceAnalyticsEvents', JSON.stringify(events));
    }
  }, [events]);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('voiceAnalyticsEnabled', isEnabled.toString());
  }, [isEnabled]);
  
  useEffect(() => {
    localStorage.setItem('voiceAnalyticsPrivacyMode', privacyMode.toString());
  }, [privacyMode]);
  
  // Track an analytics event
  const trackEvent = (type: VoiceAnalyticsEventType, data: Record<string, any>) => {
    if (!isEnabled) return;
    
    // Create event object
    const event: VoiceAnalyticsEvent = {
      type,
      timestamp: Date.now(),
      data: privacyMode ? sanitizeData(data) : data,
      sessionId,
      userId: getUserId(),
      keyStage: data.keyStage || undefined,
    };
    
    // Add event to state
    setEvents(prev => [...prev, event]);
    
    // If events exceed 1000, remove oldest events
    if (events.length > 1000) {
      setEvents(prev => prev.slice(-1000));
    }
    
    // Send event to server if configured (not implemented in this version)
    // sendEventToServer(event);
  };
  
  // Get all analytics events
  const getAnalytics = (): VoiceAnalyticsEvent[] => {
    return events;
  };
  
  // Clear all analytics events
  const clearAnalytics = () => {
    setEvents([]);
    localStorage.removeItem('voiceAnalyticsEvents');
  };
  
  // Set analytics enabled state
  const setEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
  };
  
  // Set privacy mode
  const setPrivacyMode = (enabled: boolean) => {
    setIsPrivacyMode(enabled);
  };
  
  // Get user ID (anonymized if privacy mode is enabled)
  const getUserId = (): string | undefined => {
    // In a real implementation, this would get the actual user ID
    // For now, we'll use a placeholder
    const userId = 'user_123';
    
    // If privacy mode is enabled, return undefined
    if (privacyMode) {
      return undefined;
    }
    
    return userId;
  };
  
  // Sanitize data for privacy mode
  const sanitizeData = (data: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};
    
    // Copy safe fields
    Object.entries(data).forEach(([key, value]) => {
      // Skip sensitive fields
      if (['transcript', 'text', 'phrase', 'userInput'].includes(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  };
  
  // Context value
  const value: VoiceAnalyticsContextType = {
    trackEvent,
    getAnalytics,
    clearAnalytics,
    isEnabled,
    setEnabled,
    privacyMode,
    setPrivacyMode,
  };
  
  return (
    <VoiceAnalyticsContext.Provider value={value}>
      {children}
    </VoiceAnalyticsContext.Provider>
  );
}

/**
 * Hook to use voice analytics
 * 
 * This hook provides access to voice analytics tracking functionality.
 */
export function useVoiceAnalytics() {
  const context = useContext(VoiceAnalyticsContext);
  
  if (context === undefined) {
    throw new Error('useVoiceAnalytics must be used within a VoiceAnalyticsProvider');
  }
  
  return context;
}
