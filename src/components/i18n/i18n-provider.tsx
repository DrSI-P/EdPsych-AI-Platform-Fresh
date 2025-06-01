'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nService } from '@/lib/i18n/i18nService';
import { SupportedLanguage, TranslationNamespace } from '@/lib/i18n/types';

// Create context type
interface I18nContextType {
  t: (key: string, namespace?: TranslationNamespace, params?: Record<string, string>) => string;
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<boolean>;
  isRtl: boolean;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
}

// Create context with default values
const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
  currentLanguage: SupportedLanguage.ENGLISH_UK,
  changeLanguage: async () => false,
  isRtl: false,
  formatDate: (date) => date.toLocaleDateString(),
  formatNumber: (number) => number.toString(),
});

// Provider props
interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}

// Provider component
export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLanguage = SupportedLanguage.ENGLISH_UK,
}) => {
  const i18nService = I18nService.getInstance();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [isRtl, setIsRtl] = useState<boolean>(false);
  
  // Initialize the provider
  useEffect(() => {
    const initialize = async () => {
      try {
        // Set initial language
        await i18nService.setLanguage(initialLanguage);
        setCurrentLanguage(initialLanguage);
        
        // Set RTL status
        setIsRtl(i18nService.isRtl());
      } catch (error) {
        console.error('Error initializing I18nProvider:', error);
      }
    };
    
    initialize();
  }, [initialLanguage]);
  
  // Translation function
  const t = (key: string, namespace: TranslationNamespace = TranslationNamespace.COMMON, params?: Record<string, string>): string => {
    return i18nService.translate(key, namespace, params);
  };
  
  // Change language function
  const changeLanguage = async (language: SupportedLanguage): Promise<boolean> => {
    try {
      const success = await i18nService.setLanguage(language);
      if (success) {
        setCurrentLanguage(language);
        setIsRtl(i18nService.isRtl());
      }
      return success;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };
  
  // Format date function
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return i18nService.formatDate(date, options);
  };
  
  // Format number function
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return i18nService.formatNumber(number, options);
  };
  
  // Context value
  const contextValue: I18nContextType = {
    t,
    currentLanguage,
    changeLanguage,
    isRtl,
    formatDate,
    formatNumber,
  };
  
  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

// Custom hook for using the I18n context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Higher-order component for translating components
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & { t: I18nContextType['t'] }>
): React.FC<P> {
  return (props: P) => {
    const { t } = useI18n();
    return <Component {...props} t={t} />;
  };
}
