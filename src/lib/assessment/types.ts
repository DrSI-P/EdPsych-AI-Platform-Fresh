/**
 * Interactive Assessment Engine Types
 * 
 * This file defines the core types for the EdPsych-AI-Education-Platform assessment system.
 * The assessment engine is designed to provide dynamic, adaptive assessments aligned with
 * UK curriculum standards and evidence-based educational psychology principles.
 */

import { z } from 'zod';
import { SupportedLanguage } from '../i18n/types';

/**
 * UK Key Stage enum
 * Represents the key stages in the UK education system
 */
export enum UKKeyStage {
  EARLY_YEARS = 'early_years',
  KEY_STAGE_1 = 'key_stage_1',
  KEY_STAGE_2 = 'key_stage_2',
  KEY_STAGE_3 = 'key_stage_3',
  KEY_STAGE_4 = 'key_stage_4',
  KEY_STAGE_5 = 'key_stage_5',
}

/**
 * UK Subject enum
 * Core and foundation subjects in the UK curriculum
 */
export enum UKSubject {
  // Core subjects
  ENGLISH = 'english',
  MATHEMATICS = 'mathematics',
  SCIENCE = 'science',
  
  // Foundation subjects
  ART_AND_DESIGN = 'art_and_design',
  CITIZENSHIP = 'citizenship',
  COMPUTING = 'computing',
  DESIGN_AND_TECHNOLOGY = 'design_and_technology',
  GEOGRAPHY = 'geography',
  HISTORY = 'history',
  LANGUAGES = 'languages',
  MUSIC = 'music',
  PHYSICAL_EDUCATION = 'physical_education',
  
  // Additional subjects
  RELIGIOUS_EDUCATION = 'religious_education',
  PSHE = 'pshe', // Personal, Social, Health and Economic education
  RELATIONSHIPS_EDUCATION = 'relationships_education',
}

/**
 * Assessment type enum
 * Different types of assessments based on purpose
 */
export enum AssessmentType {
  DIAGNOSTIC = 'diagnostic',
  FORMATIVE = 'formative',
  SUMMATIVE = 'summative',
  SELF_ASSESSMENT = 'self_assessment',
  PEER_ASSESSMENT = 'peer_assessment',
  BASELINE = 'baseline',
  PROGRESS_CHECK = 'progress_check',
}

/**
 * Question type enum
 * Different types of questions that can be included in assessments
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  MULTIPLE_SELECT = 'multiple_select',
  SHORT_ANSWER = 'short_answer',
  LONG_ANSWER = 'long_answer',
  MATCHING = 'matching',
  ORDERING = 'ordering',
  FILL_IN_BLANK = 'fill_in_blank',
  DRAG_AND_DROP = 'drag_and_drop',
  HOTSPOT = 'hotspot',
  DRAWING = 'drawing',
  FILE_UPLOAD = 'file_upload',
  AUDIO_RESPONSE = 'audio_response',
  VIDEO_RESPONSE = 'video_response',
  INTERACTIVE_SIMULATION = 'interactive_simulation',
}

/**
 * Difficulty level enum
 * Represents the difficulty levels for questions and assessments
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  FOUNDATION = 'foundation',
  INTERMEDIATE = 'intermediate',
  HIGHER = 'higher',
  ADVANCED = 'advanced',
  CHALLENGE = 'challenge',
}

/**
 * Cognitive domain enum based on Bloom's Taxonomy
 * Used to categorize questions by cognitive skill level
 */
export enum CognitiveDomain {
  REMEMBER = 'remember',
  UNDERSTAND = 'understand',
  APPLY = 'apply',
  Analyse = 'analyse',
  EVALUATE = 'evaluate',
  CREATE = 'create',
}

/**
 * Learning style enum
 * Based on VARK model and other learning style frameworks
 */
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
  MULTIMODAL = 'multimodal',
}

/**
 * Special educational needs categories
 * Based on UK SEN categories
 */
