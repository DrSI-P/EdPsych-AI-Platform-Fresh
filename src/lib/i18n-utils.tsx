// Internationalization utilities for EdPsych-AI-Education-Platform
// Provides comprehensive multilingual support with educational context awareness

import { useEffect, useState } from 'react';

/**
 * Supported languages in the platform
 * Using UK English as the default/base language
 */
export enum SupportedLanguage {
  EN_GB = 'en-GB', // UK English (default)
  EN_US = 'en-US', // US English
  FR = 'fr',       // French
  ES = 'es',       // Spanish
  DE = 'de',       // German
  IT = 'it',       // Italian
  PL = 'pl',       // Polish
  AR = 'ar',       // Arabic
  ZH = 'zh',       // Chinese (Simplified)
  HI = 'hi',       // Hindi
  UR = 'ur',       // Urdu
  BN = 'bn',       // Bengali
  CY = 'cy',       // Welsh
  GA = 'ga',       // Irish
  GD = 'gd'        // Scottish Gaelic
}

/**
 * Language direction
 */
export enum LanguageDirection {
  LTR = 'ltr', // Left to right
  RTL = 'rtl'  // Right to left
}

/**
 * Language metadata
 */
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: LanguageDirection;
  educationalContext?: string;
  supportLevel: 'full' | 'partial' | 'basic';
}

/**
 * Translation context for educational content
 */
export enum EducationalContext {
  GENERAL = 'general',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  HIGHER_ED = 'higher_education',
  SPECIAL_ED = 'special_education',
  PROFESSIONAL = 'professional'
}

/**
 * Translation options
 */
export interface TranslationOptions {
  context?: EducationalContext;
  interpolation?: Record<string, string | number>;
  fallbackLanguage?: SupportedLanguage;
  formatters?: Record<string, (value: any) => string>;
}

// Language metadata for all supported languages
export const LANGUAGE_INFO: Record<SupportedLanguage, LanguageInfo> = {
  [SupportedLanguage.EN_GB]: {
    code: SupportedLanguage.EN_GB,
    name: 'English (UK)',
    nativeName: 'English (UK)',
    direction: LanguageDirection.LTR,
    educationalContext: 'Aligned with UK Department for Education (DfE) curriculum',
    supportLevel: 'full'
  },
  [SupportedLanguage.EN_US]: {
    code: SupportedLanguage.EN_US,
    name: 'English (US)',
    nativeName: 'English (US)',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.FR]: {
    code: SupportedLanguage.FR,
    name: 'French',
    nativeName: 'Français',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.ES]: {
    code: SupportedLanguage.ES,
    name: 'Spanish',
    nativeName: 'Español',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.DE]: {
    code: SupportedLanguage.DE,
    name: 'German',
    nativeName: 'Deutsch',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.IT]: {
    code: SupportedLanguage.IT,
    name: 'Italian',
    nativeName: 'Italiano',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.PL]: {
    code: SupportedLanguage.PL,
    name: 'Polish',
    nativeName: 'Polski',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.AR]: {
    code: SupportedLanguage.AR,
    name: 'Arabic',
    nativeName: 'العربية',
    direction: LanguageDirection.RTL,
    supportLevel: 'full'
  },
  [SupportedLanguage.ZH]: {
    code: SupportedLanguage.ZH,
    name: 'Chinese (Simplified)',
    nativeName: '中文',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.HI]: {
    code: SupportedLanguage.HI,
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.UR]: {
    code: SupportedLanguage.UR,
    name: 'Urdu',
    nativeName: 'اردو',
    direction: LanguageDirection.RTL,
    supportLevel: 'full'
  },
  [SupportedLanguage.BN]: {
    code: SupportedLanguage.BN,
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: LanguageDirection.LTR,
    supportLevel: 'full'
  },
  [SupportedLanguage.CY]: {
    code: SupportedLanguage.CY,
    name: 'Welsh',
    nativeName: 'Cymraeg',
    direction: LanguageDirection.LTR,
    educationalContext: 'Aligned with Welsh curriculum requirements',
    supportLevel: 'full'
  },
  [SupportedLanguage.GA]: {
    code: SupportedLanguage.GA,
    name: 'Irish',
    nativeName: 'Gaeilge',
    direction: LanguageDirection.LTR,
    supportLevel: 'partial'
  },
  [SupportedLanguage.GD]: {
    code: SupportedLanguage.GD,
    name: 'Scottish Gaelic',
    nativeName: 'Gàidhlig',
    direction: LanguageDirection.LTR,
    supportLevel: 'partial'
  }
};

