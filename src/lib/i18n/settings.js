export const getOptions = (locale, namespaces) => {
  return {
    // debug: process.env.NODE_ENV === 'development',
    supportedLngs: ['en-GB', 'fr', 'es', 'de', 'pl', 'ur'],
    fallbackLng: 'en-GB',
    lng: locale,
    fallbackNS: 'common',
    defaultNS: 'common',
    ns: namespaces,
  };
};