export enum SENCategory {
  SPECIFIC_LEARNING_DIFFICULTY = 'specific_learning_difficulty', // Dyslexia, Dyscalculia, etc.
  MODERATE_LEARNING_DIFFICULTY = 'moderate_learning_difficulty',
  SEVERE_LEARNING_DIFFICULTY = 'severe_learning_difficulty',
  PROFOUND_MULTIPLE_LEARNING_DIFFICULTY = 'profound_multiple_learning_difficulty',
  SOCIAL_EMOTIONAL_MENTAL_HEALTH = 'social_emotional_mental_health',
  SPEECH_LANGUAGE_COMMUNICATION = 'speech_language_communication',
  HEARING_IMPAIRMENT = 'hearing_impairment',
  VISUAL_IMPAIRMENT = 'visual_impairment',
  MULTI_SENSORY_IMPAIRMENT = 'multi_sensory_impairment',
  PHYSICAL_DISABILITY = 'physical_disability',
  AUTISTIC_SPECTRUM_DISORDER = 'autistic_spectrum_disorder',
  OTHER = 'other',
}

/**
 * Assessment metadata schema
 */
export const AssessmentMetadataSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  keyStage: z.nativeEnum(UKKeyStage),
  subject: z.nativeEnum(UKSubject),
  topics: z.array(z.string()),
  assessmentType: z.nativeEnum(AssessmentType),
  targetAgeRange: z.object({
    min: z.number().min(3).max(19),
    max: z.number().min(3).max(19),
  }),
  estimatedDuration: z.number().min(1).max(180), // in minutes
  difficultyLevel: z.nativeEnum(DifficultyLevel),
  tags: z.array(z.string()).optional(),
  curriculumLinks: z.array(z.string()).optional(),
  author: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  language: z.nativeEnum(SupportedLanguage).default(SupportedLanguage.ENGLISH_UK),
  adaptiveDifficulty: z.boolean().default(false),
  accessibilityFeatures: z.array(z.string()).optional(),
  senSupport: z.array(z.nativeEnum(SENCategory)).optional(),
  learningStyleFocus: z.array(z.nativeEnum(LearningStyle)).optional(),
});

export type AssessmentMetadata = z.infer<typeof AssessmentMetadataSchema>;

/**
 * Question option schema for multiple choice and similar questions
 */
export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
  feedback: z.string().optional(),
  mediaUrl: z.string().optional(),
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

/**
 * Base question schema that all question types extend
 */
export const BaseQuestionSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(QuestionType),
  text: z.string(),
  instructions: z.string().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(['image', 'audio', 'video', 'interactive']).optional(),
  difficultyLevel: z.nativeEnum(DifficultyLevel),
  cognitiveDomain: z.nativeEnum(CognitiveDomain),
  learningStyleFocus: z.array(z.nativeEnum(LearningStyle)).optional(),
  points: z.number().default(1),
  tags: z.array(z.string()).optional(),
  curriculumLinks: z.array(z.string()).optional(),
  timeLimit: z.number().optional(), // in seconds
  language: z.nativeEnum(SupportedLanguage).default(SupportedLanguage.ENGLISH_UK),
  accessibilityFeatures: z.array(z.string()).optional(),
  senSupport: z.array(z.nativeEnum(SENCategory)).optional(),
  feedback: z.object({
    general: z.string().optional(),
    correct: z.string().optional(),
    incorrect: z.string().optional(),
  }).optional(),
});

export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;

/**
 * Multiple choice question schema
 */
export const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionType.MULTIPLE_CHOICE),
  options: z.array(QuestionOptionSchema).min(2),
  randomizeOptions: z.boolean().default(false),
  correctOptionId: z.string(),
});

export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestionSchema>;

/**
 * Multiple select question schema
 */
export const MultipleSelectQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionType.MULTIPLE_SELECT),
  options: z.array(QuestionOptionSchema).min(2),
  randomizeOptions: z.boolean().default(false),
  correctOptionIds: z.array(z.string()).min(1),
  partialCredit: z.boolean().default(true),
});

export type MultipleSelectQuestion = z.infer<typeof MultipleSelectQuestionSchema>;

