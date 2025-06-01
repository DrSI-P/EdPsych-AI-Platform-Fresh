/**
 * Multilingual Support Service
 * 
 * This service provides translation, localization, and language management
 * capabilities for the EdPsych-AI-Education-Platform.
 */

import {
  SupportedLanguage,
  TextDirection,
  LanguageMetadata,
  TranslationNamespace,
  LanguagePack,
  UserLanguagePreferences,
  TranslationRequest,
  TranslationResponse,
  LanguageDetectionResult,
  ContentLocalizationMetadata,
  MultilingualAccessibilityOptions
} from './types';

/**
 * Service for handling all multilingual functionality
 */
export class I18nService {
  private static instance: I18nService;
  private currentLanguage: SupportedLanguage = SupportedLanguage.ENGLISH_UK;
  private fallbackLanguage: SupportedLanguage = SupportedLanguage.ENGLISH_UK;
  private loadedLanguagePacks: Map<SupportedLanguage, LanguagePack> = new Map();
  private translationMemoryCache: Map<string, string> = new Map();
  
  /**
   * Language metadata for all supported languages
   */
  private languageMetadata: Map<SupportedLanguage, LanguageMetadata> = new Map([
    [SupportedLanguage.ENGLISH_UK, {
      code: SupportedLanguage.ENGLISH_UK,
      englishName: 'English (UK)',
      nativeName: 'English (UK)',
      direction: TextDirection.LTR,
      flagIcon: 'gb',
      isEnabled: true
    }],
    [SupportedLanguage.WELSH, {
      code: SupportedLanguage.WELSH,
      englishName: 'Welsh',
      nativeName: 'Cymraeg',
      direction: TextDirection.LTR,
      flagIcon: 'wales',
      isEnabled: true
    }],
    [SupportedLanguage.POLISH, {
      code: SupportedLanguage.POLISH,
      englishName: 'Polish',
      nativeName: 'Polski',
      direction: TextDirection.LTR,
      flagIcon: 'pl',
      isEnabled: true
    }],
    [SupportedLanguage.URDU, {
      code: SupportedLanguage.URDU,
      englishName: 'Urdu',
      nativeName: 'اردو',
      direction: TextDirection.RTL,
      flagIcon: 'pk',
      isEnabled: true
    }],
    [SupportedLanguage.PUNJABI, {
      code: SupportedLanguage.PUNJABI,
      englishName: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      direction: TextDirection.LTR,
      flagIcon: 'in',
      isEnabled: true
    }],
    [SupportedLanguage.ARABIC, {
      code: SupportedLanguage.ARABIC,
      englishName: 'Arabic',
      nativeName: 'العربية',
      direction: TextDirection.RTL,
      flagIcon: 'sa',
      isEnabled: true
    }],
    // Additional languages would be defined here
  ]);
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    // Initialize with English language pack
    this.loadLanguagePack(SupportedLanguage.ENGLISH_UK);
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }
  
  /**
   * Get all supported languages
   */
  public getSupportedLanguages(): LanguageMetadata[] {
    return Array.from(this.languageMetadata.values());
  }
  
  /**
   * Get enabled languages
   */
  public getEnabledLanguages(): LanguageMetadata[] {
    return Array.from(this.languageMetadata.values())
      .filter(lang => lang.isEnabled);
  }
  
  /**
   * Get metadata for a specific language
   */
  public getLanguageMetadata(language: SupportedLanguage): LanguageMetadata | undefined {
    return this.languageMetadata.get(language);
  }
  
  /**
   * Set the current language
   */
  public async setLanguage(language: SupportedLanguage): Promise<boolean> {
    try {
      if (!this.languageMetadata.has(language)) {
        console.error(`Language ${language} is not supported`);
        return false;
      }
      
      if (!this.loadedLanguagePacks.has(language)) {
        await this.loadLanguagePack(language);
      }
      
      this.currentLanguage = language;
      
      // Update document direction if needed
      const metadata = this.languageMetadata.get(language);
      if (metadata && typeof document !== 'undefined') {
        document.documentElement.dir = metadata.direction;
        document.documentElement.lang = language;
      }
      
      return true;
    } catch (error) {
      console.error('Error setting language:', error);
      return false;
    }
  }
  
  /**
   * Get the current language
   */
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }
  
  /**
   * Load a language pack
   */
  private async loadLanguagePack(language: SupportedLanguage): Promise<boolean> {
    try {
      // In a real implementation, this would fetch from an API or static files
      // For now, we'll use mock data for English
      if (language === SupportedLanguage.ENGLISH_UK) {
        const mockEnglishPack: LanguagePack = {
          language: SupportedLanguage.ENGLISH_UK,
          namespaces: [
            {
              namespace: TranslationNamespace.COMMON,
              translations: [
                { key: 'welcome', text: 'Welcome to EdPsych-AI-Education-Platform' },
                { key: 'loading', text: 'Loading...' },
                { key: 'error', text: 'An error occurred' },
                { key: 'save', text: 'Save' },
                { key: 'cancel', text: 'Cancel' },
                { key: 'confirm', text: 'Confirm' },
                { key: 'back', text: 'Back' },
                { key: 'next', text: 'Next' },
                { key: 'search', text: 'Search' }
              ]
            },
            {
              namespace: TranslationNamespace.NAVIGATION,
              translations: [
                { key: 'home', text: 'Home' },
                { key: 'dashboard', text: 'Dashboard' },
                { key: 'lessons', text: 'Lessons' },
                { key: 'assessments', text: 'Assessments' },
                { key: 'resources', text: 'Resources' },
                { key: 'settings', text: 'Settings' },
                { key: 'profile', text: 'Profile' },
                { key: 'logout', text: 'Log out' }
              ]
            }
            // Additional namespaces would be included here
          ]
        };
        
        this.loadedLanguagePacks.set(language, mockEnglishPack);
        return true;
      }
      
      // For other languages, we would fetch from an API
      // This is a placeholder for the actual implementation
      console.log(`Loading language pack for ${language}`);
      
      // Mock successful loading
      return true;
    } catch (error) {
      console.error(`Error loading language pack for ${language}:`, error);
      return false;
    }
  }
  
  /**
   * Translate a key
   */
  public translate(key: string, namespace: TranslationNamespace = TranslationNamespace.COMMON, params?: Record<string, string>): string {
    try {
      const languagePack = this.loadedLanguagePacks.get(this.currentLanguage);
      if (!languagePack) {
        return this.translateFallback(key, namespace, params);
      }
      
      const namespaceData = languagePack.namespaces.find(ns => ns.namespace === namespace);
      if (!namespaceData) {
        return this.translateFallback(key, namespace, params);
      }
      
      const translation = namespaceData.translations.find(t => t.key === key);
      if (!translation) {
        return this.translateFallback(key, namespace, params);
      }
      
      let text = translation.text;
      
      // Replace parameters if provided
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
        });
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return this.translateFallback(key, namespace, params);
    }
  }
  
  /**
   * Fallback translation when the requested translation is not found
   */
  private translateFallback(key: string, namespace: TranslationNamespace, params?: Record<string, string>): string {
    // Try fallback language if different from current
    if (this.currentLanguage !== this.fallbackLanguage) {
      const fallbackPack = this.loadedLanguagePacks.get(this.fallbackLanguage);
      if (fallbackPack) {
        const namespaceData = fallbackPack.namespaces.find(ns => ns.namespace === namespace);
        if (namespaceData) {
          const translation = namespaceData.translations.find(t => t.key === key);
          if (translation) {
            let text = translation.text;
            
            // Replace parameters if provided
            if (params) {
              Object.entries(params).forEach(([paramKey, paramValue]) => {
                text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
              });
            }
            
            return text;
          }
        }
      }
    }
    
    // If all else fails, return the key itself
    return key;
  }
  
  /**
   * Translate text using machine translation
   */
  public async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      // Generate a cache key
      const cacheKey = `${request.text}|${request.sourceLanguage}|${request.targetLanguage}`;
      
      // Check translation memory cache
      if (this.translationMemoryCache.has(cacheKey)) {
        const cachedTranslation = this.translationMemoryCache.get(cacheKey);
        if (cachedTranslation) {
          return {
            originalText: request.text,
            translatedText: cachedTranslation,
            sourceLanguage: request.sourceLanguage,
            targetLanguage: request.targetLanguage,
            confidence: 1.0
          };
        }
      }
      
      // In a real implementation, this would call a translation API
      // For now, we'll use a mock implementation
      console.log(`Translating from ${request.sourceLanguage} to ${request.targetLanguage}: ${request.text}`);
      
      // Mock translation (just append language code for demo)
      const mockTranslatedText = `${request.text} [${request.targetLanguage}]`;
      
      // Cache the result
      this.translationMemoryCache.set(cacheKey, mockTranslatedText);
      
      return {
        originalText: request.text,
        translatedText: mockTranslatedText,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        confidence: 0.85
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error}`);
    }
  }
  
  /**
   * Detect the language of a text
   */
  public async detectLanguage(text: string): Promise<LanguageDetectionResult> {
    try {
      // In a real implementation, this would call a language detection API
      // For now, we'll use a mock implementation
      console.log(`Detecting language for: ${text}`);
      
      // Mock detection (always returns English for demo)
      return {
        detectedLanguage: SupportedLanguage.ENGLISH_UK,
        confidence: 0.9,
        alternatives: [
          { language: SupportedLanguage.ENGLISH_UK, confidence: 0.9 },
          { language: SupportedLanguage.FRENCH, confidence: 0.05 },
          { language: SupportedLanguage.GERMAN, confidence: 0.03 }
        ]
      };
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error(`Language detection failed: ${error}`);
    }
  }
  
  /**
   * Get user language preferences
   */
  public async getUserLanguagePreferences(userId: string): Promise<UserLanguagePreferences> {
    try {
      // In a real implementation, this would fetch from an API or database
      // For now, we'll use mock data
      return {
        userId,
        primaryLanguage: SupportedLanguage.ENGLISH_UK,
        secondaryLanguages: [SupportedLanguage.FRENCH, SupportedLanguage.SPANISH],
        autoDetect: true,
        translateContent: true,
        translateUserContent: false,
        translateCommunications: true
      };
    } catch (error) {
      console.error('Error fetching user language preferences:', error);
      
      // Return default preferences
      return {
        userId,
        primaryLanguage: SupportedLanguage.ENGLISH_UK,
        secondaryLanguages: [],
        autoDetect: true,
        translateContent: true,
        translateUserContent: false,
        translateCommunications: true
      };
    }
  }
  
  /**
   * Update user language preferences
   */
  public async updateUserLanguagePreferences(preferences: UserLanguagePreferences): Promise<boolean> {
    try {
      // In a real implementation, this would update an API or database
      console.log('Updating user language preferences:', preferences);
      
      // Mock successful update
      return true;
    } catch (error) {
      console.error('Error updating user language preferences:', error);
      return false;
    }
  }
  
  /**
   * Get content localization metadata
   */
  public async getContentLocalizationMetadata(contentId: string): Promise<ContentLocalizationMetadata | null> {
    try {
      // In a real implementation, this would fetch from an API or database
      // For now, we'll use mock data
      return {
        contentId,
        contentType: 'lesson',
        originalLanguage: SupportedLanguage.ENGLISH_UK,
        availableTranslations: [
          SupportedLanguage.FRENCH,
          SupportedLanguage.SPANISH,
          SupportedLanguage.GERMAN
        ],
        lastUpdated: new Date(),
        translationStatus: {
          [SupportedLanguage.FRENCH]: 'complete',
          [SupportedLanguage.SPANISH]: 'machine-translated',
          [SupportedLanguage.GERMAN]: 'needs-review'
        }
      };
    } catch (error) {
      console.error('Error fetching content localization metadata:', error);
      return null;
    }
  }
  
  /**
   * Format date according to the current language
   */
  public formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    try {
      return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toLocaleDateString();
    }
  }
  
  /**
   * Format number according to the current language
   */
  public formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    } catch (error) {
      console.error('Number formatting error:', error);
      return number.toString();
    }
  }
  
  /**
   * Get text direction for the current language
   */
  public getTextDirection(): TextDirection {
    const metadata = this.languageMetadata.get(this.currentLanguage);
    return metadata ? metadata.direction : TextDirection.LTR;
  }
  
  /**
   * Check if the current language is RTL
   */
  public isRtl(): boolean {
    return this.getTextDirection() === TextDirection.RTL;
  }
}
