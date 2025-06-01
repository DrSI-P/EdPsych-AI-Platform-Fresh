"use client";

/**
 * Simple i18n implementation for the EdPsych Connect platform
 * This provides basic translation functionality until a more robust solution is implemented
 */

export function useTranslation(namespace: string) {
  // Simple translations for working memory module
  const translations: Record<string, Record<string, string>> = {
    'working-memory': {
      'close': 'Close',
      'avatarVideo.placeholder': 'AI Avatar Video Placeholder',
      'avatarVideo.willBeAdded': 'The actual video will be added in production',
      'avatarVideo.description': 'This video will explain concepts and provide guidance on using the tools and exercises.'
    }
  };

  // Return translation function
  const t = (key: string): string => {
    if (!namespace || !translations[namespace]) {
      return key;
    }
    
    return translations[namespace][key] || key;
  };

  return { t };
}
