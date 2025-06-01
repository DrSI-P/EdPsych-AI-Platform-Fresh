import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';

const initI18next = async (locale, namespaces) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language, namespace) => 
        import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(locale, namespaces));
  
  return i18nInstance;
};

export async function useTranslation(locale, namespaces, options = {}) {
  const i18nextInstance = await initI18next(
    locale,
    Array.isArray(namespaces) ? namespaces : [namespaces]
  );

  return {
    t: i18nextInstance.getFixedT(
      locale,
      Array.isArray(namespaces) ? namespaces[0] : namespaces,
      options.keyPrefix
    ),
    i18n: i18nextInstance
  };
}
