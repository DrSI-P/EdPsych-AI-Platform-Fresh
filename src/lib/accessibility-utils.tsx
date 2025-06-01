// Accessibility utilities for EdPsych-AI-Education-Platform
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Context for accessibility settings
interface AccessibilityContextType {
  fontSize: string;
  setFontSize: (size: string) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  screenReader: boolean;
  setScreenReader: (enabled: boolean) => void;
  colorBlindMode: string;
  setColorBlindMode: (mode: string) => void;
  focusMode: boolean;
  setFocusMode: (enabled: boolean) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

const defaultAccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  dyslexicFont: false,
  reduceMotion: false,
  screenReader: false,
  colorBlindMode: 'none',
  focusMode: false
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/**
 * Provider component for accessibility settings
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from localStorage or use defaults
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultAccessibilitySettings;
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
      return defaultAccessibilitySettings;
    }
  };

  const [fontSize, setFontSize] = useState(loadSettings().fontSize);
  const [highContrast, setHighContrast] = useState(loadSettings().highContrast);
  const [dyslexicFont, setDyslexicFont] = useState(loadSettings().dyslexicFont);
  const [reduceMotion, setReduceMotion] = useState(loadSettings().reduceMotion);
  const [screenReader, setScreenReader] = useState(loadSettings().screenReader);
  const [colorBlindMode, setColorBlindMode] = useState(loadSettings().colorBlindMode);
  const [focusMode, setFocusMode] = useState(loadSettings().focusMode);

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    try {
      const settings = {
        fontSize,
        highContrast,
        dyslexicFont,
        reduceMotion,
        screenReader,
        colorBlindMode,
        focusMode
      };
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }, [fontSize, highContrast, dyslexicFont, reduceMotion, screenReader, colorBlindMode, focusMode]);

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setFontSize(defaultAccessibilitySettings.fontSize);
    setHighContrast(defaultAccessibilitySettings.highContrast);
    setDyslexicFont(defaultAccessibilitySettings.dyslexicFont);
    setReduceMotion(defaultAccessibilitySettings.reduceMotion);
    setScreenReader(defaultAccessibilitySettings.screenReader);
    setColorBlindMode(defaultAccessibilitySettings.colorBlindMode);
    setFocusMode(defaultAccessibilitySettings.focusMode);
    
    try {
      localStorage.removeItem('accessibilitySettings');
    } catch (error) {
      console.error('Failed to reset accessibility settings:', error);
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    // Apply font size
    document.documentElement.setAttribute('data-font-size', fontSize);
    
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply dyslexic font
    if (dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
    
    // Apply reduced motion
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Apply colour blind mode
    document.documentElement.setAttribute('data-colour-blind', colorBlindMode);
    
    // Apply focus mode
    if (focusMode) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
    
    // Save settings whenever they change
    saveSettings();
  }, [fontSize, highContrast, dyslexicFont, reduceMotion, colorBlindMode, focusMode, saveSettings]);

  // Check for prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches && !reduceMotion) {
      setReduceMotion(true);
    }
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [reduceMotion]);

  // Check for prefers-colour-scheme media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-colour-scheme: dark)');
    
    if (mediaQuery.matches && !highContrast) {
      setHighContrast(true);
    }
    
    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [highContrast]);

  const value = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    reduceMotion,
    setReduceMotion,
    screenReader,
    setScreenReader,
    colorBlindMode,
    setColorBlindMode,
    focusMode,
    setFocusMode,
    saveSettings,
    resetSettings
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook for using accessibility settings
 * @returns {Object} - Accessibility settings and functions
 */
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
};

/**
 * Component for accessibility controls
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessibility controls component
 */
