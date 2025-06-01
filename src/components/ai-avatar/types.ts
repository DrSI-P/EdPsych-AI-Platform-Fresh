/**
 * Types for AI Avatar Video components
 */

export interface AIAvatarVideo {
  id: string;
  title: string;
  description: string;
  category: AIAvatarVideoCategory;
  audience: AIAvatarVideoAudience;
  duration: number; // in seconds
  scriptPath: string;
  videoPath?: string;
  thumbnailPath?: string;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum AIAvatarVideoCategory {
  CORE_PLATFORM = 'CORE_PLATFORM',
  USER_ONBOARDING = 'USER_ONBOARDING',
  FEATURE_DEMONSTRATION = 'FEATURE_DEMONSTRATION',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  INSPIRATIONAL = 'INSPIRATIONAL'
}

export enum AIAvatarVideoAudience {
  ALL = 'ALL',
  EDUCATORS = 'EDUCATORS',
  PARENTS = 'PARENTS',
  STUDENTS_EARLY_YEARS = 'STUDENTS_EARLY_YEARS',
  STUDENTS_KS1 = 'STUDENTS_KS1',
  STUDENTS_KS2 = 'STUDENTS_KS2',
  STUDENTS_KS3 = 'STUDENTS_KS3',
  STUDENTS_KS4 = 'STUDENTS_KS4',
  PROFESSIONALS = 'PROFESSIONALS',
  ADMINISTRATORS = 'ADMINISTRATORS'
}

export interface AIAvatarVideoPlayer {
  videoId: string;
  autoPlay?: boolean;
  showControls?: boolean;
  showCaptions?: boolean;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface AIAvatarVideoLibrary {
  videos: AIAvatarVideo[];
  categories: AIAvatarVideoCategory[];
  audiences: AIAvatarVideoAudience[];
  featuredVideos: AIAvatarVideo[];
}

export interface AIAvatarVideoService {
  getVideo: (id: string) => Promise<AIAvatarVideo>;
  getVideosByCategory: (category: AIAvatarVideoCategory) => Promise<AIAvatarVideo[]>;
  getVideosByAudience: (audience: AIAvatarVideoAudience) => Promise<AIAvatarVideo[]>;
  getFeaturedVideos: () => Promise<AIAvatarVideo[]>;
  searchVideos: (query: string) => Promise<AIAvatarVideo[]>;
}