/**
 * Short answer question schema
 */
export const ShortAnswerQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionType.SHORT_ANSWER),
  expectedAnswer: z.string(),
  alternativeAnswers: z.array(z.string()).optional(),
  caseSensitive: z.boolean().default(false),
  wordLimit: z.number().optional(),
  autoGrade: z.boolean().default(true),
});

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;

/**
 * Long answer question schema
 */
export const LongAnswerQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionType.LONG_ANSWER),
  rubric: z.array(z.object({
    criterion: z.string(),
    description: z.string(),
    maxPoints: z.number(),
  })).optional(),
  wordLimit: z.number().optional(),
  autoGrade: z.boolean().default(false),
  sampleAnswer: z.string().optional(),
});

export type LongAnswerQuestion = z.infer<typeof LongAnswerQuestionSchema>;

/**
 * Matching question schema
 */
export const MatchingQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionType.MATCHING),
  pairs: z.array(z.object({
    id: z.string(),
    left: z.string(),
    right: z.string(),
    leftMediaUrl: z.string().optional(),
    rightMediaUrl: z.string().optional(),
  })).min(2),
  randomizeOrder: z.boolean().default(true),
  partialCredit: z.boolean().default(true),
});

export type MatchingQuestion = z.infer<typeof MatchingQuestionSchema>;

/**
 * Ordering question schema
 */
export const OrderingQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionType.ORDERING),
  items: z.array(z.object({
    id: z.string(),
    text: z.string(),
    mediaUrl: z.string().optional(),
  })).min(2),
  correctOrder: z.array(z.string()),
  randomizeInitialOrder: z.boolean().default(true),
  partialCredit: z.boolean().default(true),
});

export type OrderingQuestion = z.infer<typeof OrderingQuestionSchema>;

/**
 * Fill in blank question schema
 */
export const FillInBlankQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionType.FILL_IN_BLANK),
  textWithBlanks: z.string(),
  blanks: z.array(z.object({
    id: z.string(),
    correctAnswers: z.array(z.string()).min(1),
    caseSensitive: z.boolean().default(false),
    feedback: z.string().optional(),
  })).min(1),
  partialCredit: z.boolean().default(true),
});

export type FillInBlankQuestion = z.infer<typeof FillInBlankQuestionSchema>;

/**
 * Union type for all question types
 */
export type Question = 
  | MultipleChoiceQuestion
  | MultipleSelectQuestion
  | ShortAnswerQuestion
  | LongAnswerQuestion
  | MatchingQuestion
  | OrderingQuestion
  | FillInBlankQuestion;

/**
 * Assessment schema
 */
export const AssessmentSchema = z.object({
  metadata: AssessmentMetadataSchema,
  questions: z.array(z.union([
    MultipleChoiceQuestionSchema,
    MultipleSelectQuestionSchema,
    ShortAnswerQuestionSchema,
    LongAnswerQuestionSchema,
    MatchingQuestionSchema,
    OrderingQuestionSchema,
    FillInBlankQuestionSchema,
  ])).min(1),
  settings: z.object({
    randomizeQuestions: z.boolean().default(false),
    showFeedback: z.enum(['none', 'immediate', 'end']).default('end'),
    passingScore: z.number().min(0).max(100).default(60), // percentage
    maxAttempts: z.number().min(1).optional(),
    timeLimit: z.number().optional(), // in minutes
    showResults: z.boolean().default(true),
    allowReview: z.boolean().default(true),
    adaptiveDifficulty: z.object({
      enabled: z.boolean().default(false),
      initialLevel: z.nativeEnum(DifficultyLevel).default(DifficultyLevel.INTERMEDIATE),
      adjustmentThreshold: z.number().min(0).max(100).default(70), // percentage
    }).optional(),
  }),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    questionIds: z.array(z.string()),
  })).optional(),
});

export type Assessment = z.infer<typeof AssessmentSchema>;

/**
 * Student response to a question
 */
