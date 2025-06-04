// Avatar System Index - EdPsych Connect Platform
// Exports all avatar-related components and utilities

import React from 'react';

export { default as AvatarVideoPlayer } from './AvatarVideoPlayer';
export { default as AvatarProvider, useAvatar, usePageAvatar } from './AvatarProvider';
export { default as FloatingAvatar } from './FloatingAvatar';

// Avatar system utilities and types
export interface AvatarConfig {
  id: string;
  name: string;
  role: string;
  context: string;
  script?: string;
  autoShow?: boolean;
}

// Quick avatar integration hook for pages
export const useQuickAvatar = (config: AvatarConfig) => {
  const { showAvatar } = useAvatar();
  
  React.useEffect(() => {
    if (config.autoShow !== false) {
      showAvatar(config.id, config.script, config.context);
    }
  }, [config, showAvatar]);
};

// Avatar presets for common scenarios
export const AVATAR_PRESETS = {
  HOMEPAGE_WELCOME: {
    id: 'dr-scott',
    context: 'homepage-intro',
    autoShow: true
  },
  DASHBOARD_STUDENT: {
    id: 'leila',
    context: 'dashboard-student',
    autoShow: true
  },
  DASHBOARD_TEACHER: {
    id: 'professor-maya',
    context: 'dashboard-teacher',
    autoShow: true
  },
  DASHBOARD_PARENT: {
    id: 'sarah',
    context: 'dashboard-parent',
    autoShow: true
  },
  ACCESSIBILITY_HELP: {
    id: 'alex',
    context: 'accessibility',
    autoShow: true
  },
  ASSESSMENT_GUIDE: {
    id: 'dr-scott',
    context: 'assessment',
    autoShow: true
  },
  CURRICULUM_PLANNING: {
    id: 'professor-maya',
    context: 'curriculum-planning',
    autoShow: true
  },
  FAMILY_ENGAGEMENT: {
    id: 'sarah',
    context: 'family-engagement',
    autoShow: true
  },
  VOICE_INPUT_HELP: {
    id: 'alex',
    context: 'voice-input',
    autoShow: true
  },
  SEN_SUPPORT: {
    id: 'alex',
    context: 'sen-support',
    autoShow: true
  },
  RESTORATIVE_JUSTICE: {
    id: 'dr-scott',
    context: 'restorative-justice',
    autoShow: true
  },
  PEER_LEARNING: {
    id: 'jamal',
    context: 'peer-learning',
    autoShow: true
  },
  MULTILINGUAL_SUPPORT: {
    id: 'maria',
    context: 'multilingual',
    autoShow: true
  },
  CRISIS_SUPPORT: {
    id: 'dr-scott',
    context: 'crisis-support',
    autoShow: true
  },
  GETTING_STARTED: {
    id: 'dr-scott',
    context: 'getting-started',
    autoShow: true
  }
} as const;

// Helper function to get avatar preset by page context
export const getAvatarPresetForPage = (pathname: string, userRole: string) => {
  if (pathname === '/' || pathname === '/home') {
    return AVATAR_PRESETS.HOMEPAGE_WELCOME;
  }
  
  if (pathname.includes('/dashboard')) {
    switch (userRole.toLowerCase()) {
      case 'student': return AVATAR_PRESETS.DASHBOARD_STUDENT;
      case 'teacher': return AVATAR_PRESETS.DASHBOARD_TEACHER;
      case 'parent': return AVATAR_PRESETS.DASHBOARD_PARENT;
      default: return AVATAR_PRESETS.HOMEPAGE_WELCOME;
    }
  }
  
  if (pathname.includes('/accessibility')) return AVATAR_PRESETS.ACCESSIBILITY_HELP;
  if (pathname.includes('/assessment')) return AVATAR_PRESETS.ASSESSMENT_GUIDE;
  if (pathname.includes('/curriculum')) return AVATAR_PRESETS.CURRICULUM_PLANNING;
  if (pathname.includes('/family')) return AVATAR_PRESETS.FAMILY_ENGAGEMENT;
  if (pathname.includes('/voice')) return AVATAR_PRESETS.VOICE_INPUT_HELP;
  if (pathname.includes('/sen')) return AVATAR_PRESETS.SEN_SUPPORT;
  if (pathname.includes('/restorative')) return AVATAR_PRESETS.RESTORATIVE_JUSTICE;
  if (pathname.includes('/collaboration')) return AVATAR_PRESETS.PEER_LEARNING;
  if (pathname.includes('/multilingual')) return AVATAR_PRESETS.MULTILINGUAL_SUPPORT;
  if (pathname.includes('/crisis')) return AVATAR_PRESETS.CRISIS_SUPPORT;
  if (pathname.includes('/getting-started')) return AVATAR_PRESETS.GETTING_STARTED;
  
  // Default to getting started for unknown pages
  return AVATAR_PRESETS.GETTING_STARTED;
};