// Global state
let currentLanguage: SupportedLanguage = SupportedLanguage.EN_GB;
const translations: Record<string, Record<string, string>> = {};
let isInitialized = false;

/**
 * Initialize the internationalization system
 */
export const initializeI18n = async (
  initialLanguage?: SupportedLanguage,
  preloadLanguages: SupportedLanguage[] = []
): Promise<void> => {
  if (isInitialized) {
    return;
  }
  
  // Determine initial language
  if (initialLanguage) {
    currentLanguage = initialLanguage;
  } else if (typeof window !== 'undefined') {
    // Try to get from localStorage
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage && Object.values(SupportedLanguage).includes(savedLanguage as SupportedLanguage)) {
      currentLanguage = savedLanguage as SupportedLanguage;
    } else {
      // Try to detect from browser
      const browserLanguage = navigator.language;
      const matchedLanguage = Object.values(SupportedLanguage).find(
        lang => browserLanguage.startsWith(lang.split('-')[0])
      );
      
      if (matchedLanguage) {
        currentLanguage = matchedLanguage;
      }
    }
  }
  
  // Load base language (UK English)
  await loadLanguage(SupportedLanguage.EN_GB);
  
  // Load current language if different from base
  if (currentLanguage !== SupportedLanguage.EN_GB) {
    await loadLanguage(currentLanguage);
  }
  
  // Preload additional languages if specified
  for (const lang of preloadLanguages) {
    if (lang !== currentLanguage && lang !== SupportedLanguage.EN_GB) {
      loadLanguage(lang).catch(err => 
        console.warn(`Failed to preload language ${lang}:`, err)
      );
    }
  }
  
  isInitialized = true;
  
  // Set document direction if in browser context
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute(
      'dir', 
      getLanguageDirection(currentLanguage)
    );
    document.documentElement.setAttribute('lang', currentLanguage);
  }
};

/**
 * Load language translations
 */
export const loadLanguage = async (language: SupportedLanguage): Promise<void> => {
  if (translations[language]) {
    return; // Already loaded
  }
  
  try {
    // In a real implementation, this would load from API or static files
    // For now, we'll simulate loading with a delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock translations for demonstration
    translations[language] = getMockTranslations(language);
    
    // Dispatch event for language loaded
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageLoaded', { 
        detail: { language } 
      }));
    }
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
    throw error;
  }
};

/**
 * Change the current language
 */
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  if (!isInitialized) {
    await initializeI18n(language);
    return;
  }
  
  if (!translations[language]) {
    await loadLanguage(language);
  }
  
  const previousLanguage = currentLanguage;
  currentLanguage = language;
  
  // Save preference if in browser context
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('preferred_language', language);
  }
  
  // Update document direction if in browser context
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute(
      'dir', 
      getLanguageDirection(language)
    );
    document.documentElement.setAttribute('lang', language);
  }
  
  // Dispatch event for language changed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { 
        previousLanguage,
        currentLanguage: language 
      } 
    }));
  }
};

/**
 * Get the current language
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return currentLanguage;
};

/**
 * Get language direction (LTR or RTL)
 */
export const getLanguageDirection = (language: SupportedLanguage): LanguageDirection => {
  return LANGUAGE_INFO[language]?.direction || LanguageDirection.LTR;
};

/**
 * Get all available languages
 */
export const getAvailableLanguages = (): LanguageInfo[] => {
  return Object.values(LANGUAGE_INFO);
};

/**
 * Translate a key to the current language
 */
export const translate = (
  key: string,
  options: TranslationOptions = {}
): string => {
  if (!isInitialized) {
    console.warn('i18n not initialized, using key as fallback');
    return key;
  }
  
  const {
    context = EducationalContext.GENERAL,
    interpolation = {},
    fallbackLanguage = SupportedLanguage.EN_GB,
    formatters = {}
  } = options;
  
  // Try to get translation for current language and context
  const contextKey = context ? `${key}_${context}` : key;
  let translation = translations[currentLanguage]?.[contextKey] || translations[currentLanguage]?.[key];
  
  // Fall back to base language if not found
  if (!translation && currentLanguage !== fallbackLanguage) {
    translation = translations[fallbackLanguage]?.[contextKey] || translations[fallbackLanguage]?.[key];
  }
  
  // Use key as last resort
  if (!translation) {
    return key;
  }
  
  // Handle interpolation
  return translation.replace(/{{([^{}]*)}}/g, (_, match) => {
    const [variable, formatter] = match.trim().split('|');
    const value = interpolation[variable];
    
    if (value === undefined) {
      return `{{${variable}}}`;
    }
    
    // Apply formatter if specified
    if (formatter && formatters[formatter]) {
      return formatters[formatter](value);
    }
    
    return String(value);
  });
};

