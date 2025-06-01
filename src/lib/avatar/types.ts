/**
 * AI Avatar Video Integration Types
 * 
 * This file defines the core types for the AI Avatar Video system,
 * including video metadata, generation settings, and integration points.
 */

/**
 * Avatar video quality settings
 */
export enum VideoQuality {
  LOW = 'low',       // 480p, lower bandwidth requirements
  MEDIUM = 'medium', // 720p, standard quality
  HIGH = 'high',     // 1080p, high quality
  ULTRA = 'ultra'    // 4K, ultra high quality (where supported)
}

/**
 * Avatar video aspect ratio
 */
export enum VideoAspectRatio {
  STANDARD = '4:3',
  WIDESCREEN = '16:9',
  SQUARE = '1:1',
  VERTICAL = '9:16'  // For mobile-optimised content
}

/**
 * Avatar emotion type
 */
export enum AvatarEmotion {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  ENTHUSIASTIC = 'enthusiastic',
  CONCERNED = 'concerned',
  THOUGHTFUL = 'thoughtful',
  ENCOURAGING = 'encouraging',
  PROFESSIONAL = 'professional'
}

/**
 * Avatar speaking style
 */
export enum AvatarSpeakingStyle {
  CONVERSATIONAL = 'conversational',
  EDUCATIONAL = 'educational',
  SUPPORTIVE = 'supportive',
  CLEAR = 'clear',
  SIMPLIFIED = 'simplified',  // For younger audiences or SEN
  FORMAL = 'formal',
  ENGAGING = 'engaging'
}

/**
 * Avatar background type
 */
export enum AvatarBackgroundType {
  SOLID_COLOR = 'solid_color',
  GRADIENT = 'gradient',
  CLASSROOM = 'classroom',
  OFFICE = 'office',
  LIBRARY = 'library',
  ABSTRACT = 'abstract',
  CUSTOM = 'custom',
  TRANSPARENT = 'transparent'  // For overlay on other content
}

/**
 * Educational content category
 */
export enum ContentCategory {
  LESSON = 'lesson',
  TUTORIAL = 'tutorial',
  EXPLANATION = 'explanation',
  FEEDBACK = 'feedback',
  INTRODUCTION = 'introduction',
  SUMMARY = 'summary',
  ASSESSMENT = 'assessment',
  MOTIVATION = 'motivation'
}

/**
 * Target audience for the video
 */
export enum TargetAudience {
  EARLY_YEARS = 'early_years',
  KEY_STAGE_1 = 'key_stage_1',
  KEY_STAGE_2 = 'key_stage_2',
  KEY_STAGE_3 = 'key_stage_3',
  KEY_STAGE_4 = 'key_stage_4',
  POST_16 = 'post_16',
  TEACHERS = 'teachers',
  PARENTS = 'parents',
  SENCOS = 'sencos',
  EDUCATIONAL_PSYCHOLOGISTS = 'educational_psychologists'
}

/**
 * Avatar video metadata
 */
export interface AvatarVideoMetadata {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  createdAt: Date;
  updatedAt: Date;
  category: ContentCategory;
  targetAudience: string[];
  curriculumLinks?: string[];
  tags: string[];
  transcriptUrl?: string;
  captionsUrl?: string;
  thumbnailUrl: string;
  videoUrl: string;
  status: 'draft' | 'processing' | 'ready' | 'failed' | 'archived';
  accessibilityFeatures: {
    hasCaptions: boolean;
    hasTranscript: boolean;
    hasAudioDescription: boolean;
    hasSignLanguage: boolean;
  };
}

/**
 * Avatar video generation settings
 */
export interface AvatarGenerationSettings {
  avatarId: string;
  emotion: AvatarEmotion;
  speakingStyle: AvatarSpeakingStyle;
  backgroundType: AvatarBackgroundType;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  quality: VideoQuality;
  aspectRatio: VideoAspectRatio;
  showCaptions: boolean;
  captionsPosition: 'bottom' | 'top';
  captionsSize: 'small' | 'medium' | 'large';
  speedMultiplier: number;  // 0.75 - 1.5
  visualAids: boolean;      // Whether to include visual aids alongside avatar
  customizations?: Record<string, any>;
}

/**
 * Avatar video script
 */
