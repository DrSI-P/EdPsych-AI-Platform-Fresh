import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

export const I18nProvider = ({ children, locale, namespaces = ['common'] }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export async function getI18nProps(ctx, namespaces = ['common']) {
  const locale = ctx?.locale || ctx?.params?.locale || 'en-GB';
  
  return {
    ...(await serverSideTranslations(locale, namespaces)),
  };
}

export function useI18n(namespace = 'common') {
  return useTranslation(namespace);
}