/**
 * Format date according to current language
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string => {
  return new Intl.DateTimeFormat(currentLanguage, options).format(date);
};

/**
 * Format number according to current language
 */
export const formatNumber = (
  number: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(currentLanguage, options).format(number);
};

/**
 * Format currency according to current language
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'GBP',
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(currentLanguage, {
    style: 'currency',
    currency,
    ...options
  }).format(amount);
};

/**
 * React hook for translations
 */
export const useTranslation = (): {
  t: (key: string, options?: TranslationOptions) => string;
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
} => {
  const [language, setLanguage] = useState<SupportedLanguage>(currentLanguage);
  
  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setLanguage(customEvent.detail.currentLanguage);
    };
    
    if (!isInitialized) {
      initializeI18n().catch(console.error);
    }
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
  
  return {
    t: translate,
    language,
    changeLanguage: async (lang: SupportedLanguage) => {
      await changeLanguage(lang);
      setLanguage(lang);
    },
    formatDate,
    formatNumber,
    formatCurrency
  };
};

/**
 * React component for language selector
 */
export const LanguageSelector: React.FC<{
  onChange?: (language: SupportedLanguage) => void;
  showFlags?: boolean;
  showNativeNames?: boolean;
  className?: string;
}> = ({ onChange, showFlags = true, showNativeNames = true, className = '' }) => {
  const { language, changeLanguage } = useTranslation();
  
  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as SupportedLanguage;
    await changeLanguage(newLanguage);
    
    if (onChange) {
      onChange(newLanguage);
    }
  };
  
  return (
    <select 
      value={language} 
      onChange={handleChange}
      className={`language-selector ${className}`}
      aria-label="Select language"
    >
      {Object.values(LANGUAGE_INFO).map(lang => (
        <option key={lang.code} value={lang.code}>
          {showFlags && getLanguageFlag(lang.code)} 
          {showNativeNames ? lang.nativeName : lang.name}
        </option>
      ))}
    </select>
  );
};

/**
 * Get flag emoji for language
 */
const getLanguageFlag = (language: SupportedLanguage): string => {
  const flagMap: Record<SupportedLanguage, string> = {
    [SupportedLanguage.EN_GB]: '🇬🇧',
    [SupportedLanguage.EN_US]: '🇺🇸',
    [SupportedLanguage.FR]: '🇫🇷',
    [SupportedLanguage.ES]: '🇪🇸',
    [SupportedLanguage.DE]: '🇩🇪',
    [SupportedLanguage.IT]: '🇮🇹',
    [SupportedLanguage.PL]: '🇵🇱',
    [SupportedLanguage.AR]: '🇸🇦',
    [SupportedLanguage.ZH]: '🇨🇳',
    [SupportedLanguage.HI]: '🇮🇳',
    [SupportedLanguage.UR]: '🇵🇰',
    [SupportedLanguage.BN]: '🇧🇩',
    [SupportedLanguage.CY]: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    [SupportedLanguage.GA]: '🇮🇪',
    [SupportedLanguage.GD]: '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
  };
  
  return flagMap[language] || '';
};

/**
 * Mock translations for demonstration
 * In a real implementation, these would be loaded from files or API
 */
