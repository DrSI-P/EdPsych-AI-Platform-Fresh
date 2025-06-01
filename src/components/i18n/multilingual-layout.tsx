'use client';

import React, { useEffect } from 'react';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { SupportedLanguage } from '@/lib/i18n/types';
import LanguageSwitcher from '@/components/i18n/language-switcher';

interface MultilingualLayoutProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

/**
 * Multilingual Layout Component
 * 
 * This component wraps the application with the I18nProvider and adds
 * a language switcher in the top-right corner of the layout.
 * It ensures all child components have access to translation functions
 * and language settings.
 */
export const MultilingualLayout: React.FC<MultilingualLayoutProps> = ({
  children,
  initialLanguage = SupportedLanguage.ENGLISH_UK
}) => {
  // Set HTML dir attribute based on language direction
  useEffect(() => {
    // This will be handled by the I18nProvider, but we set a default here
    document.documentElement.lang = initialLanguage;
  }, [initialLanguage]);
  
  return (
    <I18nProvider initialLanguage={initialLanguage}>
      <div className="relative min-h-screen">
        {/* Language switcher in the top-right corner */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher size="sm" showLabel={false} />
        </div>
        
        {/* Main content */}
        {children}
      </div>
    </I18nProvider>
  );
};

export default MultilingualLayout;
