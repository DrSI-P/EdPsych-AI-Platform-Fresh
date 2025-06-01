/**
 * Multilingual Support Types
 * 
 * This file defines the types and interfaces for the multilingual support system
 * of the EdPsych-AI-Education-Platform.
 */

/**
 * Supported languages in the platform
 * Starting with English (default) and common European languages
 * with focus on those most relevant to UK educational settings
 */
export enum SupportedLanguage {
  ENGLISH_UK = 'en-GB',
  WELSH = 'cy',
  POLISH = 'pl',
  URDU = 'ur',
  PUNJABI = 'pa',
  ARABIC = 'ar',
  FRENCH = 'fr',
  SPANISH = 'es',
  GERMAN = 'de',
  ITALIAN = 'it',
  PORTUGUESE = 'pt',
  ROMANIAN = 'ro',
  BENGALI = 'bn',
  CHINESE_SIMPLIFIED = 'zh-CN',
  SOMALI = 'so',
  TURKISH = 'tr',
  // Additional languages for expansion
  GUJARATI = 'gu',
  HINDI = 'hi',
  LITHUANIAN = 'lt',
  LATVIAN = 'lv',
  SLOVAK = 'sk',
  BULGARIAN = 'bg',
  FARSI = 'fa',
  ALBANIAN = 'sq',
  TAMIL = 'ta',
  PASHTO = 'ps'
}

/**
 * Language direction for proper text rendering
 */
export enum TextDirection {
  LTR = 'ltr', // Left to right
  RTL = 'rtl'  // Right to left
}

/**
 * Language metadata including name, native name, and text direction
 */
export interface LanguageMetadata {
  code: SupportedLanguage;
  englishName: string;
  nativeName: string;
  direction: TextDirection;
  flagIcon?: string;
  isEnabled: boolean;
  // Added for language expansion
  ukPrevalence?: 'high' | 'medium' | 'low'; // Prevalence in UK educational settings
  supportLevel?: 'full' | 'partial' | 'basic'; // Level of platform support
  educationalResources?: boolean; // Whether educational resources are available
}

/**
 * Translation namespace categories to organise translations
 */
export enum TranslationNamespace {
  COMMON = 'common',
  NAVIGATION = 'navigation',
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  LESSONS = 'lessons',
  ASSESSMENTS = 'assessments',
  FEEDBACK = 'feedback',
  ACCESSIBILITY = 'accessibility',
  SETTINGS = 'settings',
  ERRORS = 'errors',
  CURRICULUM = 'curriculum',
  SPECIAL_NEEDS = 'special_needs',
  PARENT_TEACHER = 'parent_teacher',
  ADMIN = 'admin',
  // Added for expansion
  DOCUMENTS = 'documents',
  COMMUNICATION = 'communication',
  CULTURAL_NOTES = 'cultural_notes',
  EDUCATIONAL_TERMS = 'educational_terms',
  HELP = 'help'
}

/**
 * Translation entry with key and translated text
 */
export interface TranslationEntry {
  key: string;
  text: string;
  // Added for expansion
  context?: string; // Context information for translators
  lastUpdated?: Date; // When this translation was last updated
  needsReview?: boolean; // Flag for translations that need review
}

/**
 * Translation namespace with multiple translation entries
 */
export interface TranslationNamespaceData {
  namespace: TranslationNamespace;
  translations: TranslationEntry[];
  // Added for expansion
  completionPercentage?: number; // Percentage of completed translations
  lastUpdated?: Date; // When this namespace was last updated
}

/**
 * Complete language pack for a specific language
 */
export interface LanguagePack {
  language: SupportedLanguage;
  namespaces: TranslationNamespaceData[];
  // Added for expansion
  version?: string; // Version of the language pack
  contributors?: string[]; // People who contributed to translations
  lastUpdated?: Date; // When this pack was last updated
  completionStatus?: 'complete' | 'partial' | 'in-progress'; // Overall completion status
}

/**
 * User language preferences
 */
export interface UserLanguagePreferences {
  userId: string;
  primaryLanguage: SupportedLanguage;
  secondaryLanguages: SupportedLanguage[];
  autoDetect: boolean;
  translateContent: boolean;
  translateUserContent: boolean;
  translateCommunications: boolean;
  // Added for expansion
  documentTranslation: boolean; // Whether to translate documents
  preferHumanTranslation: boolean; // Preference for human vs machine translation
  showOriginalText: boolean; // Whether to show original text alongside translation
  translationQualityFeedback: boolean; // Whether to collect feedback on translations
  specializedVocabulary?: string[]; // User-specific vocabulary to maintain
}

/**
 * Translation memory entry to improve consistency
 */
export interface TranslationMemoryEntry {
  sourceText: string;
  sourceLanguage: SupportedLanguage;
  targetText: string;
  targetLanguage: SupportedLanguage;
  context?: string;
  lastUsed: Date;
  frequency: number;
  // Added for expansion
  domain?: string; // Educational domain (math, science, etc.)
  qualityRating?: number; // Rating of translation quality (1-5)
  isVerified?: boolean; // Whether this translation has been verified
  alternatives?: string[]; // Alternative translations
  notes?: string; // Notes about this translation
}

/**
 * Translation request for the translation service
 */
export interface TranslationRequest {
  text: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  namespace?: TranslationNamespace;
  context?: string;
  html?: boolean;
  preserveFormatting?: boolean;
  // Added for expansion
  priority?: 'high' | 'normal' | 'low'; // Priority of translation request
  domain?: string; // Educational domain for context
  preferredEngine?: string; // Preferred translation engine
  maxLength?: number; // Maximum length of translation
  terminology?: Record<string, string>; // Custom terminology mapping
  documentType?: DocumentType; // Type of document if document translation
  batchId?: string; // ID for batch translation requests
}

