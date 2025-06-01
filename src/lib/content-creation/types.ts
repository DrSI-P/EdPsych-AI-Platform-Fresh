/**
 * Content Creation Studio Types
 * 
 * This file defines the types and interfaces used throughout the Content Creation Studio.
 * It provides a structured type system for content templates, elements, and creation workflows.
 */

/**
 * Content types supported by the Content Creation Studio
 */
export enum ContentType {
  LESSON = 'lesson',
  ASSESSMENT = 'assessment',
  WORKSHEET = 'worksheet',
  PRESENTATION = 'presentation',
  INTERACTIVE = 'interactive',
  VIDEO_SCRIPT = 'video_script',
  INFOGRAPHIC = 'infographic',
  STUDY_GUIDE = 'study_guide',
  FLASHCARDS = 'flashcards',
  QUIZ = 'quiz'
}

/**
 * Learning styles supported for content adaptation
 */
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
  MULTIMODAL = 'multimodal'
}

/**
 * UK curriculum key stages
 */
export enum KeyStage {
  EARLY_YEARS = 'early_years',
  KS1 = 'ks1',
  KS2 = 'ks2',
  KS3 = 'ks3',
  KS4 = 'ks4',
  KS5 = 'ks5'
}

/**
 * Special educational needs categories
 */
export enum SENCategory {
  DYSLEXIA = 'dyslexia',
  DYSPRAXIA = 'dyspraxia',
  DYSCALCULIA = 'dyscalculia',
  ASD = 'asd',
  ADHD = 'adhd',
  HEARING_IMPAIRMENT = 'hearing_impairment',
  VISUAL_IMPAIRMENT = 'visual_impairment',
  SPEECH_LANGUAGE = 'speech_language',
  SOCIAL_EMOTIONAL = 'social_emotional',
  PHYSICAL_DISABILITY = 'physical_disability',
  GLOBAL_DEVELOPMENTAL_DELAY = 'global_developmental_delay',
  EBSNA = 'ebsna', // Emotionally Based School Non-Attendance
  PDA = 'pda', // Pathological Demand Avoidance
  ODD = 'odd', // Oppositional Defiant Disorder
  ATTACHMENT_DIFFICULTY = 'attachment_difficulty',
  GENERAL = 'general'
}

/**
 * Content element types that can be used in content creation
 */
export enum ContentElementType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  INTERACTIVE = 'interactive',
  QUESTION = 'question',
  TABLE = 'table',
  CHART = 'chart',
  DIAGRAM = 'diagram',
  EQUATION = 'equation',
  CODE = 'code',
  EMBED = 'embed',
  FILE = 'file',
  LINK = 'link',
  SEPARATOR = 'separator'
}

/**
 * Content sharing permissions
 */
export enum ContentPermission {
  PRIVATE = 'private',
  SHARED_VIEW = 'shared_view',
  SHARED_EDIT = 'shared_edit',
  PUBLIC_VIEW = 'public_view',
  PUBLIC_EDIT = 'public_edit'
}

/**
 * Content metadata interface
 */
export interface ContentMetadata {
  id?: string;
  title: string;
  description: string;
  contentType: ContentType;
  keyStage: KeyStage;
  subject: string;
  topics: string[];
  learningObjectives: string[];
  targetLearningStyles: LearningStyle[];
  senSupport?: SENCategory[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDuration?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  keywords: string[];
  permission: ContentPermission;
  collaborators?: string[];
  version: number;
  isPublished: boolean;
  publishedAt?: Date;
  curriculumLinks?: string[];
  resourceLinks?: string[];
}

/**
 * Base interface for all content elements
 */
export interface ContentElement {
  id: string;
  type: ContentElementType;
  order: number;
  metadata?: Record<string, any>;
}

/**
 * Text element interface
 */
export interface TextElement extends ContentElement {
  type: ContentElementType.TEXT;
  content: string;
  format?: 'plain' | 'markdown' | 'html';
  style?: {
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    textAlign?: 'left' | 'centre' | 'right' | 'justify';
    colour?: string;
    backgroundColor?: string;
  };
}

/**
 * Image element interface
 */
export interface ImageElement extends ContentElement {
  type: ContentElementType.IMAGE;
  src: string;
  alt: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
  alignment?: 'left' | 'centre' | 'right';
}

/**
 * Video element interface
 */
export interface VideoElement extends ContentElement {
  type: ContentElementType.VIDEO;
  src: string;
  title: string;
  description?: string;
  poster?: string;
  duration?: number; // in seconds
  autoplay?: boolean;
  controls?: boolean;
  width?: number | string;
  height?: number | string;
  captions?: {
    src: string;
    language: string;
    label: string;
  }[];
}

/**
 * Audio element interface
 */
export interface AudioElement extends ContentElement {
  type: ContentElementType.AUDIO;
  src: string;
  title: string;
  description?: string;
  duration?: number; // in seconds
  autoplay?: boolean;
  controls?: boolean;
  transcript?: string;
}

/**
 * Question types for assessment content
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching',
  FILL_IN_BLANK = 'fill_in_blank',
  DRAG_DROP = 'drag_drop',
  HOTSPOT = 'hotspot',
  RANKING = 'ranking',
  GROUPING = 'grouping'
}

/**
 * Question element interface
 */
export interface QuestionElement extends ContentElement {
  type: ContentElementType.QUESTION;
  questionType: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in seconds
  hints?: string[];
  feedback?: {
    correct?: string;
    incorrect?: string;
    partial?: string;
  };
}

/**
 * Interactive element interface
 */
export interface InteractiveElement extends ContentElement {
  type: ContentElementType.INTERACTIVE;
  interactiveType: 'simulation' | 'game' | 'exercise' | 'tool';
  config: Record<string, any>;
  instructions?: string;
  completionCriteria?: Record<string, any>;
}

/**
 * Table element interface
 */
export interface TableElement extends ContentElement {
  type: ContentElementType.TABLE;
  headers: string[];
  rows: string[][];
  caption?: string;
  style?: {
    width?: string;
    borderColor?: string;
    headerBackgroundColor?: string;
    alternateRowColor?: string;
  };
}

/**
 * Chart element interface
 */
export interface ChartElement extends ContentElement {
  type: ContentElementType.CHART;
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'radar';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }[];
  };
  options?: Record<string, any>;
  width?: number | string;
  height?: number | string;
  caption?: string;
}

