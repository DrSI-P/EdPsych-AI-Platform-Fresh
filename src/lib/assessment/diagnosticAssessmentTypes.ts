/**
 * Diagnostic Assessment Types
 * 
 * This file defines the types and interfaces for the comprehensive diagnostic assessment system,
 * which provides detailed insights into student strengths, weaknesses, and learning needs.
 */

import {
  UKKeyStage,
  UKSubject,
  DifficultyLevel,
  CognitiveDomain,
  QuestionType
} from './types';

/**
 * Knowledge Area represents a specific area of knowledge within a subject
 * that can be assessed and tracked for progress
 */
export interface KnowledgeArea {
  id: string;
  name: string;
  description: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  curriculumReferences: string[];
  prerequisiteAreas?: string[]; // IDs of prerequisite knowledge areas
  subsequentAreas?: string[]; // IDs of knowledge areas that build on this one
}

/**
 * Skill represents a specific ability or competency that can be assessed
 * and developed over time
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'cognitive' | 'social' | 'emotional' | 'physical' | 'technical';
  developmentalStages: {
    keyStage: UKKeyStage;
    expectedLevel: number; // 1-5 scale
    description: string;
  }[];
  relatedSkills?: string[]; // IDs of related skills
}

/**
 * Learning Gap represents an identified gap in a student's knowledge or skills
 */
export interface LearningGap {
  id: string;
  studentId: string;
  knowledgeAreaId: string;
  skillId?: string;
  severity: 'minor' | 'moderate' | 'significant';
  detectedAt: Date;
  status: 'identified' | 'addressed' | 'resolved';
  recommendedInterventions?: string[];
  notes?: string;
}

/**
 * Diagnostic Question extends the base Question type with additional
 * diagnostic-specific properties
 */
export interface DiagnosticQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficultyLevel: DifficultyLevel;
  cognitiveDomain: CognitiveDomain;
  knowledgeAreaIds: string[]; // IDs of knowledge areas this question assesses
  skillIds: string[]; // IDs of skills this question assesses
  misconceptionIds?: string[]; // IDs of common misconceptions this question tests for
  hints?: string[];
  explanation?: string;
  timeEstimate: number; // estimated time in seconds
  metadata: {
    curriculumReference?: string;
    bloomsLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
    discriminationIndex?: number; // statistical measure of question quality
    difficultyIndex?: number; // statistical measure of question difficulty
  };
}

/**
 * Diagnostic Assessment represents a comprehensive assessment designed to
 * identify student strengths, weaknesses, and learning gaps
 */
export interface DiagnosticAssessment {
  id: string;
  title: string;
  description: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  targetAgeRange: [number, number]; // min and max age
  knowledgeAreas: string[]; // IDs of knowledge areas covered
  skills: string[]; // IDs of skills assessed
  questions: DiagnosticQuestion[];
  adaptiveSettings?: {
    enabled: boolean;
    initialDifficulty: DifficultyLevel;
    adjustmentThreshold: number;
    maxQuestions: number;
    terminationCriteria: 'fixedLength' | 'precisionThreshold' | 'confidenceLevel';
    terminationValue: number;
  };
  sections?: {
    id: string;
    title: string;
    description?: string;
    questionIds: string[];
  }[];
  estimatedDuration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  version: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  metadata: {
    author: string;
    reviewers?: string[];
    tags: string[];
    curriculumReferences: string[];
    previousVersions?: string[];
  };
}

/**
 * Diagnostic Response represents a student's response to a diagnostic question
 */
export interface DiagnosticResponse {
  id: string;
  studentId: string;
  assessmentId: string;
  questionId: string;
  response: string | string[];
  isCorrect: boolean;
  partialScore?: number; // for partially correct answers
  timeSpent: number; // in seconds
  attempts: number;
  hintsUsed: number;
  timestamp: Date;
  confidence: number; // 1-5 scale of student's confidence
}

/**
 * Diagnostic Result represents the comprehensive results of a diagnostic assessment
 */
export interface DiagnosticResult {
  id: string;
  studentId: string;
  assessmentId: string;
  startTime: Date;
  endTime: Date;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  timeSpent: number; // in seconds
  responses: DiagnosticResponse[];
  knowledgeAreaResults: {
    knowledgeAreaId: string;
    score: number;
    maxPossibleScore: number;
    percentage: number;
    proficiencyLevel: ProficiencyLevel;
    strengths: string[];
    weaknesses: string[];
  }[];
  skillResults: {
    skillId: string;
    score: number;
    maxPossibleScore: number;
    percentage: number;
    proficiencyLevel: ProficiencyLevel;
    observations: string[];
  }[];
  identifiedGaps: LearningGap[];
  recommendations: {
    type: 'resource' | 'activity' | 'intervention' | 'assessment';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    targetGapIds: string[];
    url?: string;
  }[];
  nextSteps: string[];
  overallProficiencyLevel: ProficiencyLevel;
  metadata: {
    adaptivePath?: {
      questionSequence: string[];
      difficultyAdjustments: {
        questionId: string;
        previousDifficulty: DifficultyLevel;
        newDifficulty: DifficultyLevel;
        reason: string;
      }[];
    };
    confidenceAccuracyCorrelation: number; // -1 to 1
    averageResponseTime: number;
    completionRate: number; // percentage of questions answered
  };
}

