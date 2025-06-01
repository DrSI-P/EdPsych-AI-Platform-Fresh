/**
 * AI-Powered Educational Guidance System Types
 * 
 * This file defines the core types and interfaces for the AI guidance system,
 * which provides personalized learning paths and adaptive content suggestions.
 */

// Learning style types based on VARK model
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
  MULTIMODAL = 'multimodal'
}

// UK curriculum key stages
export enum KeyStage {
  EARLY_YEARS = 'early_years',
  KS1 = 'ks1',
  KS2 = 'ks2',
  KS3 = 'ks3',
  KS4 = 'ks4',
  KS5 = 'ks5'
}

// Subject areas aligned with UK curriculum
export enum SubjectArea {
  ENGLISH = 'english',
  MATHEMATICS = 'mathematics',
  SCIENCE = 'science',
  COMPUTING = 'computing',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  LANGUAGES = 'languages',
  ART_AND_DESIGN = 'art_and_design',
  MUSIC = 'music',
  PHYSICAL_EDUCATION = 'physical_education',
  DESIGN_AND_TECHNOLOGY = 'design_and_technology',
  CITIZENSHIP = 'citizenship',
  PSHE = 'pshe',
  RELIGIOUS_EDUCATION = 'religious_education'
}

// Special educational needs categories
export enum SENCategory {
  COGNITION_AND_LEARNING = 'cognition_and_learning',
  COMMUNICATION_AND_INTERACTION = 'communication_and_interaction',
  SOCIAL_EMOTIONAL_MENTAL_HEALTH = 'social_emotional_mental_health',
  SENSORY_AND_PHYSICAL = 'sensory_and_physical'
}

// Specific learning difficulties
export enum SpecificLearningDifficulty {
  DYSLEXIA = 'dyslexia',
  DYSPRAXIA = 'dyspraxia',
  DYSCALCULIA = 'dyscalculia',
  ADHD = 'adhd',
  ASD = 'asd',
  GLOBAL_DEVELOPMENTAL_DELAY = 'global_developmental_delay',
  ATTACHMENT_DIFFICULTY = 'attachment_difficulty',
  EBSNA = 'emotionally_based_school_non_attendance',
  ANXIETY = 'anxiety',
  ODD = 'odd',
  PDA = 'pathological_demand_avoidance'
}

// Learner profile interface
export interface LearnerProfile {
  id: string;
  name: string;
  age: number;
  keyStage: KeyStage;
  learningStyles: {
    [key in LearningStyle]?: number; // Percentage strength in each style
  };
  subjectStrengths: {
    [key in SubjectArea]?: number; // Proficiency level from 0-100
  };
  subjectInterests: {
    [key in SubjectArea]?: number; // Interest level from 0-100
  };
  specialEducationalNeeds?: {
    categories: SENCategory[];
    specificDifficulties?: SpecificLearningDifficulty[];
    accommodations?: string[];
  };
  previousAssessments: Assessment[];
  learningGoals: LearningGoal[];
  engagementMetrics: EngagementMetrics;
  lastUpdated: Date;
}

// Assessment interface
export interface Assessment {
  id: string;
  title: string;
  subject: SubjectArea;
  keyStage: KeyStage;
  dateCompleted: Date;
  score: number; // Percentage
  strengths: string[];
  areasForImprovement: string[];
  teacherFeedback?: string;
  duration: number; // In minutes
  questionBreakdown?: {
    questionId: string;
    correct: boolean;
    timeSpent: number; // In seconds
    difficulty: number; // 1-5 scale
    conceptTested: string;
  }[];
}

// Learning goal interface
export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  subject: SubjectArea;
  targetDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // Percentage
  priority: 'low' | 'medium' | 'high';
  associatedCurriculumPoints: string[];
  createdBy: 'student' | 'teacher' | 'parent' | 'system';
  createdAt: Date;
}

// Engagement metrics interface
export interface EngagementMetrics {
  averageSessionDuration: number; // In minutes
  sessionsPerWeek: number;
  completionRate: number; // Percentage of assigned tasks completed
  responseTime: number; // Average time to respond to questions in seconds
  focusScore: number; // 0-100 scale measuring focus during sessions
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening';
  preferredContentTypes: string[]; // e.g., videos, interactive, text, etc.
  challengeLevel: number; // 1-5 scale of preferred challenge level
}

// Learning path interface
export interface LearningPath {
  id: string;
  learnerId: string;
  title: string;
  description: string;
  subject: SubjectArea;
  keyStage: KeyStage;
  objectives: string[];
  estimatedDuration: number; // In hours
  difficulty: number; // 1-5 scale
  modules: LearningModule[];
  adaptivityRules: AdaptivityRule[];
  createdAt: Date;
  updatedAt: Date;
  completionStatus: number; // Percentage
  alignedToLearningStyle: LearningStyle;
}