/**
 * Translation response from the translation service
 */
export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  confidence?: number;
   alternatives?: string[]; // Alternative translations
  engine?: string; // Translation engine used
  processingTime?: number; // Time taken to translate in ms
  characterCount?: number; // Number of characters translated
  glossaryTermsUsed?: string[]; // Glossary terms used in translationlation
  qualityEstimate?: number; // Estimated quality score (0-1)
  needsReview?: boolean; // Whether this translation needs human review
  culturalNotes?: string[]; // Cultural context notes
}

/**
 * Language detection result
 */
export interface LanguageDetectionResult {
  detectedLanguage: SupportedLanguage;
  confidence: number;
  alternatives: Array<{
    language: SupportedLanguage;
    confidence: number;
  }>;
  // Added for expansion
  textSample?: string; // Sample of text used for detection
  detectionMethod?: string; // Method used for detection
  processingTime?: number; // Time taken for detection in ms
}

/**
 * Content localization metadata
 */
export interface ContentLocalizationMetadata {
  contentId: string;
  contentType: 'lesson' | 'assessment' | 'feedback' | 'resource' | 'communication';
  originalLanguage: SupportedLanguage;
  availableTranslations: SupportedLanguage[];
  lastUpdated: Date;
  translationStatus: {
    [key in SupportedLanguage]?: 'complete' | 'partial' | 'machine-translated' | 'needs-review';
  };
  // Added for expansion
  priority?: 'high' | 'medium' | 'low'; // Translation priority
  audience?: string[]; // Target audience for this content
  keywords?: string[]; // Keywords for this content
  curriculumLinks?: string[]; // Links to curriculum standards
  accessibilityNotes?: string; // Notes about accessibility considerations
  translationNotes?: string; // Notes for translators
}

/**
 * Accessibility considerations for multilingual content
 */
export interface MultilingualAccessibilityOptions {
  simplifiedLanguage: boolean;
  glossaryTerms: boolean;
  culturalContextNotes: boolean;
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  specialEducationalNeedsAdaptations: boolean;
  // Added for expansion
  textToSpeechEnabled?: boolean; // Whether text-to-speech is enabled
  highContrastMode?: boolean; // Whether high contrast mode is enabled
  largeText?: boolean; // Whether large text is enabled
  dyslexiaFriendlyFont?: boolean; // Whether dyslexia-friendly font is enabled
  reduceMotion?: boolean; // Whether to reduce motion
  lineSpacing?: 'normal' | 'wide' | 'wider'; // Line spacing preference
  wordSpacing?: 'normal' | 'wide' | 'wider'; // Word spacing preference
}

/**
 * Document types supported for translation
 */
export enum DocumentType {
  PDF = 'pdf',
  WORD = 'docx',
  EXCEL = 'xlsx',
  POWERPOINT = 'pptx',
  TEXT = 'txt',
  HTML = 'html',
  MARKDOWN = 'md',
  CSV = 'csv',
  JSON = 'json',
  XML = 'xml'
}

/**
 * Document translation request
 */
export interface DocumentTranslationRequest {
  documentId: string;
  documentType: DocumentType;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  preserveFormatting: boolean;
  priority: 'high' | 'normal' | 'low';
  notifyOnCompletion: boolean;
  userId: string;
  contextNotes?: string;
  terminology?: Record<string, string>;
  deadline?: Date;
}

/**
 * Document translation status
 */
export interface DocumentTranslationStatus {
  documentId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  startTime?: Date;
  completionTime?: Date;
  errorMessage?: string;
  resultUrl?: string;
  pageCount?: number;
  wordCount?: number;
}

/**
 * Batch translation request
 */
export interface BatchTranslationRequest {
  batchId: string;
  userId: string;
  documentIds: string[];
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  priority: 'high' | 'normal' | 'low';
  notifyOnCompletion: boolean;
  contextNotes?: string;
  terminology?: Record<string, string>;
  deadline?: Date;
}

/**
 * Batch translation status
 */
export interface BatchTranslationStatus {
  batchId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'partial';
  progress: number; // 0-100
  documentStatuses: {
    [documentId: string]: 'queued' | 'processing' | 'completed' | 'failed';
  };
  startTime?: Date;
  completionTime?: Date;
  errorMessage?: string;
}

/**
 * Translation glossary for educational terminology
 */
export interface TranslationGlossary {
  id: string;
  name: string;
  description?: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  entries: Array<{
    term: string;
    translation: string;
    definition?: string;
    context?: string;
    domain?: string;
    examples?: string[];
  }>;
  lastUpdated: Date;
  createdBy: string;
}

/**
 * Cultural context information for translations
 */
export interface CulturalContextInfo {
  language: SupportedLanguage;
  culturalNotes: Array<{
    category: 'education' | 'customs' | 'holidays' | 'etiquette' | 'other';
    title: string;
    description: string;
    relevance: 'high' | 'medium' | 'low';
    examples?: string[];
  }>;
  educationalSystemNotes: string;
  curriculumDifferences?: string;
  lastUpdated: Date;
}

/**
 * Translation quality feedback
 */
export interface TranslationQualityFeedback {
  translationId: string;
  userId: string;
  rating: number; // 1-5
  issues?: Array<'accuracy' | 'fluency' | 'terminology' | 'style' | 'grammar' | 'other'>;
  comments?: string;
  suggestedTranslation?: string;
  timestamp: Date;
}