export const AccessibilityControls: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    reduceMotion,
    setReduceMotion,
    colorBlindMode,
    setColorBlindMode,
    focusMode,
    setFocusMode,
    resetSettings
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accessibility-controls">
      <button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Accessibility settings"
      >
        <span className="sr-only">Accessibility settings</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </button>

      {isOpen && (
        <div className="accessibility-panel" role="dialogue" aria-label="Accessibility settings">
          <h2>Accessibility Settings</h2>

          <div className="setting-group">
            <label htmlFor="font-size">Font Size</label>
            <select
              id="font-size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="high-contrast">
              <input
                id="high-contrast"
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              High Contrast
            </label>
          </div>

          <div className="setting-group">
            <label htmlFor="dyslexic-font">
              <input
                id="dyslexic-font"
                type="checkbox"
                checked={dyslexicFont}
                onChange={(e) => setDyslexicFont(e.target.checked)}
              />
              Dyslexic-friendly Font
            </label>
          </div>

          <div className="setting-group">
            <label htmlFor="reduce-motion">
              <input
                id="reduce-motion"
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
              />
              Reduce Motion
            </label>
          </div>

          <div className="setting-group">
            <label htmlFor="colour-blind-mode">Colour Blind Mode</label>
            <select
              id="colour-blind-mode"
              value={colorBlindMode}
              onChange={(e) => setColorBlindMode(e.target.value)}
            >
              <option value="none">None</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              <option value="achromatopsia">Achromatopsia (No Colour)</option>
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="focus-mode">
              <input
                id="focus-mode"
                type="checkbox"
                checked={focusMode}
                onChange={(e) => setFocusMode(e.target.checked)}
              />
              Focus Mode
            </label>
          </div>

          <button
            className="reset-button"
            onClick={resetSettings}
            aria-label="Reset all accessibility settings to default"
          >
            Reset to Defaults
          </button>

          <button
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility settings"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Component for skip navigation link
 * @returns {JSX.Element} - Skip navigation component
 */
export const SkipNavigation: React.FC = () => {
  return (
    <a href="#main-content" className="skip-navigation">
      Skip to main content
    </a>
  );
};

/**
 * Hook for managing focus trap in modals
 * @param {Object} options - Hook options
 * @returns {Object} - Ref and functions for focus trap
 */
export const useFocusTrap = (options = {}) => {
  const ref = React.useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        deactivate();
      }
    };

    // Save active element to restore focus later
    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    // Add event listener
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus when trap is deactivated
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isActive, deactivate]);

  return { ref, activate, deactivate };
};

/**
 * Component for screen reader announcements
 * @returns {JSX.Element} - Announcer component
 */
export const ScreenReaderAnnouncer: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  const [politeness, setPoliteness] = useState<'assertive' | 'polite'>('polite');

  // Create a global announce function
  useEffect(() => {
    window.announce = (message: string, level: 'assertive' | 'polite' = 'polite') => {
      setAnnouncement(message);
      setPoliteness(level);
      
      // Clear announcement after a delay
      setTimeout(() => {
        setAnnouncement('');
      }, 3000);
    };
    
    return () => {
      delete window.announce;
    };
  }, []);

  return (
    <div className="sr-only" aria-live={politeness}>
      {announcement}
    </div>
  );
};

// Extend Window interface to include announce function
declare global {
  interface Window {
    announce: (message: string, level?: 'assertive' | 'polite') => void;
  }
}

/**
 * Component for keyboard shortcut help
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Keyboard shortcuts component
 */