/**
 * Proficiency Level represents a student's level of mastery in a knowledge area or skill
 */
export enum ProficiencyLevel {
  NEEDS_SUPPORT = 'needs_support',
  DEVELOPING = 'developing',
  APPROACHING = 'approaching',
  MEETING = 'meeting',
  EXCEEDING = 'exceeding',
  MASTERY = 'mastery'
}

/**
 * Diagnostic Assessment Template for generating new assessments
 */
export interface DiagnosticAssessmentTemplate {
  id: string;
  name: string;
  description: string;
  subject: UKSubject;
  keyStage: UKKeyStage;
  knowledgeAreaDistribution: {
    knowledgeAreaId: string;
    percentage: number;
  }[];
  skillDistribution: {
    skillId: string;
    percentage: number;
  }[];
  difficultyDistribution: {
    level: DifficultyLevel;
    percentage: number;
  }[];
  cognitiveDomainDistribution: {
    domain: CognitiveDomain;
    percentage: number;
  }[];
  questionTypeDistribution: {
    type: QuestionType;
    percentage: number;
  }[];
  estimatedDuration: number;
  adaptiveSettings?: {
    enabled: boolean;
    initialDifficulty: DifficultyLevel;
    adjustmentThreshold: number;
    maxQuestions: number;
    terminationCriteria: 'fixedLength' | 'precisionThreshold' | 'confidenceLevel';
    terminationValue: number;
  };
  metadata: {
    author: string;
    tags: string[];
    curriculumReferences: string[];
    version: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Progress Tracking Record for monitoring student progress over time
 */
export interface ProgressTrackingRecord {
  id: string;
  studentId: string;
  knowledgeAreaId: string;
  skillId?: string;
  assessmentResults: {
    assessmentId: string;
    resultId: string;
    date: Date;
    score: number;
    proficiencyLevel: ProficiencyLevel;
  }[];
  currentProficiencyLevel: ProficiencyLevel;
  progressTrend: 'improving' | 'stable' | 'declining' | 'fluctuating' | 'not_enough_data';
  growthRate: number; // percentage change over time
  lastUpdated: Date;
  targetProficiencyLevel: ProficiencyLevel;
  estimatedTimeToTarget?: number; // in days
  interventions: {
    id: string;
    type: string;
    startDate: Date;
    endDate?: Date;
    effectiveness?: number; // 1-5 scale
  }[];
  notes: string[];
}

/**
 * Spaced Repetition Schedule for optimizing knowledge retention
 */
export interface SpacedRepetitionSchedule {
  id: string;
  studentId: string;
  knowledgeAreaId: string;
  initialAssessmentId: string;
  initialProficiencyLevel: ProficiencyLevel;
  repetitionIntervals: {
    repetitionNumber: number;
    intervalDays: number;
    scheduledDate: Date;
    actualDate?: Date;
    assessmentId?: string;
    resultId?: string;
    proficiencyLevel?: ProficiencyLevel;
    completed: boolean;
  }[];
  algorithm: 'sm2' | 'leitner' | 'adaptive' | 'custom';
  algorithmParameters: {
    easeFactor?: number;
    intervalModifier?: number;
    failureSetback?: number;
  };
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  effectiveness?: number; // 1-5 scale based on retention improvement
}

/**
 * Learning Analytics Dashboard configuration for visualizing progress
 */
export interface LearningAnalyticsDashboard {
  id: string;
  studentId: string;
  teacherId?: string;
  parentId?: string;
  title: string;
  description?: string;
  widgets: {
    id: string;
    type: 'progress_chart' | 'knowledge_map' | 'skill_radar' | 'gap_analysis' | 
          'time_series' | 'comparison' | 'prediction' | 'recommendation' | 'summary';
    title: string;
    position: { x: number; y: number; width: number; height: number };
    settings: {
      dataSource: {
        type: 'assessment' | 'progress' | 'gap' | 'repetition' | 'combined';
        filters: Record<string, any>;
      };
      visualization: {
        type: 'line' | 'bar' | 'radar' | 'heatmap' | 'scatter' | 'pie' | 'table' | 'card';
        colorScheme: string;
        showLegend: boolean;
        showAxes: boolean;
        interactive: boolean;
      };
      timeRange: 'week' | 'month' | 'term' | 'year' | 'all' | 'custom';
      customTimeRange?: { start: Date; end: Date };
      refreshRate?: number; // in minutes, for auto-refresh
    };
  }[];
  defaultTimeRange: 'week' | 'month' | 'term' | 'year' | 'all';
  accessControl: {
    studentVisible: boolean;
    teacherVisible: boolean;
    parentVisible: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