export const QuestionResponseSchema = z.object({
  questionId: z.string().uuid(),
  responseData: z.any(), // Varies based on question type
  startTime: z.date(),
  endTime: z.date(),
  timeSpent: z.number(), // in seconds
  isComplete: z.boolean().default(true),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;

/**
 * Assessment attempt by a student
 */
export const AssessmentAttemptSchema = z.object({
  id: z.string().uuid(),
  assessmentId: z.string().uuid(),
  studentId: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date().optional(),
  isComplete: z.boolean().default(false),
  responses: z.array(QuestionResponseSchema),
  currentQuestionIndex: z.number().default(0),
  score: z.number().optional(),
  percentage: z.number().optional(),
  passed: z.boolean().optional(),
  feedback: z.string().optional(),
  reviewedBy: z.string().uuid().optional(),
  reviewedAt: z.date().optional(),
  reviewComments: z.string().optional(),
});

export type AssessmentAttempt = z.infer<typeof AssessmentAttemptSchema>;

/**
 * Assessment result with detailed analytics
 */
export const AssessmentResultSchema = z.object({
  attemptId: z.string().uuid(),
  assessmentId: z.string().uuid(),
  studentId: z.string().uuid(),
  score: z.number(),
  maxScore: z.number(),
  percentage: z.number(),
  passed: z.boolean(),
  completedAt: z.date(),
  timeSpent: z.number(), // in seconds
  questionResults: z.array(z.object({
    questionId: z.string().uuid(),
    correct: z.boolean(),
    partialScore: z.number().optional(),
    timeSpent: z.number(), // in seconds
    difficultyLevel: z.nativeEnum(DifficultyLevel),
    cognitiveDomain: z.nativeEnum(CognitiveDomain),
  })),
  analytics: z.object({
    byDifficulty: z.record(z.nativeEnum(DifficultyLevel), z.object({
      count: z.number(),
      correct: z.number(),
      percentage: z.number(),
    })),
    byCognitiveDomain: z.record(z.nativeEnum(CognitiveDomain), z.object({
      count: z.number(),
      correct: z.number(),
      percentage: z.number(),
    })),
    strengths: z.array(z.string()),
    areasForImprovement: z.array(z.string()),
    recommendedResources: z.array(z.object({
      id: z.string(),
      title: z.string(),
      type: z.string(),
      url: z.string(),
    })).optional(),
  }),
  feedback: z.object({
    overall: z.string(),
    byTopic: z.record(z.string(), z.string()).optional(),
    nextSteps: z.array(z.string()),
  }),
});

export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;

/**
 * Assessment template for generating dynamic assessments
 */
export const AssessmentTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  keyStage: z.nativeEnum(UKKeyStage),
  subject: z.nativeEnum(UKSubject),
  assessmentType: z.nativeEnum(AssessmentType),
  difficultyLevel: z.nativeEnum(DifficultyLevel),
  questionCount: z.number().min(1),
  questionDistribution: z.array(z.object({
    type: z.nativeEnum(QuestionType),
    percentage: z.number().min(0).max(100),
    count: z.number().optional(),
  })),
  topicDistribution: z.array(z.object({
    topic: z.string(),
    percentage: z.number().min(0).max(100),
    count: z.number().optional(),
  })),
  cognitiveDomainDistribution: z.array(z.object({
    domain: z.nativeEnum(CognitiveDomain),
    percentage: z.number().min(0).max(100),
    count: z.number().optional(),
  })),
  settings: z.object({
    randomizeQuestions: z.boolean().default(true),
    showFeedback: z.enum(['none', 'immediate', 'end']).default('end'),
    passingScore: z.number().min(0).max(100).default(60),
    timeLimit: z.number().optional(),
    adaptiveDifficulty: z.boolean().default(false),
  }),
  accessibilityOptions: z.object({
    provideSenSupport: z.boolean().default(false),
    adaptToLearningStyle: z.boolean().default(false),
    includeMultimodalContent: z.boolean().default(false),
  }),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AssessmentTemplate = z.infer<typeof AssessmentTemplateSchema>;

/**
 * Question bank for storing and retrieving questions
 */
export interface QuestionBank {
  addQuestion: (question: Question) => Promise<string>;
  getQuestion: (id: string) => Promise<Question | null>;
  updateQuestion: (id: string, question: Question) => Promise<boolean>;
  deleteQuestion: (id: string) => Promise<boolean>;
  searchQuestions: (params: {
    keyStage?: UKKeyStage;
    subject?: UKSubject;
    topics?: string[];
    types?: QuestionType[];
    difficultyLevel?: DifficultyLevel;
    cognitiveDomain?: CognitiveDomain;
    tags?: string[];
  }) => Promise<Question[]>;
  getQuestionCount: (params?: {
    keyStage?: UKKeyStage;
    subject?: UKSubject;
    topics?: string[];
    types?: QuestionType[];
    difficultyLevel?: DifficultyLevel;
    cognitiveDomain?: CognitiveDomain;
    tags?: string[];
  }) => Promise<number>;
}

/**
 * Assessment engine for creating, managing, and analysing assessments
 */
export interface AssessmentEngine {
  createAssessment: (assessment: Assessment) => Promise<string>;
  getAssessment: (id: string) => Promise<Assessment | null>;
  updateAssessment: (id: string, assessment: Assessment) => Promise<boolean>;
  deleteAssessment: (id: string) => Promise<boolean>;
  listAssessments: (params?: {
    keyStage?: UKKeyStage;
    subject?: UKSubject;
    assessmentType?: AssessmentType;
  }) => Promise<AssessmentMetadata[]>;
  
  startAttempt: (assessmentId: string, studentId: string) => Promise<string>;
  submitResponse: (attemptId: string, response: QuestionResponse) => Promise<boolean>;
  completeAttempt: (attemptId: string) => Promise<AssessmentResult>;
  getAttempt: (attemptId: string) => Promise<AssessmentAttempt | null>;
  getStudentAttempts: (studentId: string, assessmentId?: string) => Promise<AssessmentAttempt[]>;
  
  generateAssessment: (template: AssessmentTemplate) => Promise<Assessment>;
  generateAdaptiveQuestion: (attemptId: string, previousResponses: QuestionResponse[]) => Promise<Question>;
  
  analyzeResults: (assessmentId: string) => Promise<{
    attemptCount: number;
    averageScore: number;
    passRate: number;
    questionAnalytics: Record<string, {
      correct: number;
      incorrect: number;
      partiallyCorrect: number;
      averageTimeSpent: number;
    }>;
  }>;
  
  getStudentProgress: (studentId: string, params?: {
    keyStage?: UKKeyStage;
    subject?: UKSubject;
    timeframe?: 'week' | 'month' | 'term' | 'year';
  }) => Promise<{
    assessmentsCompleted: number;
    averageScore: number;
    strengths: string[];
    areasForImprovement: string[];
    progressOverTime: Array<{
      date: Date;
      score: number;
      assessmentId: string;
    }>;
  }>;
}

/**
 * Evidence-based feedback generator
 */
export interface FeedbackGenerator {
  generateQuestionFeedback: (question: Question, response: any, correct: boolean) => string;
  generateAssessmentFeedback: (result: AssessmentResult) => {
    overall: string;
    byTopic: Record<string, string>;
    nextSteps: string[];
  };
  generateProgressFeedback: (studentId: string, subject: UKSubject, timeframe: 'week' | 'month' | 'term' | 'year') => Promise<{
    summary: string;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  }>;
}

/**
 * Adaptive difficulty engine
 */
export interface AdaptiveDifficultyEngine {
  calculateNextQuestionDifficulty: (previousResponses: QuestionResponse[], currentDifficulty: DifficultyLevel) => DifficultyLevel;
  estimateStudentAbility: (responses: QuestionResponse[]) => number; // IRT-based ability estimate
  selectOptimalQuestion: (questionBank: Question[], studentAbility: number) => Question;
  updateDifficultyModel: (responses: QuestionResponse[]) => Promise<void>;
}