export const KeyboardShortcuts: React.FC<{ shortcuts: { key: string; description: string }[] }> = ({
  shortcuts
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, activate, deactivate } = useFocusTrap();

  useEffect(() => {
    if (isOpen) {
      activate();
    } else {
      deactivate();
    }
  }, [isOpen, activate, deactivate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open shortcuts panel with ? key
      if (e.key === '?' && !isOpen) {
        setIsOpen(true);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="keyboard-shortcuts-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Keyboard shortcuts"
      >
        <span className="sr-only">Keyboard shortcuts</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <path d="M6 8h.01" />
          <path d="M10 8h.01" />
          <path d="M14 8h.01" />
          <path d="M18 8h.01" />
          <path d="M6 12h.01" />
          <path d="M10 12h.01" />
          <path d="M14 12h.01" />
          <path d="M18 12h.01" />
          <path d="M6 16h.01" />
          <path d="M10 16h.01" />
          <path d="M14 16h.01" />
          <path d="M18 16h.01" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="keyboard-shortcuts-panel"
          role="dialogue"
          aria-label="Keyboard shortcuts"
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          <h2>Keyboard Shortcuts</h2>

          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut, index) => (
                <tr key={index}>
                  <td>
                    <kbd>{shortcut.key}</kbd>
                  </td>
                  <td>{shortcut.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Close keyboard shortcuts"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

/**
 * Component for text-to-speech functionality
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Text-to-speech component
 */
export const TextToSpeech: React.FC<{ text: string; autoPlay?: boolean }> = ({
  text,
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Initialize utterance
  useEffect(() => {
    if (!text) return;

    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Set default voice (English UK)
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find(voice => voice.lang === 'en-GB');
    if (ukVoice) {
      newUtterance.voice = ukVoice;
    }
    
    newUtterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    setUtterance(newUtterance);
    
    // Auto-play if enabled
    if (autoPlay) {
      window.speechSynthesis.speak(newUtterance);
      setIsPlaying(true);
    }
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, autoPlay]);

  // Play text
  const play = () => {
    if (!utterance) return;
    
    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.speak(utterance);
    }
    
    setIsPlaying(true);
    setIsPaused(false);
  };

  // Pause speech
  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  // Stop speech
  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="text-to-speech">
      {isPlaying ? (
        <button onClick={pause} aria-label="Pause speech">
          Pause
        </button>
      ) : (
        <button onClick={play} aria-label="Play speech">
          {isPaused ? 'Resume' : 'Listen'}
        </button>
      )}
      
      {(isPlaying || isPaused) && (
        <button onClick={stop} aria-label="Stop speech">
          Stop
        </button>
      )}
    </div>
  );
};

/**
 * Component for accessible image with alt text and optional description
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible image component
 */
export const AccessibleImage: React.FC<{
  src: string;
  alt: string;
  longDescription?: string;
  width?: number;
  height?: number;
  className?: string;
}> = ({ src, alt, longDescription, width, height, className }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <figure className={`accessible-image ${className || ''}`}>
      <img src={src} alt={alt} width={width} height={height} />
      
      {longDescription && (
        <>
          <button
            className="description-toggle"
            onClick={() => setShowDescription(!showDescription)}
            aria-expanded={showDescription}
            aria-controls="image-description"
          >
            {showDescription ? 'Hide Description' : 'Show Description'}
          </button>
          
          {showDescription && (
            <figcaption id="image-description">
              {longDescription}
            </figcaption>
          )}
        </>
      )}
    </figure>
  );
};

/**
 * Component for accessible data table with sorting and filtering
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible table component
 */
export const AccessibleTable: React.FC<{
  caption: string;
  headers: { id: string; label: string; sortable?: boolean }[];
  data: Record<string, any>[];
  allowFiltering?: boolean;
  allowSorting?: boolean;
  allowPagination?: boolean;
  rowsPerPage?: number;
}> = ({
  caption,
  headers,
  data,
  allowFiltering = true,
  allowSorting = true,
  allowPagination = true,
  rowsPerPage = 10
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = data.filter(row => {
    if (!filterText) return true;
    
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = allowPagination
    ? sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : sortedData;

  // Handle sort
  const handleSort = (columnId: string) => {
    if (!allowSorting) return;
    
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
    
    // Reset to first page when sorting
    setCurrentPage(1);
  };

  // Handle filter
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="accessible-table-container">
      {allowFiltering && (
        <div className="table-filter">
          <label htmlFor="table-filter">Filter:</label>
          <input
            id="table-filter"
            type="text"
            value={filterText}
            onChange={handleFilter}
            placeholder="Filter table..."
            aria-label="Filter table content"
          />
          {filterText && (
            <button
              onClick={() => setFilterText('')}
              aria-label="Clear filter"
              className="clear-filter"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <table className="accessible-table">
        <caption>{caption}</caption>
        
        <thead>
          <tr>
            {headers.map(header => (
              <th
                key={header.id}
                scope="col"
                aria-sort={
                  sortColumn === header.id
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {header.sortable && allowSorting ? (
                  <button
                    className="sort-button"
                    onClick={() => handleSort(header.id)}
                    aria-label={`Sort by ${header.label} ${
                      sortColumn === header.id && sortDirection === 'asc'
                        ? 'descending'
                        : 'ascending'
                    }`}
                  >
                    {header.label}
                    {sortColumn === header.id && (
                      <span className="sort-icon">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </button>
                ) : (
                  header.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map(header => (
                  <td key={header.id}>{row[header.id]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="no-data">
                No data available
                {filterText && ' matching the filter criteria'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {allowPagination && totalPages > 1 && (
        <div className="table-pagination" role="navigation" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            First
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            Last
          </button>
        </div>
      )}
      
      <div className="table-info">
        Showing {paginatedData.length} of {filteredData.length} 
        {filteredData.length !== data.length && ` (filtered from ${data.length})`} items
      </div>
    </div>
  );
};

/**
 * Component for accessible tabs
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible tabs component
 */
export const AccessibleTabs: React.FC<{
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
}> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="accessible-tabs">
      <div role="tablist" aria-label="Content tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={activeTab === tab.id ? 'active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map(tab => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="tab-panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

/**
 * Component for accessible accordion
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible accordion component
 */
export const AccessibleAccordion: React.FC<{
  items: { id: string; title: string; content: React.ReactNode }[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}> = ({ items, allowMultiple = false, defaultOpen = [] }) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  return (
    <div className="accessible-accordion">
      {items.map(item => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <div key={item.id} className="accordion-item">
            <h3>
              <button
                id={`accordion-header-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${item.id}`}
                onClick={() => toggleItem(item.id)}
                className="accordion-trigger"
              >
                {item.title}
                <span className="accordion-icon">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            
            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              hidden={!isOpen}
              className="accordion-panel"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Component for accessible modal dialogue
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible modal component
 */
export const AccessibleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  ariaLabel?: string;
}> = ({ isOpen, onClose, title, children, ariaLabel }) => {
  const { ref, activate, deactivate } = useFocusTrap();

  useEffect(() => {
    if (isOpen) {
      activate();
      document.body.style.overflow = 'hidden';
    } else {
      deactivate();
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, activate, deactivate]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialogue"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={ariaLabel ? undefined : "modal-description"}
        aria-label={ariaLabel}
        ref={ref as React.RefObject<HTMLDivElement>}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div id="modal-description" className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Component for accessible tooltip
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible tooltip component
 */
export const AccessibleTooltip: React.FC<{
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const tooltipId = React.useId();

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    if (!isFocused) {
      setIsVisible(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    showTooltip();
  };

  const handleBlur = () => {
    setIsFocused(false);
    hideTooltip();
  };

  return (
    <div className="tooltip-container">
      <div
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={tooltipId}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`tooltip tooltip-${position}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

/**
 * Component for accessible form field with validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible form field component
 */
export const AccessibleFormField: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  helperText?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  options?: { value: string; label: string }[];
}> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  placeholder,
  helperText,
  autoComplete,
  disabled = false,
  readOnly = false,
  min,
  max,
  pattern,
  options
}) => {
  const fieldId = `field-${id}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  
  const hasError = !!error;
  
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={`${hasError ? errorId : ''} ${helperText ? helperId : ''}`}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={autoComplete}
          />
        );
      
      case 'select':
        return (
          <select
            id={fieldId}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            aria-invalid={hasError}
            aria-describedby={`${hasError ? errorId : ''} ${helperText ? helperId : ''}`}
            disabled={disabled}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            id={fieldId}
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={`${hasError ? errorId : ''} ${helperText ? helperId : ''}`}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={autoComplete}
            min={min}
            max={max}
            pattern={pattern}
          />
        );
    }
  };

  return (
    <div className={`form-field ${hasError ? 'has-error' : ''}`}>
      <label htmlFor={fieldId}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      
      {renderField()}
      
      {hasError && (
        <div id={errorId} className="error-message" role="alert">
          {error}
        </div>
      )}
      
      {helperText && (
        <div id={helperId} className="helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

/**
 * Component for accessible colour picker with contrast checking
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible colour picker component
 */
export const AccessibleColorPicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
  backgroundColor?: string;
  showContrastWarning?: boolean;
}> = ({
  value,
  onChange,
  label,
  id,
  backgroundColor = '#ffffff',
  showContrastWarning = true
}) => {
  const [contrastRatio, setContrastRatio] = useState(0);
  const [contrastLevel, setContrastLevel] = useState<'fail' | 'AA' | 'AAA'>('fail');

  // Calculate contrast ratio
  useEffect(() => {
    // Convert hex to rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 0, g: 0, b: 0 };
    };

    // Calculate relative luminance
    const luminance = (rgb: { r: number; g: number; b: number }) => {
      const a = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    // Calculate contrast ratio
    const color1 = hexToRgb(value);
    const color2 = hexToRgb(backgroundColor);
    
    const luminance1 = luminance(color1);
    const luminance2 = luminance(color2);
    
    const ratio =
      (Math.max(luminance1, luminance2) + 0.05) /
      (Math.min(luminance1, luminance2) + 0.05);
    
    setContrastRatio(ratio);
    
    // Determine WCAG level
    if (ratio >= 7) {
      setContrastLevel('AAA');
    } else if (ratio >= 4.5) {
      setContrastLevel('AA');
    } else {
      setContrastLevel('fail');
    }
  }, [value, backgroundColor]);

  return (
    <div className="accessible-colour-picker">
      <label htmlFor={id}>{label}</label>
      
      <div className="colour-picker-container">
        <input
          type="colour"
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label={`${label} hex value`}
          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        />
      </div>
      
      {showContrastWarning && (
        <div
          className={`contrast-info ${
            contrastLevel === 'fail' ? 'contrast-fail' : ''
          }`}
        >
          <div className="contrast-sample" style={{ backgroundColor, color: value }}>
            Sample Text
          </div>
          
          <div className="contrast-ratio">
            Contrast ratio: {contrastRatio.toFixed(2)}:1 ({contrastLevel})
            {contrastLevel === 'fail' && (
              <span className="contrast-warning">
                This colour combination does not meet WCAG accessibility standards.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Component for accessible file upload with validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible file upload component
 */
export const AccessibleFileUpload: React.FC<{
  id: string;
  label: string;
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  required?: boolean;
  error?: string;
  helperText?: string;
}> = ({
  id,
  label,
  onChange,
  accept,
  multiple = false,
  maxSize,
  required = false,
  error,
  helperText
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(error);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const fieldId = `file-${id}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  
  const hasError = !!(error || localError);

  // Handle file selection
  const handleFileChange = (files: FileList | null) => {
    if (!files) {
      setSelectedFiles([]);
      onChange(null);
      return;
    }
    
    const fileArray = Array.from(files);
    let validationError;
    
    // Validate file size
    if (maxSize) {
      const oversizedFiles = fileArray.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        validationError = `File${oversizedFiles.length > 1 ? 's' : ''} too large. Maximum size is ${formatFileSize(maxSize)}.`;
      }
    }
    
    setLocalError(validationError);
    
    if (!validationError) {
      setSelectedFiles(fileArray);
      onChange(files);
    } else {
      setSelectedFiles([]);
      onChange(null);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  return (
    <div className={`accessible-file-upload ${hasError ? 'has-error' : ''}`}>
      <label htmlFor={fieldId}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id={fieldId}
          type="file"
          onChange={e => handleFileChange(e.target.files)}
          accept={accept}
          multiple={multiple}
          required={required}
          aria-invalid={hasError}
          aria-describedby={`${hasError ? errorId : ''} ${helperText ? helperId : ''}`}
        />
        
        <div className="upload-prompt">
          <p>
            Drag and drop {multiple ? 'files' : 'a file'} here, or{' '}
            <button
              type="button"
              onClick={() => document.getElementById(fieldId)?.click()}
              className="upload-button"
            >
              browse
            </button>
          </p>
          
          {accept && (
            <p className="file-types">
              Accepted file types: {accept.split(',').join(', ')}
            </p>
          )}
          
          {maxSize && (
            <p className="file-size">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
          )}
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <ul className="selected-files">
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name} ({formatFileSize(file.size)})
            </li>
          ))}
        </ul>
      )}
      
      {hasError && (
        <div id={errorId} className="error-message" role="alert">
          {error || localError}
        </div>
      )}
      
      {helperText && (
        <div id={helperId} className="helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

/**
 * Component for accessible date picker
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible date picker component
 */
export const AccessibleDatePicker: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  required = false,
  error,
  helperText,
  disabled = false
}) => {
  const fieldId = `date-${id}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  
  const hasError = !!error;

  return (
    <div className={`accessible-date-picker ${hasError ? 'has-error' : ''}`}>
      <label htmlFor={fieldId}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      
      <input
        id={fieldId}
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        max={max}
        required={required}
        aria-invalid={hasError}
        aria-describedby={`${hasError ? errorId : ''} ${helperText ? helperId : ''}`}
        disabled={disabled}
      />
      
      {hasError && (
        <div id={errorId} className="error-message" role="alert">
          {error}
        </div>
      )}
      
      {helperText && (
        <div id={helperId} className="helper-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

/**
 * Component for accessible progress indicator
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible progress component
 */
export const AccessibleProgress: React.FC<{
  value: number;
  max: number;
  label: string;
  showPercentage?: boolean;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
  type?: 'bar' | 'circle';
}> = ({
  value,
  max,
  label,
  showPercentage = true,
  showValue = false,
  size = 'medium',
  type = 'bar'
}) => {
  const percentage = Math.round((value / max) * 100);
  const progressId = React.useId();

  if (type === 'circle') {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className={`accessible-progress-circle size-${size}`}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          aria-labelledby={`${progressId}-title`}
          role="img"
        >
          <title id={`${progressId}-title`}>{label}: {percentage}%</title>
          
          <circle
            className="progress-background"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="10"
          />
          
          <circle
            className="progress-indicator"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#4caf50"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
          
          {(showPercentage || showValue) && (
            <text x="50" y="55" textAnchor="middle" fontSize="20">
              {showPercentage ? `${percentage}%` : `${value}/${max}`}
            </text>
          )}
        </svg>
        
        <div className="progress-label">{label}</div>
      </div>
    );
  }

  return (
    <div className={`accessible-progress-bar size-${size}`}>
      <div className="progress-label" id={`${progressId}-label`}>
        {label}
        {showPercentage && <span className="percentage"> {percentage}%</span>}
        {showValue && <span className="value"> ({value}/{max})</span>}
      </div>
      
      <div className="progress-container">
        <progress
          value={value}
          max={max}
          aria-labelledby={`${progressId}-label`}
        />
      </div>
    </div>
  );
};

/**
 * Component for accessible star rating
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible star rating component
 */
export const AccessibleStarRating: React.FC<{
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  label: string;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({
  value,
  onChange,
  max = 5,
  label,
  readOnly = false,
  size = 'medium'
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const ratingId = React.useId();

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(0);
  };

  const handleClick = (index: number) => {
    if (readOnly) return;
    onChange?.(index);
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= max; i++) {
      const filled = i <= (hoverValue || value);
      
      stars.push(
        <span
          key={i}
          className={`star ${filled ? 'filled' : 'empty'}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          role={readOnly ? 'presentation' : 'button'}
          aria-label={readOnly ? undefined : `Rate ${i} out of ${max} stars`}
          tabIndex={readOnly ? -1 : 0}
          onKeyDown={e => {
            if (readOnly) return;
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(i);
              e.preventDefault();
            }
          }}
        >
          ★
        </span>
      );
    }
    
    return stars;
  };

  return (
    <div className={`accessible-star-rating size-${size} ${readOnly ? 'read-only' : ''}`}>
      <div className="rating-label" id={`${ratingId}-label`}>
        {label}
      </div>
      
      <div
        className="stars-container"
        aria-label={`${label}: ${value} out of ${max} stars`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        role="meter"
        aria-labelledby={`${ratingId}-label`}
      >
        {renderStars()}
      </div>
      
      {!readOnly && (
        <div className="rating-value" aria-live="polite">
          Selected rating: {value} out of {max}
        </div>
      )}
    </div>
  );
};

/**
 * Component for accessible toggle switch
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible toggle switch component
 */
export const AccessibleToggle: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  onText?: string;
  offText?: string;
}> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  onText = 'On',
  offText = 'Off'
}) => {
  const toggleId = `toggle-${id}`;

  return (
    <div className={`accessible-toggle size-${size} ${disabled ? 'disabled' : ''}`}>
      <label htmlFor={toggleId} className="toggle-label">
        {label}
      </label>
      
      <div className="toggle-container">
        <input
          id={toggleId}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          aria-label={`${label}: ${checked ? onText : offText}`}
        />
        
        <div className="toggle-switch">
          <span className="toggle-track" />
          <span className="toggle-thumb" />
        </div>
        
        <span className="toggle-text">
          {checked ? onText : offText}
        </span>
      </div>
    </div>
  );
};

/**
 * Component for accessible pagination
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible pagination component
 */
export const AccessiblePagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  ariaLabel?: string;
}> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  ariaLabel = 'Pagination'
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a subset of pages with ellipsis
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible + 1) {
        // Near the start
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <nav className="accessible-pagination" aria-label={ariaLabel}>
      <ul>
        {showFirstLast && (
          <li>
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="Go to first page"
              className="pagination-first"
            >
              First
            </button>
          </li>
        )}
        
        {showPrevNext && (
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
              className="pagination-prev"
            >
              Previous
            </button>
          </li>
        )}
        
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === 'ellipsis' ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {showPrevNext && (
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
              className="pagination-next"
            >
              Next
            </button>
          </li>
        )}
        
        {showFirstLast && (
          <li>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Go to last page"
              className="pagination-last"
            >
              Last
            </button>
          </li>
        )}
      </ul>
      
      <div className="pagination-info" aria-live="polite">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
};

/**
 * Component for accessible breadcrumbs
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible breadcrumbs component
 */
export const AccessibleBreadcrumbs: React.FC<{
  items: { label: string; href: string }[];
  currentPageLabel?: string;
  separator?: string;
}> = ({
  items,
  currentPageLabel,
  separator = '/'
}) => {
  return (
    <nav className="accessible-breadcrumbs" aria-label="Breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
            {index < items.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        ))}
        
        {currentPageLabel && (
          <li>
            <span aria-current="page">{currentPageLabel}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

/**
 * Component for accessible alert messages
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible alert component
 */
export const AccessibleAlert: React.FC<{
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  icon?: boolean;
}> = ({
  type,
  message,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  icon = true
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'info':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      
      case 'success':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      
      case 'warning':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      
      case 'error':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      className={`accessible-alert alert-${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {icon && (
        <div className="alert-icon">
          {getIcon()}
        </div>
      )}
      
      <div className="alert-message">
        {message}
      </div>
      
      {onClose && (
        <button
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

/**
 * Component for accessible loading indicator
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible loading component
 */
export const AccessibleLoading: React.FC<{
  isLoading: boolean;
  loadingText?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  type?: 'spinner' | 'dots' | 'progress';
}> = ({
  isLoading,
  loadingText = 'Loading...',
  size = 'medium',
  fullScreen = false,
  type = 'spinner'
}) => {
  if (!isLoading) return null;

  const renderLoadingIndicator = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-indicator"></div>
            </div>
          </div>
        );
      
      case 'spinner':
      default:
        return (
          <div className="loading-spinner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div
      className={`accessible-loading size-${size} ${fullScreen ? 'full-screen' : ''}`}
      role="status"
      aria-live="polite"
    >
      {renderLoadingIndicator()}
      <div className="loading-text">{loadingText}</div>
    </div>
  );
};

/**
 * Component for accessible audio player
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible audio player component
 */
export const AccessibleAudioPlayer: React.FC<{
  src: string;
  title: string;
  artist?: string;
  showTranscript?: boolean;
  transcriptText?: string;
}> = ({
  src,
  title,
  artist,
  showTranscript = false,
  transcriptText
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTranscriptContent, setShowTranscriptContent] = useState(false);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const playerId = React.useId();

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="accessible-audio-player">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="player-header">
        <div className="audio-info">
          <div className="audio-title" id={`${playerId}-title`}>{title}</div>
          {artist && <div className="audio-artist">{artist}</div>}
        </div>
      </div>
      
      <div className="player-controls">
        <button
          className="play-button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        
        <div className="time-display current-time" aria-hidden="true">
          {formatTime(currentTime)}
        </div>
        
        <div className="seek-container">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="seek-slider"
            aria-label="Seek"
            aria-valuemin="0"
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration || 0)}`}
          />
        </div>
        
        <div className="time-display duration" aria-hidden="true">
          {formatTime(duration || 0)}
        </div>
        
        <div className="volume-container">
          <button
            className="volume-button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !audioRef.current.muted;
              }
            }}
            aria-label={audioRef.current?.muted ? 'Unmute' : 'Mute'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Volume"
            aria-valuemin="0"
            aria-valuemax="1"
            aria-valuenow={volume}
            aria-valuetext={`Volume ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
      
      {showTranscript && transcriptText && (
        <div className="transcript-container">
          <button
            className="transcript-toggle"
            onClick={() => setShowTranscriptContent(!showTranscriptContent)}
            aria-expanded={showTranscriptContent}
            aria-controls={`${playerId}-transcript`}
          >
            {showTranscriptContent ? 'Hide Transcript' : 'Show Transcript'}
          </button>
          
          {showTranscriptContent && (
            <div
              id={`${playerId}-transcript`}
              className="transcript-content"
            >
              {transcriptText}
            </div>
          )}
        </div>
      )}
      
      <div className="sr-only" aria-live="polite">
        {isPlaying
          ? `Playing ${title}${artist ? ` by ${artist}` : ''}, ${formatTime(currentTime)} of ${formatTime(duration || 0)}`
          : `Paused ${title}${artist ? ` by ${artist}` : ''}, ${formatTime(currentTime)} of ${formatTime(duration || 0)}`}
      </div>
    </div>
  );
};

/**
 * Component for accessible video player
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible video player component
 */
export const AccessibleVideoPlayer: React.FC<{
  src: string;
  title: string;
  poster?: string;
  captions?: string;
  showTranscript?: boolean;
  transcriptText?: string;
  width?: number;
  height?: number;
}> = ({
  src,
  title,
  poster,
  captions,
  showTranscript = false,
  transcriptText,
  width = 640,
  height = 360
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showTranscriptContent, setShowTranscriptContent] = useState(false);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerId = React.useId();

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Fullscreen event listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className={`accessible-video-player ${isFullscreen ? 'fullscreen' : ''}`}
      ref={containerRef}
    >
      <div className="video-container">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          width={width}
          height={height}
          onClick={togglePlay}
          aria-label={title}
        >
          {captions && (
            <track
              kind="captions"
              src={captions}
              label="English"
              srcLang="en"
              default={showCaptions}
            />
          )}
        </video>
        
        <div className="video-controls">
          <button
            className="play-button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          
          <div className="time-display current-time" aria-hidden="true">
            {formatTime(currentTime)}
          </div>
          
          <div className="seek-container">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="seek-slider"
              aria-label="Seek"
              aria-valuemin="0"
              aria-valuemax={duration || 0}
              aria-valuenow={currentTime}
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration || 0)}`}
            />
          </div>
          
          <div className="time-display duration" aria-hidden="true">
            {formatTime(duration || 0)}
          </div>
          
          <div className="volume-container">
            <button
              className="volume-button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Volume"
              aria-valuemin="0"
              aria-valuemax="1"
              aria-valuenow={isMuted ? 0 : volume}
              aria-valuetext={`Volume ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>
          
          {captions && (
            <button
              className={`captions-button ${showCaptions ? 'active' : ''}`}
              onClick={() => {
                setShowCaptions(!showCaptions);
                if (videoRef.current) {
                  const track = videoRef.current.textTracks[0];
                  if (track) {
                    track.mode = !showCaptions ? 'showing' : 'hidden';
                  }
                }
              }}
              aria-label={showCaptions ? 'Hide Captions' : 'Show Captions'}
              aria-pressed={showCaptions}
            >
              CC
            </button>
          )}
          
          <button
            className="fullscreen-button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="video-title" id={`${playerId}-title`}>
        {title}
      </div>
      
      {showTranscript && transcriptText && (
        <div className="transcript-container">
          <button
            className="transcript-toggle"
            onClick={() => setShowTranscriptContent(!showTranscriptContent)}
            aria-expanded={showTranscriptContent}
            aria-controls={`${playerId}-transcript`}
          >
            {showTranscriptContent ? 'Hide Transcript' : 'Show Transcript'}
          </button>
          
          {showTranscriptContent && (
            <div
              id={`${playerId}-transcript`}
              className="transcript-content"
            >
              {transcriptText}
            </div>
          )}
        </div>
      )}
      
      <div className="sr-only" aria-live="polite">
        {isPlaying
          ? `Playing ${title}, ${formatTime(currentTime)} of ${formatTime(duration || 0)}`
          : `Paused ${title}, ${formatTime(currentTime)} of ${formatTime(duration || 0)}`}
      </div>
    </div>
  );
};
