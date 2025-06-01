'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define key stage types
export type KeyStage = 'early_years' | 'ks1' | 'ks2' | 'ks3' | 'ks4' | 'adult';

// Define command categories
export type CommandCategory = 
  | 'navigation' 
  | 'content' 
  | 'interaction' 
  | 'accessibility' 
  | 'tools' 
  | 'help'
  | 'system';

// Define command structure
export type Command = {
  phrase: string;
  action: string;
  description: string;
  category: CommandCategory;
  keyStages: KeyStage[];
  alternatives?: string[];
};

// Define context type
type AgeAppropriateCommandsContextType = {
  keyStage: KeyStage;
  setKeyStage: (keyStage: KeyStage) => void;
  commands: Command[];
  getCommandsByCategory: (category: CommandCategory) => Command[];
  getAvailableCommands: () => Command[];
  findCommandByPhrase: (phrase: string) => Command | undefined;
  getSuggestions: (partialPhrase: string) => Command[];
};

// Create context
const AgeAppropriateCommandsContext = createContext<AgeAppropriateCommandsContextType | undefined>(undefined);

/**
 * Age-appropriate commands for different key stages
 * 
 * This comprehensive command library is organized by category and key stage,
 * ensuring that voice commands are appropriate for the user's age and educational level.
 */
