// Missing pages that need to be created based on navigation
export const MISSING_PAGES = [
  // Student Features
  '/student/dashboard',
  '/student/learning-path', 
  '/student/assessment',
  '/student/resources',
  '/student-voice',
  '/student-analytics',
  
  // Educator Tools
  '/innovations/educator-dashboard',
  '/educator/assessment-builder',
  '/educator/classroom-management', 
  '/educator/curriculum-planning',
  '/educator/data-analytics',
  '/educator/parent-communication',
  
  // AI Innovations
  '/ai-powered-tools',
  '/ai-assessment',
  '/ai-content-generation',
  '/ai-curriculum-design',
  '/ai-personalization',
  '/ai-voice-analytics',
  
  // Learning Tools
  '/learning-analytics',
  '/learning-path-optimization',
  '/learning-style-assessment',
  '/curriculum-planning',
  '/assessment-analytics',
  '/progress-pacing',
  
  // Accessibility
  '/accessibility/speech-to-text',
  '/accessibility/text-to-speech',
  '/accessibility/voice-navigation',
  '/accessibility/enhanced',
  '/voice-input',
  '/speech-recognition',
  
  // Special Needs
  '/special-needs/emotional-regulation',
  '/special-needs/iep-504-plan',
  '/special-needs/intervention-analytics',
  '/special-needs/progress-monitoring',
  '/special-needs/sensory-regulation',
  '/special-needs/mindfulness',
  
  // Restorative Justice
  '/restorative-justice/circle-process',
  '/restorative-justice/conflict-resolution',
  '/restorative-justice/community-building',
  '/restorative-justice/staff-training',
  '/restorative-justice/parent-education',
  '/restorative-justice/reflection-prompts',
  
  // Professional Development
  '/professional-development/cpd-tracking',
  '/professional-development/certification',
  '/professional-development/mentor-matching',
  '/professional-development/research-collaboration',
  '/professional-development/webinars',
  '/professional-development/portfolio',
  
  // Videos & Media
  '/ai-avatar-videos',
  '/interactive-avatar',
  '/videos/integration',
  '/multimedia-content',
  '/immersive-experiences',
  
  // About Pages
  '/about',
  '/about/team',
  '/contact',
  '/privacy',
  '/terms',
  
  // Additional Missing Pages
  '/platform-overview',
  '/meet-dr-scott',
  '/blog',
  '/assessments',
  '/parent/dashboard',
  '/professional/dashboard'
];

export const NAVIGATION_FIXES_NEEDED = [
  {
    issue: 'Blog missing from navigation',
    fix: 'Add blog category to navigation menu',
    priority: 'high'
  },
  {
    issue: 'Meet Dr. Scott not accessible',
    fix: 'Add Meet Dr. Scott to main navigation or about section',
    priority: 'high'
  },
  {
    issue: 'Platform Overview referenced but missing',
    fix: 'Create platform overview page',
    priority: 'medium'
  },
  {
    issue: 'Inconsistent route patterns',
    fix: 'Standardize all routes to follow consistent pattern',
    priority: 'medium'
  },
  {
    issue: 'Logo image path likely broken',
    fix: 'Verify and fix logo image path',
    priority: 'low'
  }
];

