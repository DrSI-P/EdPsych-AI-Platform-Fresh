import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the context type
type CookieConsentContextType = {
  consents: {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    advertising: boolean;
  };
  setConsent: (type: string, value: boolean) => void;
  saveConsents: () => void;
  resetConsents: () => void;
};

// Create the context with default values
const CookieConsentContext = createContext<CookieConsentContextType>({
  consents: {
    essential: true, // Essential cookies are always required
    functional: false,
    analytics: false,
    advertising: false,
  },
  setConsent: () => {},
  saveConsents: () => {},
  resetConsents: () => {},
});

// Hook to use the cookie consent context
export const useCookieConsent = () => useContext(CookieConsentContext);

// Provider component
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  // Default state - essential cookies are always true
  const [consents, setConsents] = useState({
    essential: true,
    functional: false,
    analytics: false,
    advertising: false,
  });
  
  const [bannerVisible, setBannerVisible] = useState(false);

  // Load saved consents from localStorage on mount
  useEffect(() => {
    const loadConsents = () => {
      try {
        const savedConsents = localStorage.getItem('cookie-consents');
        if (savedConsents) {
          const parsedConsents = JSON.parse(savedConsents);
          setConsents({
            ...parsedConsents,
            essential: true, // Essential cookies are always required
          });
          return true;
        }
      } catch (error) {
        console.error('Error loading cookie consents:', error);
      }
      return false;
    };

    // If no consents are loaded, show the banner
    const consentsLoaded = loadConsents();
    if (!consentsLoaded) {
      setBannerVisible(true);
    }
  }, []);

  // Set individual consent
  const setConsent = (type: string, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  // Save consents to localStorage
  const saveConsents = () => {
    try {
      localStorage.setItem('cookie-consents', JSON.stringify(consents));
      setBannerVisible(false);
    } catch (error) {
      console.error('Error saving cookie consents:', error);
    }
  };

  // Reset consents to default
  const resetConsents = () => {
    setConsents({
      essential: true,
      functional: false,
      analytics: false,
      advertising: false,
    });
    try {
      localStorage.removeItem('cookie-consents');
      setBannerVisible(true);
    } catch (error) {
      console.error('Error resetting cookie consents:', error);
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consents,
        setConsent,
        saveConsents,
        resetConsents,
      }}
    >
      {children}
      {bannerVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Cookie Consent</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  We use cookies to enhance your experience. Essential cookies are always active.
                  You can choose which other cookies you allow.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => {
                    // Accept all cookies
                    setConsents({
                      essential: true,
                      functional: true,
                      analytics: true,
                      advertising: true,
                    });
                    saveConsents();
                  }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Accept All
                </button>
                <button
                  onClick={() => {
                    // Accept only essential cookies
                    saveConsents();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Essential Only
                </button>
                <button
                  onClick={() => {
                    // Show detailed settings
                    // This would typically open a modal with detailed cookie settings
                    // For simplicity, we're just saving the current settings
                    saveConsents();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CookieConsentContext.Provider>
  );
}
