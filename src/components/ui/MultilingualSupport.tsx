import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultilingualContentProps {
  content: {
    [language: string]: React.ReactNode;
  };
  defaultLanguage?: string;
  availableLanguages?: Array<{
    code: string;
    name: string;
    flag?: string;
  }>;
  userPreferredLanguage?: string;
  onLanguageChange?: (language: string) => void;
  showLanguageSelector?: boolean;
  position?: 'top' | 'bottom';
}

/**
 * MultilingualSupport component that provides content in multiple languages
 * with easy language switching
 */
const MultilingualSupport: React.FC<MultilingualContentProps> = ({
  content,
  defaultLanguage = 'en',
  availableLanguages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
  ],
  userPreferredLanguage,
  onLanguageChange,
  showLanguageSelector = true,
  position = 'top'
}) => {
  const [activeLanguage, setActiveLanguage] = useState<string>(
    userPreferredLanguage || defaultLanguage
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Filter available languages to only those that have content
  const filteredLanguages = availableLanguages.filter(lang => 
    content[lang.code] !== undefined
  );
  
  // Get current language details
  const currentLanguage = filteredLanguages.find(lang => lang.code === activeLanguage) || 
    filteredLanguages.find(lang => lang.code === defaultLanguage) || 
    filteredLanguages[0];
  
  // Update active language when user preference changes
  useEffect(() => {
    if (userPreferredLanguage && content[userPreferredLanguage]) {
      setActiveLanguage(userPreferredLanguage);
    }
  }, [userPreferredLanguage, content]);
  
  // Handle language change
  const handleLanguageChange = (language: string) => {
    setActiveLanguage(language);
    setIsDropdownOpen(false);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
    
    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', language);
  };
  
  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="multilingual-support">
      {/* Language selector */}
      {showLanguageSelector && filteredLanguages.length > 1 && (
        <div className={`language-selector ${position === 'top' ? 'mb-4' : 'mt-4'}`}>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-centre space-x-2 px-3 py-2 border border-grey-300 rounded-md bg-white hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <span className="text-lg mr-1">{currentLanguage?.flag}</span>
              <span>{currentLanguage?.name}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-grey-200 py-1"
                >
                  {filteredLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full text-left px-4 py-2 hover:bg-grey-100 flex items-centre ${
                        activeLanguage === language.code ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <span className="text-lg mr-2">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Content area */}
      <div className="multilingual-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLanguage}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
          >
            {content[activeLanguage] || content[defaultLanguage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MultilingualSupport;