const getMockTranslations = (language: SupportedLanguage): Record<string, string> => {
  // Base translations (English UK)
  if (language === SupportedLanguage.EN_GB) {
    return {
      'welcome': 'Welcome to EdPsych Connect',
      'welcome_primary': 'Hello! Welcome to EdPsych Connect',
      'welcome_secondary': 'Welcome to EdPsych Connect - Your educational psychology platform',
      'dashboard.title': 'Dashboard',
      'dashboard.summary': 'Your learning summary',
      'dashboard.progress': 'Your progress',
      'dashboard.recommendations': 'Recommended for you',
      'accessibility.title': 'Accessibility Options',
      'accessibility.font_size': 'Font Size',
      'accessibility.contrast': 'Contrast',
      'accessibility.dyslexic_font': 'Dyslexic-friendly Font',
      'accessibility.motion_reduction': 'Reduce Motion',
      'voice_input.start': 'Start Speaking',
      'voice_input.stop': 'Stop Speaking',
      'voice_input.listening': 'Listening...',
      'voice_input.not_supported': 'Voice input is not supported in your browser',
      'multilingual.language': 'Language',
      'multilingual.change_language': 'Change Language',
      'learning.modules': 'Learning Modules',
      'learning.assessments': 'Assessments',
      'learning.resources': 'Resources',
      'learning.progress': 'Learning Progress',
      'learning.achievements': 'Achievements',
      'profile.title': 'Your Profile',
      'profile.preferences': 'Preferences',
      'profile.learning_style': 'Learning Style',
      'profile.interests': 'Interests',
      'profile.goals': 'Learning Goals',
      'ai_avatar.create': 'Create AI Avatar Video',
      'ai_avatar.library': 'Your Video Library',
      'ai_avatar.share': 'Share Video',
      'ai_avatar.voice': 'Voice Options',
      'ai_avatar.script': 'Video Script',
      'ai_avatar.preview': 'Preview Video',
      'error.general': 'Something went wrong',
      'error.try_again': 'Please try again',
      'error.contact_support': 'Contact support if the problem persists',
      'button.save': 'Save',
      'button.cancel': 'Cancel',
      'button.next': 'Next',
      'button.previous': 'Previous',
      'button.submit': 'Submit',
      'button.start': 'Start',
      'button.finish': 'Finish',
      'button.continue': 'Continue',
      'loading': 'Loading...',
      'search': 'Search',
      'no_results': 'No results found',
      'feedback.positive': 'Thank you for your feedback!',
      'feedback.negative': 'We\'re sorry to hear that. How can we improve?'
    };
  }
  
  // Other languages would have their translations here
  // This is a simplified example for demonstration
  
  // French translations
  if (language === SupportedLanguage.FR) {
    return {
      'welcome': 'Bienvenue à EdPsych Connect',
      'welcome_primary': 'Bonjour! Bienvenue à EdPsych Connect',
      'welcome_secondary': 'Bienvenue à EdPsych Connect - Votre plateforme de psychologie éducative',
      'dashboard.title': 'Tableau de bord',
      'dashboard.summary': 'Résumé de votre apprentissage',
      'dashboard.progress': 'Votre progression',
      'dashboard.recommendations': 'Recommandé pour vous',
      'accessibility.title': 'Options d\'accessibilité',
      'accessibility.font_size': 'Taille de police',
      'accessibility.contrast': 'Contraste',
      'accessibility.dyslexic_font': 'Police adaptée à la dyslexie',
      'accessibility.motion_reduction': 'Réduire les animations',
      'voice_input.start': 'Commencer à parler',
      'voice_input.stop': 'Arrêter de parler',
      'voice_input.listening': 'Écoute en cours...',
      'voice_input.not_supported': 'La saisie vocale n\'est pas prise en charge dans votre navigateur',
      'multilingual.language': 'Langue',
      'multilingual.change_language': 'Changer de langue',
      'learning.modules': 'Modules d\'apprentissage',
      'learning.assessments': 'Évaluations',
      'learning.resources': 'Ressources',
      'learning.progress': 'Progression d\'apprentissage',
      'learning.achievements': 'Réalisations',
      'profile.title': 'Votre profil',
      'profile.preferences': 'Préférences',
      'profile.learning_style': 'Style d\'apprentissage',
      'profile.interests': 'Centres d\'intérêt',
      'profile.goals': 'Objectifs d\'apprentissage',
      'ai_avatar.create': 'Créer une vidéo d\'avatar IA',
      'ai_avatar.library': 'Votre bibliothèque de vidéos',
      'ai_avatar.share': 'Partager la vidéo',
      'ai_avatar.voice': 'Options de voix',
      'ai_avatar.script': 'Script de la vidéo',
      'ai_avatar.preview': 'Aperçu de la vidéo',
      'error.general': 'Une erreur s\'est produite',
      'error.try_again': 'Veuillez réessayer',
      'error.contact_support': 'Contactez le support si le problème persiste',
      'button.save': 'Enregistrer',
      'button.cancel': 'Annuler',
      'button.next': 'Suivant',
      'button.previous': 'Précédent',
      'button.submit': 'Soumettre',
      'button.start': 'Commencer',
      'button.finish': 'Terminer',
      'button.continue': 'Continuer',
      'loading': 'Chargement...',
      'search': 'Rechercher',
      'no_results': 'Aucun résultat trouvé',
      'feedback.positive': 'Merci pour votre retour!',
      'feedback.negative': 'Nous sommes désolés d\'entendre cela. Comment pouvons-nous nous améliorer?'
    };
  }
  
  // For other languages, return an empty object for this example
  return {};
};

export default {
  initializeI18n,
  loadLanguage,
  changeLanguage,
  getCurrentLanguage,
  getLanguageDirection,
  getAvailableLanguages,
  translate,
  formatDate,
  formatNumber,
  formatCurrency,
  useTranslation,
  LanguageSelector,
  SupportedLanguage,
  LanguageDirection,
  EducationalContext
};
