import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import InteractiveAvatar from '@/components/heygen/interactive-avatar';

interface AvatarContextType {
  isVisible: boolean;
  isMinimized: boolean;
  currentRole: string;
  showAvatar: (role?: string) => void;
  hideAvatar: () => void;
  toggleMinimize: () => void;
  setRole: (role: string) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

interface AvatarProviderProps {
  children: ReactNode;
}

export const AvatarProvider: React.FC<AvatarProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentRole, setCurrentRole] = useState('student');

  const showAvatar = useCallback((role?: string) => {
    if (role) {
      setCurrentRole(role);
    }
    setIsVisible(true);
    setIsMinimized(false);
  }, []);

  const hideAvatar = useCallback(() => {
    setIsVisible(false);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const setRole = useCallback((role: string) => {
    setCurrentRole(role);
  }, []);

  const contextValue: AvatarContextType = {
    isVisible,
    isMinimized,
    currentRole,
    showAvatar,
    hideAvatar,
    toggleMinimize,
    setRole
  };

  return (
    <AvatarContext.Provider value={contextValue}>
      {children}
      {isVisible && (
        <InteractiveAvatar
          isMinimized={isMinimized}
          onToggleMinimize={toggleMinimize}
          onClose={hideAvatar}
          defaultRole={currentRole}
          showRoleSelector={true}
          className="z-50"
        />
      )}
    </AvatarContext.Provider>
  );
};

export const useAvatar = (): AvatarContextType => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};

// Avatar trigger button component for easy integration
interface AvatarTriggerProps {
  role?: string;
  variant?: 'default' | 'floating' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

export const AvatarTrigger: React.FC<AvatarTriggerProps> = ({
  role = 'student',
  variant = 'default',
  size = 'md',
  className = '',
  children
}) => {
  const { showAvatar } = useAvatar();

  const handleClick = () => {
    showAvatar(role);
  };

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 transform hover:scale-105";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg",
    floating: "bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 shadow-lg",
    inline: "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button onClick={handleClick} className={classes}>
      {children || (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Ask Dr. Scott
        </>
      )}
    </button>
  );
};

// Page-specific avatar integration component
interface PageAvatarIntegrationProps {
  pageName: string;
  userRole?: string;
  welcomeMessage?: string;
  quickQuestions?: string[];
  autoShow?: boolean;
}

export const PageAvatarIntegration: React.FC<PageAvatarIntegrationProps> = ({
  pageName,
  userRole = 'student',
  welcomeMessage,
  quickQuestions = [],
  autoShow = false
}) => {
  const { showAvatar, isVisible } = useAvatar();

  React.useEffect(() => {
    if (autoShow && !isVisible) {
      // Auto-show avatar after a delay for new page visits
      const timer = setTimeout(() => {
        showAvatar(userRole);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoShow, isVisible, showAvatar, userRole]);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">DS</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">Dr. Scott is here to help!</h4>
            <p className="text-gray-600 text-xs mt-1">
              {welcomeMessage || `Get personalized guidance for ${pageName}`}
            </p>
            <AvatarTrigger 
              role={userRole} 
              variant="inline" 
              size="sm" 
              className="mt-2"
            >
              Start Conversation
            </AvatarTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarProvider;

