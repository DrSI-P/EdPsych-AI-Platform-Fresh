import React, { useState, useEffect } from 'react';

interface AvatarProps {
  avatarId: string;
  style?: React.CSSProperties;
  className?: string;
  speaking?: boolean;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'concerned';
  size?: 'small' | 'medium' | 'large';
  ageGroup?: 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'standard';
}

const Avatar: React.FC<AvatarProps> = ({
  avatarId,
  style,
  className = '',
  speaking = false,
  emotion = 'neutral',
  size = 'medium',
  ageGroup = 'standard'
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarSize, setAvatarSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Set avatar size based on prop
  useEffect(() => {
    switch (size) {
      case 'small':
        setAvatarSize('w-24 h-24');
        break;
      case 'medium':
        setAvatarSize('w-48 h-48');
        break;
      case 'large':
        setAvatarSize('w-64 h-64');
        break;
      default:
        setAvatarSize('w-48 h-48');
    }
  }, [size]);

  // Load avatar image based on ID, emotion, and speaking state
  useEffect(() => {
    setIsLoading(true);
    
    // In a real implementation, this would be a dynamic path to avatar assets
    // For now, we'll use placeholder URLs
    const baseUrl = '/images/avatars/';
    const avatarFile = `${avatarId}_${emotion}${speaking ? '_speaking' : ''}.svg`;
    const fallbackFile = `default_${emotion}${speaking ? '_speaking' : ''}.svg`;
    
    // Simulate loading the avatar
    const timer = setTimeout(() => {
      // In a real implementation, we would check if the file exists
      // For now, we'll just set the URL
      setAvatarUrl(`${baseUrl}${avatarFile}`);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [avatarId, emotion, speaking]);

  // Render loading state
  if (isLoading) {
    return (
      <div className={`${avatarSize} bg-gray-200 rounded-full animate-pulse ${className}`} style={style}>
        <div className="flex items-center justify-center h-full">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`${avatarSize} bg-red-100 rounded-full flex items-center justify-center ${className}`} style={style}>
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    );
  }

  // Render avatar with appropriate styling based on age group
  let avatarStyle = {};
  switch (ageGroup) {
    case 'nursery':
      avatarStyle = {
        borderWidth: '4px',
        borderColor: '#d946ef', // Purple
        borderStyle: 'solid',
        borderRadius: '50%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      };
      break;
    case 'early-primary':
      avatarStyle = {
        borderWidth: '3px',
        borderColor: '#3b82f6', // Blue
        borderStyle: 'solid',
        borderRadius: '50%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      };
      break;
    case 'late-primary':
      avatarStyle = {
        borderWidth: '2px',
        borderColor: '#14b8a6', // Teal
        borderStyle: 'solid',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      };
      break;
    case 'secondary':
      avatarStyle = {
        borderWidth: '1px',
        borderColor: '#6366f1', // Indigo
        borderStyle: 'solid',
        borderRadius: '50%'
      };
      break;
    default:
      avatarStyle = {
        borderRadius: '50%'
      };
  }

  return (
    <div 
      className={`${avatarSize} relative overflow-hidden ${className} ${speaking ? 'animate-pulse' : ''}`} 
      style={{...avatarStyle, ...style}}
    >
      {/* This would be an actual avatar image in production */}
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
        {avatarId.charAt(0).toUpperCase()}
      </div>
      
      {/* Speaking indicator */}
      {speaking && (
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default Avatar;
