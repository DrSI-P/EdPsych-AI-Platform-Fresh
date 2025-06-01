/**
 * Student Interest Personalization Service
 * Provides functionality for personalizing curriculum content based on student interests
 */

import { 
  CurriculumContent
} from './types';
import { updateCurriculumContent } from './api';

/**
 * Interest theme interface
 */
export interface InterestTheme {
  id: string;
  name: string;
  description: string;
  interests: string[];
  enabled: boolean;
}

/**
 * Interest example interface
 */
export interface InterestExample {
  id: string;
  title: string;
  description: string;
  interests: string[];
  enabled: boolean;
  content: string;
}

/**
 * Engagement settings interface
 */
export interface EngagementSettings {
  adaptiveContent: boolean;
  interestBasedRewards: boolean;
  personalizedFeedback: boolean;
  challengeLevel: 'easy' | 'moderate' | 'challenging';
  rewardFrequency: 'minimal' | 'balanced' | 'frequent';
}

/**
 * Student interest personalization settings interface
 */
export interface StudentInterestSettings {
  selectedInterests: string[];
  themes: InterestTheme[];
  examples: InterestExample[];
  engagement: EngagementSettings;
}

/**
 * Default student interest settings
 */
export const defaultInterestSettings: StudentInterestSettings = {
  selectedInterests: [],
  themes: [],
  examples: [],
  engagement: {
    adaptiveContent: true,
    interestBasedRewards: true,
    personalizedFeedback: true,
    challengeLevel: 'moderate',
    rewardFrequency: 'balanced'
  }
};

/**
 * Get student interest settings from local storage
 */
export function getInterestSettings(userId?: string): StudentInterestSettings {
  if (typeof window === 'undefined') {
    return defaultInterestSettings;
  }
  
  const storageKey = userId ? `studentInterestSettings_${userId}` : 'studentInterestSettings';
  const savedSettings = localStorage.getItem(storageKey);
  
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (error) {
      console.error('Error parsing saved interest settings:', error);
      return defaultInterestSettings;
    }
  }
  
  return defaultInterestSettings;
}

/**
 * Save student interest settings to local storage
 */
export function saveInterestSettings(settings: StudentInterestSettings, userId?: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const storageKey = userId ? `studentInterestSettings_${userId}` : 'studentInterestSettings';
  localStorage.setItem(storageKey, JSON.stringify(settings));
}

/**
 * Get available interest areas
 */
export async function getAvailableInterestAreas(): Promise<string[]> {
  // In a real implementation, this would fetch from an API
  // For now, we'll return a static list
  return [
    'Sports', 'Music', 'Technology', 'Nature', 'Space', 'Animals', 
    'Art', 'History', 'Science Fiction', 'Cooking', 'Gaming',
    'Fashion', 'Travel', 'Vehicles', 'Dinosaurs', 'Superheroes',
    'Fantasy', 'Science', 'Mathematics', 'Languages', 'Dance',
    'Comics', 'Movies', 'Books', 'Photography', 'Crafts'
  ];
}

/**
 * Get recommended themes based on interests
 */
export async function getRecommendedThemes(interests: string[]): Promise<InterestTheme[]> {
  // In a real implementation, this would fetch from an API
  // For now, we'll return a static list filtered by interests
  
  const allThemes: InterestTheme[] = [
    {
      id: 'theme1',
      name: 'Space Exploration',
      description: 'Examples and scenarios based on space exploration and astronomy',
      interests: ['Space', 'Science Fiction', 'Technology'],
      enabled: false
    },
    {
      id: 'theme2',
      name: 'Wildlife and Nature',
      description: 'Examples and scenarios based on wildlife and natural environments',
      interests: ['Nature', 'Animals'],
      enabled: false
    },
    {
      id: 'theme3',
      name: 'Sports and Athletics',
      description: 'Examples and scenarios based on sports and athletic activities',
      interests: ['Sports'],
      enabled: false
    },
    {
      id: 'theme4',
      name: 'Technology and Innovation',
      description: 'Examples and scenarios based on technology and innovation',
      interests: ['Technology', 'Gaming'],
      enabled: false
    },
    {
      id: 'theme5',
      name: 'Arts and Creativity',
      description: 'Examples and scenarios based on arts and creative expression',
      interests: ['Art', 'Music', 'Dance', 'Photography', 'Crafts'],
      enabled: false
    },
    {
      id: 'theme6',
      name: 'Historical Adventures',
      description: 'Examples and scenarios based on historical events and figures',
      interests: ['History'],
      enabled: false
    },
    {
      id: 'theme7',
      name: 'Fantasy Worlds',
      description: 'Examples and scenarios based on fantasy worlds and creatures',
      interests: ['Fantasy', 'Gaming', 'Books'],
      enabled: false
    },
    {
      id: 'theme8',
      name: 'Culinary Exploration',
      description: 'Examples and scenarios based on cooking and food',
      interests: ['Cooking', 'Travel'],
      enabled: false
    }
  ];
  
  // Filter themes that match at least one selected interest
  return allThemes.filter(theme => 
    theme.interests.some(interest => interests.includes(interest))
  );
}

/**
 * Get recommended examples based on interests
 */