/**
 * Content template interface
 */
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  keyStage: KeyStage[];
  subjects: string[];
  structure: {
    sections: {
      title: string;
      description?: string;
      elements: {
        type: ContentElementType;
        placeholder?: string;
        required?: boolean;
      }[];
    }[];
  };
  metadata: {
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    usageCount: number;
    rating?: number;
    tags: string[];
  };
  previewImage?: string;
}

/**
 * Content document interface - represents a complete content item
 */
export interface ContentDocument {
  metadata: ContentMetadata;
  elements: ContentElement[];
  version: number;
  settings: {
    theme?: string;
    layout?: string;
    accessibility?: {
      highContrast?: boolean;
      largeText?: boolean;
      screenReaderOptimized?: boolean;
      reducedMotion?: boolean;
    };
  };
  analytics?: {
    views: number;
    completions: number;
    averageRating: number;
    feedback: {
      userId: string;
      rating: number;
      comment?: string;
      timestamp: Date;
    }[];
  };
}

/**
 * AI generation prompt interface
 */
export interface AIGenerationPrompt {
  contentType: ContentType;
  subject: string;
  topic: string;
  keyStage: KeyStage;
  learningObjectives: string[];
  targetLearningStyles?: LearningStyle[];
  senSupport?: SENCategory[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in minutes
  additionalInstructions?: string;
  existingContent?: Partial<ContentDocument>;
  generationType: 'complete' | 'outline' | 'enhance' | 'adapt' | 'simplify' | 'extend';
}

/**
 * Content sharing invitation interface
 */
export interface ContentSharingInvitation {
  id: string;
  contentId: string;
  inviterId: string;
  inviteeEmail: string;
  permission: ContentPermission;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  expiresAt: Date;
  message?: string;
}

/**
 * Content library filter interface
 */
export interface ContentLibraryFilter {
  contentTypes?: ContentType[];
  keyStages?: KeyStage[];
  subjects?: string[];
  topics?: string[];
  learningStyles?: LearningStyle[];
  senCategories?: SENCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  authors?: string[];
  permissions?: ContentPermission[];
  isPublished?: boolean;
  searchTerm?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'rating';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Content export format
 */
export enum ContentExportFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  HTML = 'html',
  MARKDOWN = 'markdown',
  JSON = 'json',
  PPTX = 'pptx',
  IMAGE = 'image'
}

/**
 * Content export options interface
 */
export interface ContentExportOptions {
  format: ContentExportFormat;
  includeMetadata: boolean;
  includeAnalytics: boolean;
  optimizeFor?: 'print' | 'digital' | 'accessibility';
  quality?: 'draft' | 'standard' | 'high';
}

/**
 * Content creation service interface
 */
export interface ContentCreationService {
  createContent(metadata: ContentMetadata): Promise<string>;
  getContent(id: string): Promise<ContentDocument>;
  updateContent(id: string, content: Partial<ContentDocument>): Promise<void>;
  deleteContent(id: string): Promise<void>;
  publishContent(id: string): Promise<void>;
  unpublishContent(id: string): Promise<void>;
  listContent(filter: ContentLibraryFilter): Promise<ContentMetadata[]>;
  shareContent(invitation: ContentSharingInvitation): Promise<void>;
  exportContent(id: string, options: ContentExportOptions): Promise<string>;
  generateWithAI(prompt: AIGenerationPrompt): Promise<Partial<ContentDocument>>;
  getTemplates(filter?: Partial<ContentTemplate>): Promise<ContentTemplate[]>;
  createTemplate(template: Omit<ContentTemplate, 'id'>): Promise<string>;
}
