/**
 * Assessment Tool Types and Interfaces
 * 
 * This file defines the types and interfaces used in the assessment tool
 * integration for the EdPsych Connect platform.
 */

/**
 * Assessment Tool Type
 */
export enum AssessmentToolType {
  FORMATIVE = 'formative',
  SUMMATIVE = 'summative',
  DIAGNOSTIC = 'diagnostic',
  ADAPTIVE = 'adaptive',
  SURVEY = 'survey'
}

/**
 * Assessment Tool Status
 */
export enum AssessmentToolStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ERROR = 'error'
}

/**
 * Question Type
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  MULTIPLE_ANSWER = 'multiple_answer',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching',
  ORDERING = 'ordering',
  FILL_IN_BLANK = 'fill_in_blank',
  NUMERIC = 'numeric',
  HOTSPOT = 'hotspot',
  DRAWING = 'drawing'
}

/**
 * Assessment Tool
 */
export interface AssessmentTool {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: AssessmentToolType;
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  oauthClientId?: string;
  oauthClientSecret?: string;
  oauthTokenUrl?: string;
  status: AssessmentToolStatus;
  supportedQuestionTypes: QuestionType[];
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Assessment
 */
export interface Assessment {
  id: string;
  tenantId: string;
  toolId: string;
  externalId: string;
  title: string;
  description?: string;
  instructions?: string;
  timeLimit?: number; // in minutes
  passingScore?: number; // 0-100
  maxAttempts?: number;
  randomizeQuestions?: boolean;
  showFeedback?: boolean;
  showResults?: boolean;
  subjects?: string[];
  keyStages?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Question
 */
export interface Question {
  id: string;
  tenantId: string;
  assessmentId: string;
  externalId: string;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  points?: number;
  feedback?: string;
  hints?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Question Option
 */
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  feedback?: string;
  metadata?: Record<string, any>;
}

/**
 * Assessment Attempt
 */
export interface AssessmentAttempt {
  id: string;
  tenantId: string;
  assessmentId: string;
  userId: string;
  contextId?: string; // e.g., class, course, or learning path ID
  startedAt: Date;
  completedAt?: Date;
  timeSpent?: number; // in seconds
  score?: number; // 0-100
  passed?: boolean;
  answers?: QuestionAnswer[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Question Answer
 */
export interface QuestionAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  points?: number;
  timeSpent?: number; // in seconds
  metadata?: Record<string, any>;
}

/**
 * Assessment Search Query
 */
export interface AssessmentSearchQuery {
  query?: string;
  tools?: string[];
  types?: AssessmentToolType[];
  subjects?: string[];
  keyStages?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Assessment Search Result
 */
export interface AssessmentSearchResult {
  items: Assessment[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Assessment Tool Webhook Event
 */
export interface AssessmentToolWebhookEvent {
  id: string;
  tenantId: string;
  toolId: string;
  eventType: string;
  payload: any;
  processedAt?: Date;
  status: 'pending' | 'processed' | 'failed';
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}