export async function getRecommendedExamples(interests: string[]): Promise<InterestExample[]> {
  // In a real implementation, this would fetch from an API
  // For now, we'll return a static list filtered by interests
  
  const allExamples: InterestExample[] = [
    {
      id: 'example1',
      title: 'Understanding Fractions with Pizza Slices',
      description: 'Uses pizza slices to explain fraction concepts',
      interests: ['Cooking', 'Food'],
      enabled: false,
      content: '<p>Imagine you have a pizza cut into 8 equal slices. If you eat 3 slices, what fraction of the pizza have you eaten?</p>'
    },
    {
      id: 'example2',
      title: 'Calculating Distances in Space',
      description: 'Uses space travel to explain distance calculations',
      interests: ['Space', 'Science Fiction'],
      enabled: false,
      content: '<p>If a spacecraft travels from Earth to Mars at a speed of 58,000 km/h, and the distance is 54.6 million kilometers, how long will the journey take?</p>'
    },
    {
      id: 'example3',
      title: 'Tracking Sports Statistics',
      description: 'Uses sports statistics to explain data analysis',
      interests: ['Sports'],
      enabled: false,
      content: '<p>A football player scores goals in 65% of matches. If there are 38 matches in a season, how many matches would you expect the player to score in?</p>'
    },
    {
      id: 'example4',
      title: 'Music and Fractions',
      description: 'Uses musical notation to explain fractions',
      interests: ['Music'],
      enabled: false,
      content: '<p>In music, different notes have different durations. A whole note lasts for 4 beats, a half note for 2 beats, and a quarter note for 1 beat. What fraction of a whole note is an eighth note?</p>'
    },
    {
      id: 'example5',
      title: 'Animal Population Growth',
      description: 'Uses animal populations to explain exponential growth',
      interests: ['Animals', 'Nature'],
      enabled: false,
      content: '<p>A population of rabbits doubles every month. If you start with 2 rabbits, how many will you have after 6 months?</p>'
    },
    {
      id: 'example6',
      title: 'Gaming and Probability',
      description: 'Uses gaming scenarios to explain probability',
      interests: ['Gaming'],
      enabled: false,
      content: '<p>In a video game, a rare item has a 5% chance of dropping from a defeated enemy. What is the probability of getting at least one rare item if you defeat 10 enemies?</p>'
    }
  ];
  
  // Filter examples that match at least one selected interest
  return allExamples.filter(example => 
    example.interests.some(interest => interests.includes(interest))
  );
}

/**
 * Apply student interest personalization to curriculum content
 */
export async function applyInterestPersonalization(
  content: CurriculumContent,
  settings: StudentInterestSettings
): Promise<CurriculumContent> {
  // In a real implementation, this would modify the content based on interests
  // For now, we'll just add a note about personalization
  
  const personalizedContent = { ...content };
  const originalContent = content.defaultVariant.content;
  
  // Get enabled themes and examples
  const enabledThemes = settings.themes.filter(theme => theme.enabled);
  const enabledExamples = settings.examples.filter(example => example.enabled);
  
  // Create personalized content
  let newContent = originalContent;
  
  // Add theme context if available
  if (enabledThemes.length > 0) {
    const themesHtml = enabledThemes.map(theme => `
      <div class="interest-theme">
        <h3>${theme.name}</h3>
        <p>${theme.description}</p>
      </div>
    `).join('');
    
    newContent = `
      <div class="interest-personalization">
        <div class="interest-themes">
          <h2>Personalized Learning Context</h2>
          ${themesHtml}
        </div>
        <div class="original-content">
          ${originalContent}
        </div>
      </div>
    `;
  }
  
  // Add interest-based examples if available
  if (enabledExamples.length > 0) {
    const examplesHtml = enabledExamples.map(example => `
      <div class="interest-example">
        <h3>${example.title}</h3>
        <p>${example.description}</p>
        <div class="example-content">${example.content}</div>
      </div>
    `).join('');
    
    newContent = `
      ${newContent}
      <div class="interest-examples">
        <h2>Examples Based on Your Interests</h2>
        ${examplesHtml}
      </div>
    `;
  }
  
  // Update the default variant with personalized content
  personalizedContent.defaultVariant = {
    ...content.defaultVariant,
    content: newContent,
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user', // In a real implementation, this would be the current user ID
    version: content.defaultVariant.version + 1
  };
  
  // In a real implementation, we would save this to the backend
  // For now, we'll just return the modified content
  return personalizedContent;
}

/**
 * Get personalized engagement strategies based on settings
 */
export function getPersonalizedEngagementStrategies(settings: EngagementSettings): string[] {
  const strategies: string[] = [];
  
  if (settings.adaptiveContent) {
    strategies.push('Content difficulty will adapt based on your performance');
  }
  
  if (settings.interestBasedRewards) {
    strategies.push('You will receive rewards related to your interests');
  }
  
  if (settings.personalizedFeedback) {
    strategies.push('Feedback will be tailored to your learning preferences');
  }
  
  switch (settings.challengeLevel) {
    case 'easy':
      strategies.push('Content will be presented with additional support and scaffolding');
      break;
    case 'moderate':
      strategies.push('Content will be presented with balanced challenge and support');
      break;
    case 'challenging':
      strategies.push('Content will include additional challenges and extensions');
      break;
  }
  
  switch (settings.rewardFrequency) {
    case 'minimal':
      strategies.push('Rewards will be given for significant achievements');
      break;
    case 'balanced':
      strategies.push('Rewards will be given at regular intervals for progress');
      break;
    case 'frequent':
      strategies.push('Frequent rewards will be given to maintain engagement');
      break;
  }
  
  return strategies;
}