export interface AvatarVideoScript {
  id: string;
  title: string;
  content: string;
  notes?: string;
  visualCues?: VisualCue[];
  emotionMarkers?: EmotionMarker[];
  pauseMarkers?: PauseMarker[];
  emphasisMarkers?: EmphasisMarker[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  status: 'draft' | 'reviewed' | 'approved' | 'generated';
  category: ContentCategory;
  targetAudience: string[];
  estimatedDurationSeconds: number;
}

/**
 * Visual cue for script
 */
export interface VisualCue {
  id: string;
  timeOffset: number;  // Seconds from start
  duration: number;    // Duration in seconds
  type: 'image' | 'chart' | 'diagram' | 'text' | 'video' | 'animation';
  content: string;     // URL or text content
  position: 'left' | 'right' | 'top' | 'bottom' | 'overlay';
  size: 'small' | 'medium' | 'large';
  description?: string; // For accessibility
}

/**
 * Emotion marker for script
 */
export interface EmotionMarker {
  id: string;
  timeOffset: number;  // Seconds from start
  emotion: AvatarEmotion;
  intensity: number;   // 1-10
  duration?: number;   // Duration in seconds, if different from next marker
}

/**
 * Pause marker for script
 */
export interface PauseMarker {
  id: string;
  timeOffset: number;  // Seconds from start
  duration: number;    // Duration in seconds
  reason?: string;     // E.g., "Allow time for reflection"
}

/**
 * Emphasis marker for script
 */
export interface EmphasisMarker {
  id: string;
  timeOffset: number;  // Seconds from start
  duration: number;    // Duration in seconds
  type: 'stress' | 'pitch' | 'rate' | 'volume';
  value: number;       // Relative change (1.0 is normal)
}

/**
 * Avatar video generation job
 */
export interface AvatarGenerationJob {
  id: string;
  scriptId: string;
  settings: AvatarGenerationSettings;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;    // 0-100
  startedAt?: Date;
  completedAt?: Date;
  resultVideoId?: string;
  errorMessage?: string;
  priority: 'low' | 'normal' | 'high';
  callbackUrl?: string;
}

/**
 * Avatar video usage analytics
 */
export interface AvatarVideoAnalytics {
  videoId: string;
  views: number;
  uniqueViewers: number;
  averageWatchDuration: number;
  completionRate: number;
  engagementScore: number;
  feedbackRatings: {
    helpful: number;
    neutral: number;
    unhelpful: number;
  };
  viewsByAudience: Record<TargetAudience, number>;
  viewsByDevice: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  viewsByRegion?: Record<string, number>;
}

/**
 * Avatar video integration point
 */
export interface AvatarIntegrationPoint {
  id: string;
  componentId: string;
  componentType: 'lesson' | 'assessment' | 'feedback' | 'dashboard' | 'profile' | 'help';
  position: 'intro' | 'main' | 'summary' | 'feedback' | 'help' | 'custom';
  videoId?: string;
  scriptTemplate?: string;
  dynamicVariables?: Record<string, string>;
  conditions?: {
    userRole?: string[];
    userProgress?: number;
    assessmentScore?: number;
    timeOfDay?: string;
    deviceType?: string[];
  };
  fallbackText?: string;
}

/**
 * Avatar model
 */
export interface AvatarModel {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  previewVideoUrl: string;
  supportedEmotions: AvatarEmotion[];
  supportedSpeakingStyles: AvatarSpeakingStyle[];
  supportedBackgrounds: AvatarBackgroundType[];
  supportedLanguages: string[];
  isDefault: boolean;
  category: 'teacher' | 'mentor' | 'guide' | 'specialist' | 'character';
  tags: string[];
}

/**
 * User avatar preferences
 */
export interface UserAvatarPreferences {
  userId: string;
  preferredAvatarId?: string;
  preferredSpeakingStyle?: AvatarSpeakingStyle;
  preferredSpeed: number;  // 0.75 - 1.5
  captionsEnabled: boolean;
  captionsSize: 'small' | 'medium' | 'large';
  autoPause: boolean;
  visualAidsEnabled: boolean;
  accessibilitySettings: {
    highContrast: boolean;
    simplifiedLanguage: boolean;
    extendedPauses: boolean;
    signLanguage: boolean;
  };
}
