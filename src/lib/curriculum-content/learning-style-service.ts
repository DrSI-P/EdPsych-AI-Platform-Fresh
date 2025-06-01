/**
 * Learning Style Adaptation Service
 * Provides functionality for adapting curriculum content to different learning styles
 */

import { 
  ContentVariant, 
  CurriculumContent,
  LearningStyle
} from './types';
import { createContentVariant, updateContentVariant } from './api';

/**
 * Learning style adaptation settings interface
 */
export interface LearningStyleAdaptationSettings {
  visual: {
    enabled: boolean;
    imageCount: number;
    diagramCount: number;
    videoCount: number;
    colorScheme: string;
    animationLevel: string;
  };
  auditory: {
    enabled: boolean;
    narrationEnabled: boolean;
    backgroundMusicEnabled: boolean;
    soundEffectsEnabled: boolean;
    interactiveVoiceEnabled: boolean;
    speechRate: number;
  };
  kinesthetic: {
    enabled: boolean;
    interactiveExercises: number;
    practicalActivities: number;
    simulationsEnabled: boolean;
    gamificationLevel: string;
  };
  readingWriting: {
    enabled: boolean;
    textDensity: string;
    vocabularyLevel: string;
    notesTakingEnabled: boolean;
    summaryEnabled: boolean;
    quizEnabled: boolean;
  };
}

/**
 * Default learning style adaptation settings
 */
export const defaultAdaptationSettings: LearningStyleAdaptationSettings = {
  visual: {
    enabled: true,
    imageCount: 5,
    diagramCount: 3,
    videoCount: 2,
    colorScheme: 'standard',
    animationLevel: 'moderate'
  },
  auditory: {
    enabled: true,
    narrationEnabled: true,
    backgroundMusicEnabled: false,
    soundEffectsEnabled: true,
    interactiveVoiceEnabled: false,
    speechRate: 1.0
  },
  kinesthetic: {
    enabled: true,
    interactiveExercises: 4,
    practicalActivities: 3,
    simulationsEnabled: true,
    gamificationLevel: 'high'
  },
  readingWriting: {
    enabled: true,
    textDensity: 'moderate',
    vocabularyLevel: 'age-appropriate',
    notesTakingEnabled: true,
    summaryEnabled: true,
    quizEnabled: true
  }
};

/**
 * Get learning style adaptation settings from local storage
 */
export function getAdaptationSettings(): LearningStyleAdaptationSettings {
  if (typeof window === 'undefined') {
    return defaultAdaptationSettings;
  }
  
  const savedSettings = localStorage.getItem('learningStyleAdaptationSettings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (error) {
      console.error('Error parsing saved adaptation settings:', error);
      return defaultAdaptationSettings;
    }
  }
  
  return defaultAdaptationSettings;
}

/**
 * Save learning style adaptation settings to local storage
 */
export function saveAdaptationSettings(settings: LearningStyleAdaptationSettings): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem('learningStyleAdaptationSettings', JSON.stringify(settings));
}

/**
 * Create content variant for a specific learning style
 */
export async function createLearningStyleVariant(
  contentId: string,
  learningStyle: LearningStyle,
  content: string,
  mediaUrls?: string[]
): Promise<ContentVariant> {
  const variant: Partial<ContentVariant> = {
    contentId,
    learningStyle,
    content,
    mediaUrls,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user', // In a real implementation, this would be the current user ID
    updatedBy: 'current-user', // In a real implementation, this would be the current user ID
    version: 1
  };
  
  return await createContentVariant(contentId, variant);
}

/**
 * Generate adapted content for a specific learning style
 */
export async function generateAdaptedContent(
  originalContent: string,
  learningStyle: LearningStyle,
  settings: LearningStyleAdaptationSettings
): Promise<string> {
  // In a real implementation, this would use AI or templates to adapt content
  // For now, we'll return a mock implementation
  
  let adaptedContent = originalContent;
  
  switch (learningStyle) {
    case 'visual':
      if (settings.visual.enabled) {
        adaptedContent = `<div class="visual-adaptation">
          <p>This content has been adapted for visual learners with:</p>
          <ul>
            <li>${settings.visual.imageCount} relevant images</li>
            <li>${settings.visual.diagramCount} explanatory diagrams</li>
            <li>${settings.visual.videoCount} instructional videos</li>
            <li>${settings.visual.colorScheme} color scheme</li>
            <li>${settings.visual.animationLevel} animation level</li>
          </ul>
          <div class="original-content">${originalContent}</div>
        </div>`;
      }
      break;
    case 'auditory':
      if (settings.auditory.enabled) {
        adaptedContent = `<div class="auditory-adaptation">
          <p>This content has been adapted for auditory learners with:</p>
          <ul>
            <li>${settings.auditory.narrationEnabled ? 'Enabled' : 'Disabled'} narration</li>
            <li>${settings.auditory.backgroundMusicEnabled ? 'Enabled' : 'Disabled'} background music</li>
            <li>${settings.auditory.soundEffectsEnabled ? 'Enabled' : 'Disabled'} sound effects</li>
            <li>${settings.auditory.interactiveVoiceEnabled ? 'Enabled' : 'Disabled'} interactive voice</li>
            <li>Speech rate: ${settings.auditory.speechRate}x</li>
          </ul>
          <div class="original-content">${originalContent}</div>
        </div>`;
      }
      break;
    case 'kinesthetic':
      if (settings.kinesthetic.enabled) {
        adaptedContent = `<div class="kinesthetic-adaptation">
          <p>This content has been adapted for kinesthetic learners with:</p>
          <ul>
            <li>${settings.kinesthetic.interactiveExercises} interactive exercises</li>
            <li>${settings.kinesthetic.practicalActivities} practical activities</li>
            <li>${settings.kinesthetic.simulationsEnabled ? 'Enabled' : 'Disabled'} simulations</li>
            <li>${settings.kinesthetic.gamificationLevel} gamification level</li>
          </ul>
          <div class="original-content">${originalContent}</div>
        </div>`;
      }
      break;
    case 'reading_writing':
      if (settings.readingWriting.enabled) {
        adaptedContent = `<div class="reading-writing-adaptation">
          <p>This content has been adapted for reading/writing learners with:</p>
          <ul>
            <li>${settings.readingWriting.textDensity} text density</li>
            <li>${settings.readingWriting.vocabularyLevel} vocabulary level</li>
            <li>${settings.readingWriting.notesTakingEnabled ? 'Enabled' : 'Disabled'} notes taking</li>
            <li>${settings.readingWriting.summaryEnabled ? 'Enabled' : 'Disabled'} summary</li>
            <li>${settings.readingWriting.quizEnabled ? 'Enabled' : 'Disabled'} quiz</li>
          </ul>
          <div class="original-content">${originalContent}</div>
        </div>`;
      }
      break;
    default:
      // No adaptation
      break;
  }
  
  return adaptedContent;
}