export const ageAppropriateCommands: Command[] = [
  // Navigation Commands - Early Years
  {
    phrase: 'go home',
    action: 'navigate:/',
    description: 'Go to the home page',
    category: 'navigation',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['home', 'take me home']
  },
  {
    phrase: 'go back',
    action: 'navigate:back',
    description: 'Go to the previous page',
    category: 'navigation',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['back', 'previous page']
  },
  {
    phrase: 'show games',
    action: 'navigate:/games',
    description: 'Go to the games page',
    category: 'navigation',
    keyStages: ['early_years', 'ks1'],
    alternatives: ['games', 'play games']
  },
  {
    phrase: 'show stories',
    action: 'navigate:/stories',
    description: 'Go to the stories page',
    category: 'navigation',
    keyStages: ['early_years', 'ks1'],
    alternatives: ['stories', 'read stories']
  },
  
  // Navigation Commands - KS1 & KS2
  {
    phrase: 'my work',
    action: 'navigate:/my-work',
    description: 'Go to my work page',
    category: 'navigation',
    keyStages: ['ks1', 'ks2'],
    alternatives: ['show my work', 'go to my work']
  },
  {
    phrase: 'show menu',
    action: 'ui:showMenu',
    description: 'Show the main menu',
    category: 'navigation',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['menu', 'open menu']
  },
  {
    phrase: 'show subjects',
    action: 'navigate:/subjects',
    description: 'Go to the subjects page',
    category: 'navigation',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
    alternatives: ['subjects', 'school subjects']
  },
  
  // Navigation Commands - KS3 & KS4
  {
    phrase: 'my progress',
    action: 'navigate:/progress',
    description: 'Go to my progress page',
    category: 'navigation',
    keyStages: ['ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['show my progress', 'go to progress']
  },
  {
    phrase: 'my timetable',
    action: 'navigate:/timetable',
    description: 'Go to my timetable',
    category: 'navigation',
    keyStages: ['ks2', 'ks3', 'ks4'],
    alternatives: ['show timetable', 'schedule']
  },
  {
    phrase: 'my assignments',
    action: 'navigate:/assignments',
    description: 'Go to my assignments',
    category: 'navigation',
    keyStages: ['ks3', 'ks4'],
    alternatives: ['assignments', 'homework']
  },
  
  // Navigation Commands - Adult/Educator
  {
    phrase: 'my students',
    action: 'navigate:/students',
    description: 'Go to my students page',
    category: 'navigation',
    keyStages: ['adult'],
    alternatives: ['show students', 'student list']
  },
  {
    phrase: 'analytics',
    action: 'navigate:/analytics',
    description: 'Go to analytics page',
    category: 'navigation',
    keyStages: ['adult'],
    alternatives: ['show analytics', 'view data']
  },
  {
    phrase: 'curriculum',
    action: 'navigate:/curriculum',
    description: 'Go to curriculum page',
    category: 'navigation',
    keyStages: ['adult'],
    alternatives: ['show curriculum', 'view curriculum']
  },
  
  // Content Commands - Early Years
  {
    phrase: 'read to me',
    action: 'content:readAloud',
    description: 'Read the current content aloud',
    category: 'content',
    keyStages: ['early_years', 'ks1', 'ks2'],
    alternatives: ['read this', 'read page']
  },
  {
    phrase: 'play video',
    action: 'content:playVideo',
    description: 'Play the current video',
    category: 'content',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['start video', 'video play']
  },
  {
    phrase: 'stop video',
    action: 'content:stopVideo',
    description: 'Stop the current video',
    category: 'content',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['pause video', 'video stop']
  },
  
  // Content Commands - KS1 & KS2
  {
    phrase: 'next page',
    action: 'content:nextPage',
    description: 'Go to the next page of content',
    category: 'content',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['next', 'go next']
  },
  {
    phrase: 'previous page',
    action: 'content:previousPage',
    description: 'Go to the previous page of content',
    category: 'content',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['previous', 'go back']
  },
  {
    phrase: 'show dictionary',
    action: 'tools:openDictionary',
    description: 'Open the dictionary tool',
    category: 'tools',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
    alternatives: ['dictionary', 'define word']
  },
  
  // Content Commands - KS3 & KS4
  {
    phrase: 'summarize',
    action: 'content:summarize',
    description: 'Summarize the current content',
    category: 'content',
    keyStages: ['ks3', 'ks4', 'adult'],
    alternatives: ['give summary', 'show summary']
  },
  {
    phrase: 'show notes',
    action: 'content:showNotes',
    description: 'Show my notes for this content',
    category: 'content',
    keyStages: ['ks3', 'ks4', 'adult'],
    alternatives: ['my notes', 'open notes']
  },
  {
    phrase: 'add bookmark',
    action: 'content:addBookmark',
    description: 'Bookmark this page',
    category: 'content',
    keyStages: ['ks3', 'ks4', 'adult'],
    alternatives: ['bookmark', 'save page']
  },
  
  // Interaction Commands - Early Years
  {
    phrase: 'bigger',
    action: 'accessibility:increaseFontSize',
    description: 'Make the text bigger',
    category: 'accessibility',
    keyStages: ['early_years', 'ks1', 'ks2'],
    alternatives: ['make bigger', 'larger text']
  },
  {
    phrase: 'smaller',
    action: 'accessibility:decreaseFontSize',
    description: 'Make the text smaller',
    category: 'accessibility',
    keyStages: ['early_years', 'ks1', 'ks2'],
    alternatives: ['make smaller', 'smaller text']
  },
  {
    phrase: 'louder',
    action: 'accessibility:increaseVolume',
    description: 'Increase the volume',
    category: 'accessibility',
    keyStages: ['early_years', 'ks1', 'ks2'],
    alternatives: ['volume up', 'turn up']
  },
  
  // Interaction Commands - KS1 & KS2
  {
    phrase: 'submit answer',
    action: 'interaction:submitAnswer',
    description: 'Submit the current answer',
    category: 'interaction',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
    alternatives: ['submit', 'check answer']
  },
  {
    phrase: 'show hint',
    action: 'interaction:showHint',
    description: 'Show a hint for the current question',
    category: 'interaction',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
    alternatives: ['hint', 'give hint']
  },
  {
    phrase: 'try again',
    action: 'interaction:tryAgain',
    description: 'Try the current activity again',
    category: 'interaction',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
    alternatives: ['restart', 'start over']
  },
  
  // Interaction Commands - KS3 & KS4
  {
    phrase: 'save work',
    action: 'interaction:saveWork',
    description: 'Save the current work',
    category: 'interaction',
    keyStages: ['ks3', 'ks4', 'adult'],
    alternatives: ['save', 'save progress']
  },
  {
    phrase: 'show feedback',
    action: 'interaction:showFeedback',
    description: 'Show feedback for the current work',
    category: 'interaction',
    keyStages: ['ks3', 'ks4', 'adult'],
    alternatives: ['feedback', 'view feedback']
  },
  {
    phrase: 'share work',
    action: 'interaction:shareWork',
    description: 'Share the current work',
    category: 'interaction',
    keyStages: ['ks3', 'ks4', 'adult'],
    alternatives: ['share', 'send work']
  },
  
  // Help Commands - All Key Stages
  {
    phrase: 'help',
    action: 'help:showHelp',
    description: 'Show help information',
    category: 'help',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['need help', 'show help']
  },
  {
    phrase: 'what can I say',
    action: 'help:showCommands',
    description: 'Show available voice commands',
    category: 'help',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['show commands', 'voice commands']
  },
  {
    phrase: 'how does this work',
    action: 'help:showTutorial',
    description: 'Show tutorial for the current feature',
    category: 'help',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['tutorial', 'show tutorial']
  },
  
  // System Commands - All Key Stages
  {
    phrase: 'stop listening',
    action: 'system:stopListening',
    description: 'Stop voice recognition',
    category: 'system',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['stop', 'stop voice']
  },
  {
    phrase: 'start listening',
    action: 'system:startListening',
    description: 'Start voice recognition',
    category: 'system',
    keyStages: ['early_years', 'ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['listen', 'start voice']
  },
  {
    phrase: 'settings',
    action: 'navigate:/settings',
    description: 'Go to settings page',
    category: 'system',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4', 'adult'],
    alternatives: ['open settings', 'show settings']
  }
];

/**
 * Age-Appropriate Commands Provider
 * 
 * This provider manages age-appropriate voice commands for different key stages.
 * It allows components to access commands appropriate for the user's age and educational level.
 */
export function AgeAppropriateCommandsProvider({
  children,
  initialKeyStage = 'adult',
}: {
  children: ReactNode;
  initialKeyStage?: KeyStage;
}) {
  // State
  const [keyStage, setKeyStage] = useState<KeyStage>(initialKeyStage);
  const [commands, setCommands] = useState<Command[]>(ageAppropriateCommands);
  
  // Get commands by category
  const getCommandsByCategory = (category: CommandCategory): Command[] => {
    return commands.filter(command => 
      command.category === category && 
      command.keyStages.includes(keyStage)
    );
  };
  
  // Get available commands for current key stage
  const getAvailableCommands = (): Command[] => {
    return commands.filter(command => command.keyStages.includes(keyStage));
  };
  
  // Find command by phrase
  const findCommandByPhrase = (phrase: string): Command | undefined => {
    const lowerPhrase = phrase.toLowerCase().trim();
    
    // First, try to find an exact match
    const exactMatch = commands.find(command => 
      (command.phrase.toLowerCase() === lowerPhrase || 
       (command.alternatives && command.alternatives.some(alt => alt.toLowerCase() === lowerPhrase))) &&
      command.keyStages.includes(keyStage)
    );
    
    if (exactMatch) {
      return exactMatch;
    }
    
    // If no exact match, try to find a partial match
    return commands.find(command => {
      // Check if the phrase is contained in the command phrase
      if (command.phrase.toLowerCase().includes(lowerPhrase) && command.keyStages.includes(keyStage)) {
        return true;
      }
      
      // Check if the phrase is contained in any of the command alternatives
      if (command.alternatives && command.alternatives.some(alt => alt.toLowerCase().includes(lowerPhrase)) && 
          command.keyStages.includes(keyStage)) {
        return true;
      }
      
      return false;
    });
  };
  
  // Get command suggestions based on partial phrase
  const getSuggestions = (partialPhrase: string): Command[] => {
    if (!partialPhrase) {
      return [];
    }
    
    const lowerPartial = partialPhrase.toLowerCase().trim();
    
    return commands.filter(command => {
      // Only include commands for the current key stage
      if (!command.keyStages.includes(keyStage)) {
        return false;
      }
      
      // Check if the partial phrase is contained in the command phrase
      if (command.phrase.toLowerCase().includes(lowerPartial)) {
        return true;
      }
      
      // Check if the partial phrase is contained in any of the command alternatives
      if (command.alternatives && command.alternatives.some(alt => alt.toLowerCase().includes(lowerPartial))) {
        return true;
      }
      
      return false;
    }).slice(0, 5); // Limit to 5 suggestions
  };
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedKeyStage = localStorage.getItem('voiceCommandsKeyStage');
    if (storedKeyStage) {
      setKeyStage(storedKeyStage as KeyStage);
    }
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('voiceCommandsKeyStage', keyStage);
  }, [keyStage]);
  
  // Context value
  const value = {
    keyStage,
    setKeyStage: (newKeyStage: KeyStage) => {
      setKeyStage(newKeyStage);
      localStorage.setItem('voiceCommandsKeyStage', newKeyStage);
    },
    commands,
    getCommandsByCategory,
    getAvailableCommands,
    findCommandByPhrase,
    getSuggestions,
  };
  
  return (
    <AgeAppropriateCommandsContext.Provider value={value}>
      {children}
    </AgeAppropriateCommandsContext.Provider>
  );
}

/**
 * Hook to use age-appropriate commands
 * 
 * This hook provides access to age-appropriate voice commands for different key stages.
 */
export function useAgeAppropriateCommands() {
  const context = useContext(AgeAppropriateCommandsContext);
  
  if (context === undefined) {
    throw new Error('useAgeAppropriateCommands must be used within an AgeAppropriateCommandsProvider');
  }
  
  return context;
}
