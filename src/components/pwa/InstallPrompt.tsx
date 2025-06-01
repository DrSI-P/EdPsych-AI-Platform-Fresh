import React, { useEffect, useState } from 'react';

interface InstallPromptProps {
  className?: string;
}

export function InstallPrompt({ className = '' }: InstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isAppInstalled) {
      return; // Don't show install prompt if already installed
    }

    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if we should show the prompt (not shown in last 7 days)
    const lastPromptTime = localStorage.getItem('installPromptLastShown');
    if (lastPromptTime) {
      const daysSinceLastPrompt = (Date.now() - parseInt(lastPromptTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPrompt < 7) {
        setShowPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;
    
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPromptEvent.userChoice;
    
    // Reset the install prompt variable
    setInstallPromptEvent(null);
    setShowPrompt(false);
    
    // Record when we showed the prompt
    localStorage.setItem('installPromptLastShown', Date.now().toString());
    
    // Track the outcome
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Record when we showed the prompt
    localStorage.setItem('installPromptLastShown', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Install EdPsych Connect</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Install our app for offline access to educational resources and tools.
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Install
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
