import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff, Settings, Check, RefreshCw, Save, Monitor, Smartphone, Moon, Sun, Type, Minus, Plus, Sliders } from 'lucide-react';

/**
 * Accessibility Settings Panel component for EdPsych Connect
 * Provides comprehensive accessibility options for users with different needs
 */
const AccessibilitySettingsPanel = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Text and Display
    fontSize: 'medium', // small, medium, large, x-large
    fontFamily: 'default', // default, dyslexic, sans-serif, serif
    lineSpacing: 'normal', // tight, normal, wide, very-wide
    letterSpacing: 'normal', // tight, normal, wide
    contrast: 'default', // default, high-contrast, inverted, dark, light
    reduceMotion: false,
    
    // Reading Aids
    readingGuide: false,
    readingGuideColor: '#ffff00',
    readingGuideSize: 'medium', // small, medium, large
    highlightLinks: false,
    
    // Input and Navigation
    keyboardNavigation: false,
    autoComplete: true,
    voiceInput: false,
    
    // Media
    autoplayMedia: true,
    showCaptions: false,
    
    // Notifications
    reduceNotifications: false,
    
    // Saved Profiles
    activeProfile: 'default',
    profiles: [
      { id: 'default', name: 'Default Settings' }
    ]
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Failed to parse saved accessibility settings:', error);
      }
    }
  }, []);
  
  // Apply settings to document when they change
  useEffect(() => {
    // Apply font size
    const fontSizeMap = {
      'small': '0.875rem',
      'medium': '1rem',
      'large': '1.125rem',
      'x-large': '1.25rem'
    };
    document.documentElement.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize] || '1rem');
    
    // Apply font family
    const fontFamilyMap = {
      'default': 'var(--font-sans)',
      'dyslexic': '"OpenDyslexic", var(--font-sans)',
      'sans-serif': 'Arial, Helvetica, sans-serif',
      'serif': 'Georgia, "Times New Roman", serif'
    };
    document.documentElement.style.setProperty('--font-family', fontFamilyMap[settings.fontFamily] || 'var(--font-sans)');
    
    // Apply line spacing
    const lineSpacingMap = {
      'tight': '1.2',
      'normal': '1.5',
      'wide': '1.8',
      'very-wide': '2.2'
    };
    document.documentElement.style.setProperty('--line-height', lineSpacingMap[settings.lineSpacing] || '1.5');
    
    // Apply letter spacing
    const letterSpacingMap = {
      'tight': 'normal',
      'normal': '0.025em',
      'wide': '0.05em'
    };
    document.documentElement.style.setProperty('--letter-spacing', letterSpacingMap[settings.letterSpacing] || 'normal');
    
    // Apply contrast settings
    if (settings.contrast === 'high-contrast') {
      document.documentElement.classList.add('high-contrast');
      document.documentElement.classList.remove('inverted', 'dark-mode', 'light-mode');
    } else if (settings.contrast === 'inverted') {
      document.documentElement.classList.add('inverted');
      document.documentElement.classList.remove('high-contrast', 'dark-mode', 'light-mode');
    } else if (settings.contrast === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('high-contrast', 'inverted', 'light-mode');
    } else if (settings.contrast === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('high-contrast', 'inverted', 'dark-mode');
    } else {
      document.documentElement.classList.remove('high-contrast', 'inverted', 'dark-mode', 'light-mode');
    }
    
    // Apply reduced motion
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Apply reading guide
    if (settings.readingGuide) {
      enableReadingGuide(settings.readingGuideColor, settings.readingGuideSize);
    } else {
      disableReadingGuide();
    }
    
    // Apply link highlighting
    if (settings.highlightLinks) {
      document.documentElement.classList.add('highlight-links');
    } else {
      document.documentElement.classList.remove('highlight-links');
    }
    
    // Apply keyboard navigation
    if (settings.keyboardNavigation) {
      document.documentElement.classList.add('keyboard-navigation');
    } else {
      document.documentElement.classList.remove('keyboard-navigation');
    }
    
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);
  
  // Toggle panel visibility
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Reset settings to default
  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'medium',
      fontFamily: 'default',
      lineSpacing: 'normal',
      letterSpacing: 'normal',
      contrast: 'default',
      reduceMotion: false,
      readingGuide: false,
      readingGuideColor: '#ffff00',
      readingGuideSize: 'medium',
      highlightLinks: false,
      keyboardNavigation: false,
      autoComplete: true,
      voiceInput: false,
      autoplayMedia: true,
      showCaptions: false,
      reduceNotifications: false,
      activeProfile: 'default'
    };
    
    setSettings(prev => ({
      ...defaultSettings,
      profiles: prev.profiles
    }));
  };
  
  // Save current settings as a new profile
  const saveAsProfile = () => {
    const profileName = prompt('Enter a name for this accessibility profile:');
    if (!profileName) return;
    
    const profileId = `profile-${Date.now()}`;
    const newProfile = {
      id: profileId,
      name: profileName
    };
    
    const currentSettings = { ...settings };
    delete currentSettings.profiles;
    delete currentSettings.activeProfile;
    
    localStorage.setItem(`accessibility-profile-${profileId}`, JSON.stringify(currentSettings));
    
    setSettings(prev => ({
      ...prev,
      activeProfile: profileId,
      profiles: [...prev.profiles, newProfile]
    }));
  };
  
  // Load a saved profile
  const loadProfile = (profileId) => {
    if (profileId === 'default') {
      resetSettings();
      return;
    }
    
    const savedProfile = localStorage.getItem(`accessibility-profile-${profileId}`);
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setSettings(prev => ({
          ...prev,
          ...parsedProfile,
          activeProfile: profileId
        }));
      } catch (error) {
        console.error('Failed to load accessibility profile:', error);
      }
    }
  };
  
  // Delete a saved profile
  const deleteProfile = (profileId) => {
    if (profileId === 'default') return;
    
    const confirmDelete = confirm('Are you sure you want to delete this accessibility profile?');
    if (!confirmDelete) return;
    
    localStorage.removeItem(`accessibility-profile-${profileId}`);
    
    setSettings(prev => ({
      ...prev,
      activeProfile: 'default',
      profiles: prev.profiles.filter(profile => profile.id !== profileId)
    }));
  };
  
  // Enable reading guide
  const enableReadingGuide = (color, size) => {
    // Remove any existing reading guide
    disableReadingGuide();
    
    // Create reading guide element
    const readingGuide = document.createElement('div');
    readingGuide.id = 'reading-guide';
    readingGuide.style.position = 'fixed';
    readingGuide.style.backgroundColor = color;
    readingGuide.style.opacity = '0.2';
    readingGuide.style.pointerEvents = 'none';
    readingGuide.style.zIndex = '9999';
    readingGuide.style.transition = 'transform 0.05s ease';
    
    // Set size based on preference
    const sizeMap = {
      'small': '24px',
      'medium': '32px',
      'large': '48px'
    };
    readingGuide.style.height = sizeMap[size] || '32px';
    readingGuide.style.left = '0';
    readingGuide.style.right = '0';
    
    // Add to document
    document.body.appendChild(readingGuide);
    
    // Add mouse move event listener
    document.addEventListener('mousemove', updateReadingGuidePosition);
  };
  
  // Update reading guide position
  const updateReadingGuidePosition = (e) => {
    const readingGuide = document.getElementById('reading-guide');
    if (readingGuide) {
      const height = readingGuide.offsetHeight;
      readingGuide.style.transform = `translateY(${e.clientY - height / 2}px)`;
    }
  };
  
  // Disable reading guide
  const disableReadingGuide = () => {
    const existingGuide = document.getElementById('reading-guide');
    if (existingGuide) {
      existingGuide.remove();
    }
    document.removeEventListener('mousemove', updateReadingGuidePosition);
  };
  
  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 left-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Accessibility Settings"
      >
        <Eye className="h-6 w-6" />
      </button>
      
      {/* Accessibility Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-neutral-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Accessibility Settings</h2>
            <button
              onClick={togglePanel}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close accessibility panel"
            >
              <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Settings Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Profiles Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Saved Profiles</h3>
              <div className="flex items-center space-x-2 mb-2">
                <select
                  value={settings.activeProfile}
                  onChange={(e) => loadProfile(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white text-sm"
                >
                  {settings.profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={saveAsProfile}
                  className="p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  aria-label="Save as new profile"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteProfile(settings.activeProfile)}
                  disabled={settings.activeProfile === 'default'}
                  className={`p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    settings.activeProfile === 'default' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Delete current profile"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Text and Display Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Text and Display</h3>
              
              {/* Font Size */}
              <div className="mb-4">
                <label htmlFor="fontSize" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                  Font Size
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      const sizes = ['small', 'medium', 'large', 'x-large'];
                      const currentIndex = sizes.indexOf(settings.fontSize);
                      const newIndex = Math.max(0, currentIndex - 1);
                      updateSetting('fontSize', sizes[newIndex]);
                    }}
                    disabled={settings.fontSize === 'small'}
                    className={`p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600 ${
                      settings.fontSize === 'small' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Decrease font size"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <select
                    id="fontSize"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', e.target.value)}
                    className="flex-1 px-3 py-2 border-y border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white text-sm"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                  </select>
                  <button
                    onClick={() => {
                      const sizes = ['small', 'medium', 'large', 'x-large'];
                      const currentIndex = sizes.indexOf(settings.fontSize);
                      const newIndex = Math.min(sizes.length - 1, currentIndex + 1);
                      updateSetting('fontSize', sizes[newIndex]);
                    }}
                    disabled={settings.fontSize === 'x-large'}
                    className={`p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600 ${
                      settings.fontSize === 'x-large' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Increase font size"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Font Family */}
              <div className="mb-4">
                <label htmlFor="fontFamily" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                  Font Type
                </label>
                <select
                  id="fontFamily"
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white text-sm"
                >
                  <option value="default">Default</option>
                  <option value="dyslexic">OpenDyslexic</option>
                  <option value="sans-serif">Sans-serif</option>
                  <option value="serif">Serif</option>
                </select>
              </div>
              
              {/* Line Spacing */}
              <div className="mb-4">
                <label htmlFor="lineSpacing" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                  Line Spacing
                </label>
                <select
                  id="lineSpacing"
                  value={settings.lineSpacing}
                  onChange={(e) => updateSetting('lineSpacing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white text-sm"
                >
                  <option value="tight">Tight</option>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                  <option value="very-wide">Very Wide</option>
                </select>
              </div>
              
              {/* Letter Spacing */}
              <div className="mb-4">
                <label htmlFor="letterSpacing" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                  Letter Spacing
                </label>
                <select
                  id="letterSpacing"
                  value={settings.letterSpacing}
                  onChange={(e) => updateSetting('letterSpacing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white text-sm"
                >
                  <option value="tight">Tight</option>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                </select>
              </div>
              
              {/* Contrast */}
              <div className="mb-4">
                <label htmlFor="contrast" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                  Contrast
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateSetting('contrast', 'default')}
                    className={`p-2 flex flex-col items-center justify-center rounded-md ${
                      settings.contrast === 'default'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Default contrast"
                  >
                    <Monitor className="h-4 w-4 mb-1" />
                    <span className="text-xs">Default</span>
                  </button>
                  <button
                    onClick={() => updateSetting('contrast', 'high-contrast')}
                    className={`p-2 flex flex-col items-center justify-center rounded-md ${
                      settings.contrast === 'high-contrast'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="High contrast"
                  >
                    <Sliders className="h-4 w-4 mb-1" />
                    <span className="text-xs">High</span>
                  </button>
                  <button
                    onClick={() => updateSetting('contrast', 'inverted')}
                    className={`p-2 flex flex-col items-center justify-center rounded-md ${
                      settings.contrast === 'inverted'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Inverted colors"
                  >
                    <RefreshCw className="h-4 w-4 mb-1" />
                    <span className="text-xs">Inverted</span>
                  </button>
                  <button
                    onClick={() => updateSetting('contrast', 'dark')}
                    className={`p-2 flex flex-col items-center justify-center rounded-md ${
                      settings.contrast === 'dark'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Dark mode"
                  >
                    <Moon className="h-4 w-4 mb-1" />
                    <span className="text-xs">Dark</span>
                  </button>
                  <button
                    onClick={() => updateSetting('contrast', 'light')}
                    className={`p-2 flex flex-col items-center justify-center rounded-md ${
                      settings.contrast === 'light'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Light mode"
                  >
                    <Sun className="h-4 w-4 mb-1" />
                    <span className="text-xs">Light</span>
                  </button>
                </div>
              </div>
              
              {/* Reduce Motion */}
              <div className="flex items-center">
                <input
                  id="reduceMotion"
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="reduceMotion" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Reduce animations and motion
                </label>
              </div>
            </div>
            
            {/* Reading Aids Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Reading Aids</h3>
              
              {/* Reading Guide */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    id="readingGuide"
                    type="checkbox"
                    checked={settings.readingGuide}
                    onChange={(e) => updateSetting('readingGuide', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                  />
                  <label htmlFor="readingGuide" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Reading Guide
                  </label>
                </div>
                
                {settings.readingGuide && (
                  <div className="pl-6 space-y-2">
                    <div>
                      <label htmlFor="readingGuideColor" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                        Guide Color
                      </label>
                      <input
                        id="readingGuideColor"
                        type="color"
                        value={settings.readingGuideColor}
                        onChange={(e) => updateSetting('readingGuideColor', e.target.value)}
                        className="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="readingGuideSize" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                        Guide Size
                      </label>
                      <select
                        id="readingGuideSize"
                        value={settings.readingGuideSize}
                        onChange={(e) => updateSetting('readingGuideSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white text-sm"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Highlight Links */}
              <div className="flex items-center">
                <input
                  id="highlightLinks"
                  type="checkbox"
                  checked={settings.highlightLinks}
                  onChange={(e) => updateSetting('highlightLinks', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="highlightLinks" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Highlight links and buttons
                </label>
              </div>
            </div>
            
            {/* Input and Navigation Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Input and Navigation</h3>
              
              {/* Keyboard Navigation */}
              <div className="flex items-center mb-2">
                <input
                  id="keyboardNavigation"
                  type="checkbox"
                  checked={settings.keyboardNavigation}
                  onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="keyboardNavigation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enhanced keyboard navigation
                </label>
              </div>
              
              {/* Auto Complete */}
              <div className="flex items-center mb-2">
                <input
                  id="autoComplete"
                  type="checkbox"
                  checked={settings.autoComplete}
                  onChange={(e) => updateSetting('autoComplete', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="autoComplete" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Form auto-completion
                </label>
              </div>
              
              {/* Voice Input */}
              <div className="flex items-center">
                <input
                  id="voiceInput"
                  type="checkbox"
                  checked={settings.voiceInput}
                  onChange={(e) => updateSetting('voiceInput', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="voiceInput" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable voice input
                </label>
              </div>
            </div>
            
            {/* Media Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Media</h3>
              
              {/* Autoplay Media */}
              <div className="flex items-center mb-2">
                <input
                  id="autoplayMedia"
                  type="checkbox"
                  checked={settings.autoplayMedia}
                  onChange={(e) => updateSetting('autoplayMedia', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="autoplayMedia" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Allow media autoplay
                </label>
              </div>
              
              {/* Show Captions */}
              <div className="flex items-center">
                <input
                  id="showCaptions"
                  type="checkbox"
                  checked={settings.showCaptions}
                  onChange={(e) => updateSetting('showCaptions', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="showCaptions" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Always show captions
                </label>
              </div>
            </div>
            
            {/* Notifications Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notifications</h3>
              
              {/* Reduce Notifications */}
              <div className="flex items-center">
                <input
                  id="reduceNotifications"
                  type="checkbox"
                  checked={settings.reduceNotifications}
                  onChange={(e) => updateSetting('reduceNotifications', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
                />
                <label htmlFor="reduceNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Reduce notifications
                </label>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetSettings}
              className="w-full px-4 py-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilitySettingsPanel;