// Learning module interface
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  prerequisiteModules: string[]; // IDs of modules that must be completed first
  learningOutcomes: string[];
  estimatedDuration: number; // In minutes
  difficulty: number; // 1-5 scale
  activities: LearningActivity[];
  assessments: ModuleAssessment[];
  completionStatus: number; // Percentage
  unlocked: boolean;
}

// Learning activity interface
export interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: 'video' | 'reading' | 'interactive' | 'discussion' | 'practise' | 'reflection';
  content: {
    url?: string;
    text?: string;
    interactiveId?: string;
    attachments?: string[];
  };
  duration: number; // In minutes
  learningStyleAlignment: {
    [key in LearningStyle]?: number; // How well it aligns with each style (0-100)
  };
  difficulty: number; // 1-5 scale
  completed: boolean;
  feedback?: {
    rating: number; // 1-5 scale
    comments: string;
  };
}

// Module assessment interface
export interface ModuleAssessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  passingScore: number; // Percentage
  maxAttempts: number;
  timeLimit?: number; // In minutes
  completed: boolean;
  attempts: {
    date: Date;
    score: number;
    duration: number; // In minutes
    questionResults: {
      questionId: string;
      correct: boolean;
      timeSpent: number; // In seconds
    }[];
  }[];
}

// Assessment question interface
export interface AssessmentQuestion {
  id: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'fill_in_blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: number; // 1-5 scale
  conceptTested: string;
  curriculumPoint: string;
}

// Adaptivity rule interface
export interface AdaptivityRule {
  id: string;
  condition: {
    metric: 'score' | 'time' | 'engagement' | 'attempts';
    operator: 'less_than' | 'greater_than' | 'equal_to' | 'not_equal_to';
    value: number;
  };
  action: {
    type: 'change_difficulty' | 'provide_support' | 'skip_content' | 'recommend_review' | 'celebrate_achievement';
    parameters: {
      [key: string]: any;
    };
  };
  priority: number; // Higher number = higher priority
  description: string;
}

// Content suggestion interface
export interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  contentType: 'video' | 'article' | 'interactive' | 'assessment' | 'practise';
  subject: SubjectArea;
  keyStage: KeyStage;
  url?: string;
  learningStyleAlignment: {
    [key in LearningStyle]?: number; // How well it aligns with each style (0-100)
  };
  relevanceScore: number; // 0-100
  reason: string; // Why this content is being suggested
  suggestedAt: Date;
  viewed: boolean;
  feedback?: {
    helpful: boolean;
    comments?: string;
  };
}

// Intervention alert interface
export interface InterventionAlert {
  id: string;
  learnerId: string;
  alertType: 'performance_drop' | 'engagement_drop' | 'goal_at_risk' | 'achievement' | 'pattern_detected';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  metrics: {
    [key: string]: number; // Relevant metrics that triggered the alert
  };
  suggestedActions: {
    actionType: string;
    description: string;
    resources?: string[];
  }[];
  createdAt: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
  outcome?: string;
}

// Progress report interface
export interface ProgressReport {
  id: string;
  learnerId: string;
  period: {
    start: Date;
    end: Date;
  };
  overallProgress: number; // Percentage
  subjectProgress: {
    [key in SubjectArea]?: number; // Percentage
  };
  goalsAchieved: number;
  goalsInProgress: number;
  timeSpent: number; // In hours
  strengths: {
    subject: SubjectArea;
    conceptsStrong: string[];
    evidence: string;
  }[];
  areasForImprovement: {
    subject: SubjectArea;
    conceptsToImprove: string[];
    suggestedActivities: string[];
  }[];
  nextSteps: string[];
  generatedAt: Date;
}

// AI guidance system configuration
export interface GuidanceSystemConfig {
  adaptivityLevel: 'low' | 'medium' | 'high';
  interventionThreshold: number; // 0-100, higher means less sensitive
  contentFilterLevel: 'low' | 'medium' | 'high';
  maxSuggestionsPerDay: number;
  enabledFeatures: {
    learningPathRecommendations: boolean;
    contentSuggestions: boolean;
    interventionAlerts: boolean;
    progressReports: boolean;
    achievementCelebrations: boolean;
  };
  userPreferences: {
    notificationFrequency: 'low' | 'medium' | 'high';
    dataUsageConsent: boolean;
    shareProgressWithTeachers: boolean;
    shareProgressWithParents: boolean;
  };
}
