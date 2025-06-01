import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect } from 'react';

// Create a context for i18n
const I18nContext = createContext();

// Initialize i18n instance
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      lng: 'en-GB',
      fallbackLng: 'en-GB',
      supportedLngs: ['en-GB', 'fr', 'es', 'de', 'pl', 'ur'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export function I18nProvider({ children }) {
  const router = useRouter();
  const { locale } = router;
  
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);
  
  return (
    <I18nContext.Provider value={{ i18n, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation(namespace = 'common') {
  const { i18n } = useI18n();
  return useTranslationOriginal(namespace, { i18n });
}

// Helper function to load translations dynamically
export async function loadTranslations(locale, namespaces = ['common']) {
  const translations = {};
  
  for (const ns of namespaces) {
    try {
      const module = await import(`../../public/locales/${locale}/${ns}.json`);
      translations[ns] = module.default || module;
      
      // Add resources to i18n instance
      i18n.addResourceBundle(locale, ns, translations[ns], true, true);
    } catch (error) {
      console.error(`Failed to load translation for ${locale}/${ns}:`, error);
    }
  }
  
  return translations;
}