/**
 * Apply learning style adaptations to curriculum content
 */
export async function applyLearningStyleAdaptations(
  content: CurriculumContent,
  settings: LearningStyleAdaptationSettings
): Promise<CurriculumContent> {
  const adaptedContent = { ...content };
  const originalVariant = content.defaultVariant;
  
  // Create or update variants for each enabled learning style
  const variantPromises: Promise<ContentVariant>[] = [];
  
  if (settings.visual.enabled) {
    const adaptedVisualContent = await generateAdaptedContent(
      originalVariant.content,
      'visual',
      settings
    );
    
    const existingVisualVariant = content.variants.find(v => v.learningStyle === 'visual');
    if (existingVisualVariant) {
      variantPromises.push(
        updateContentVariant(content.metadata.id, existingVisualVariant.id, {
          content: adaptedVisualContent,
          updatedAt: new Date().toISOString(),
          updatedBy: 'current-user', // In a real implementation, this would be the current user ID
          version: existingVisualVariant.version + 1
        })
      );
    } else {
      variantPromises.push(
        createLearningStyleVariant(
          content.metadata.id,
          'visual',
          adaptedVisualContent
        )
      );
    }
  }
  
  if (settings.auditory.enabled) {
    const adaptedAuditoryContent = await generateAdaptedContent(
      originalVariant.content,
      'auditory',
      settings
    );
    
    const existingAuditoryVariant = content.variants.find(v => v.learningStyle === 'auditory');
    if (existingAuditoryVariant) {
      variantPromises.push(
        updateContentVariant(content.metadata.id, existingAuditoryVariant.id, {
          content: adaptedAuditoryContent,
          updatedAt: new Date().toISOString(),
          updatedBy: 'current-user', // In a real implementation, this would be the current user ID
          version: existingAuditoryVariant.version + 1
        })
      );
    } else {
      variantPromises.push(
        createLearningStyleVariant(
          content.metadata.id,
          'auditory',
          adaptedAuditoryContent
        )
      );
    }
  }
  
  if (settings.kinesthetic.enabled) {
    const adaptedKinestheticContent = await generateAdaptedContent(
      originalVariant.content,
      'kinesthetic',
      settings
    );
    
    const existingKinestheticVariant = content.variants.find(v => v.learningStyle === 'kinesthetic');
    if (existingKinestheticVariant) {
      variantPromises.push(
        updateContentVariant(content.metadata.id, existingKinestheticVariant.id, {
          content: adaptedKinestheticContent,
          updatedAt: new Date().toISOString(),
          updatedBy: 'current-user', // In a real implementation, this would be the current user ID
          version: existingKinestheticVariant.version + 1
        })
      );
    } else {
      variantPromises.push(
        createLearningStyleVariant(
          content.metadata.id,
          'kinesthetic',
          adaptedKinestheticContent
        )
      );
    }
  }
  
  if (settings.readingWriting.enabled) {
    const adaptedReadingWritingContent = await generateAdaptedContent(
      originalVariant.content,
      'reading_writing',
      settings
    );
    
    const existingReadingWritingVariant = content.variants.find(v => v.learningStyle === 'reading_writing');
    if (existingReadingWritingVariant) {
      variantPromises.push(
        updateContentVariant(content.metadata.id, existingReadingWritingVariant.id, {
          content: adaptedReadingWritingContent,
          updatedAt: new Date().toISOString(),
          updatedBy: 'current-user', // In a real implementation, this would be the current user ID
          version: existingReadingWritingVariant.version + 1
        })
      );
    } else {
      variantPromises.push(
        createLearningStyleVariant(
          content.metadata.id,
          'reading_writing',
          adaptedReadingWritingContent
        )
      );
    }
  }
  
  // Wait for all variant updates to complete
  const updatedVariants = await Promise.all(variantPromises);
  
  // Update the content variants
  adaptedContent.variants = [
    ...content.variants.filter(v => !['visual', 'auditory', 'kinesthetic', 'reading_writing'].includes(v.learningStyle)),
    ...updatedVariants
  ];
  
  return adaptedContent;
}
