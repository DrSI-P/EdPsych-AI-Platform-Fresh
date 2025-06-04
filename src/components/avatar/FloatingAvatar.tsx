'use client';

// Floating Avatar Component for EdPsych Connect Platform
// Provides contextual guidance and support on every page

import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { useAvatar } from './AvatarProvider';
import AvatarVideoPlayer from './AvatarVideoPlayer';

interface FloatingAvatarProps {
  className?: string;
}

export const FloatingAvatar: React.FC<FloatingAvatarProps> = ({ className = '' }) => {
  const { 
    currentAvatar, 
    isAvatarVisible, 
    avatarPosition, 
    hideAvatar, 
    setAvatarPosition,
    getContextualScript 
  } = useAvatar();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentScript, setCurrentScript] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [userRole, setUserRole] = useState('student');

  // Get current context from URL
  useEffect(() => {
    const pathname = window.location.pathname;
    let context = 'default-help';
    
    if (pathname === '/' || pathname === '/home') context = 'homepage-intro';
    else if (pathname.includes('/dashboard')) context = 'dashboard';
    else if (pathname.includes('/accessibility')) context = 'accessibility';
    else if (pathname.includes('/assessment')) context = 'assessment';
    else if (pathname.includes('/curriculum')) context = 'curriculum-planning';
    else if (pathname.includes('/family')) context = 'family-engagement';
    else if (pathname.includes('/voice')) context = 'voice-input';
    else if (pathname.includes('/sen')) context = 'sen-support';
    else if (pathname.includes('/restorative')) context = 'restorative-justice';
    else if (pathname.includes('/cpd')) context = 'professional-development';
    
    const script = getContextualScript(context, userRole);
    setCurrentScript(script);
  }, [getContextualScript, userRole]);

  if (!isAvatarVisible) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const avatarInfo = {
    'dr-scott': {
      name: 'Dr. Scott I-Patrick',
      role: 'Educational Psychologist',
      color: 'blue',
      emoji: '👨‍⚕️'
    },
    'leila': {
      name: 'Leila',
      role: 'Student Guide',
      color: 'purple',
      emoji: '👩‍🎓'
    },
    'professor-maya': {
      name: 'Professor Maya',
      role: 'Educator Guide',
      color: 'green',
      emoji: '👩‍🏫'
    },
    'sarah': {
      name: 'Sarah',
      role: 'Parent Guide',
      color: 'pink',
      emoji: '👩‍👧‍👦'
    },
    'alex': {
      name: 'Alex',
      role: 'Accessibility Guide',
      color: 'orange',
      emoji: '🌟'
    },
    'maria': {
      name: 'Maria',
      role: 'Global Guide',
      color: 'teal',
      emoji: '🌍'
    },
    'jamal': {
      name: 'Jamal',
      role: 'Collaboration Guide',
      color: 'indigo',
      emoji: '🤝'
    }
  };

  const avatar = avatarInfo[currentAvatar as keyof typeof avatarInfo] || avatarInfo['dr-scott'];

  return (
    <div 
      className={`fixed z-50 ${positionClasses[avatarPosition]} ${className}`}
      role="dialog"
      aria-label={`${avatar.name} - ${avatar.role}`}
    >
      {/* Minimized State */}
      {isMinimized && (
        <div className="relative">
          <button
            onClick={() => setIsMinimized(false)}
            className={`w-16 h-16 bg-${avatar.color}-600 hover:bg-${avatar.color}-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-2xl`}
            aria-label={`Expand ${avatar.name}`}
          >
            {avatar.emoji}
          </button>
          
          {/* Notification Badge */}
          <div className={`absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse`}>
            !
          </div>
        </div>
      )}

      {/* Expanded State */}
      {!isMinimized && (
        <div className={`bg-white rounded-lg shadow-2xl border-2 border-${avatar.color}-200 ${isExpanded ? 'w-96 h-96' : 'w-80 h-auto'} transition-all duration-300`}>
          {/* Header */}
          <div className={`bg-${avatar.color}-600 text-white p-4 rounded-t-lg flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{avatar.emoji}</div>
              <div>
                <h3 className="font-semibold text-sm">{avatar.name}</h3>
                <p className="text-xs opacity-90">{avatar.role}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-white/20 rounded"
                aria-label={isExpanded ? 'Minimize video' : 'Expand video'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded"
                aria-label="Minimize avatar"
              >
                <MessageCircle size={16} />
              </button>
              
              <button
                onClick={hideAvatar}
                className="p-1 hover:bg-white/20 rounded"
                aria-label="Close avatar"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Avatar Video Player */}
            <div className="mb-4">
              <AvatarVideoPlayer
                avatarId={currentAvatar}
                videoScript={currentScript}
                context="help"
                userRole={userRole as any}
                autoPlay={false}
                showControls={true}
                responsive={true}
                className="w-full"
              />
            </div>

            {/* Transcript Toggle */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`text-sm px-3 py-1 rounded-full border border-${avatar.color}-300 text-${avatar.color}-700 hover:bg-${avatar.color}-50 transition-colors`}
              >
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </button>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Volume2 size={12} />
                <span>Audio available</span>
              </div>
            </div>

            {/* Transcript */}
            {showTranscript && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto">
                <p className="italic">{currentScript}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button 
                className={`px-3 py-1 text-xs bg-${avatar.color}-100 text-${avatar.color}-700 rounded-full hover:bg-${avatar.color}-200 transition-colors`}
                onClick={() => {
                  const helpScript = getContextualScript('getting-started', userRole);
                  setCurrentScript(helpScript);
                }}
              >
                Getting Started
              </button>
              
              <button 
                className={`px-3 py-1 text-xs bg-${avatar.color}-100 text-${avatar.color}-700 rounded-full hover:bg-${avatar.color}-200 transition-colors`}
                onClick={() => {
                  const securityScript = getContextualScript('security-overview', userRole);
                  setCurrentScript(securityScript);
                }}
              >
                Security Info
              </button>
              
              <button 
                className={`px-3 py-1 text-xs bg-${avatar.color}-100 text-${avatar.color}-700 rounded-full hover:bg-${avatar.color}-200 transition-colors`}
                onClick={() => {
                  const accessibilityScript = getContextualScript('accessibility', userRole);
                  setCurrentScript(accessibilityScript);
                }}
              >
                Accessibility
              </button>
            </div>

            {/* Position Controls */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Avatar Position:</p>
              <div className="grid grid-cols-3 gap-1">
                {(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'] as const).map((position) => (
                  <button
                    key={position}
                    onClick={() => setAvatarPosition(position)}
                    className={`p-1 text-xs rounded ${
                      avatarPosition === position 
                        ? `bg-${avatar.color}-600 text-white` 
                        : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                    }`}
                  >
                    {position.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      <div className="sr-only" aria-live="polite">
        {isAvatarVisible && `${avatar.name} is available to help. Current context: ${currentScript.substring(0, 100)}...`}
      </div>
    </div>
  );
};

export default FloatingAvatar;

