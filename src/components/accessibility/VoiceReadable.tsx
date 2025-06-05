'use client';

import React, { useEffect } from 'react';
import { useVoiceAccessibility } from './VoiceAccessibilityProvider';

interface VoiceReadableProps {
  children: React.ReactNode;
  text?: string;
  priority?: 'high' | 'medium' | 'low';
  autoRead?: boolean;
  className?: string;
}

interface VoiceReadableHeadingProps extends VoiceReadableProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * VoiceReadable Component
 * 
 * A wrapper component that makes content accessible via text-to-speech.
 * Automatically reads content when voice accessibility is enabled.
 */
export const VoiceReadable: React.FC<VoiceReadableProps> = ({
  children,
  text,
  priority = 'medium',
  autoRead = false,
  className = ''
}) => {
  const { isEnabled, speak, isReading } = useVoiceAccessibility();

  useEffect(() => {
    if (isEnabled && autoRead && text) {
      speak(text, { priority });
    }
  }, [isEnabled, autoRead, text, priority, speak]);

  const handleClick = () => {
    if (isEnabled && text) {
      speak(text, { priority });
    }
  };

  return (
    <div 
      className={`voice-readable ${className} ${isEnabled ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors' : ''}`}
      onClick={handleClick}
      role={isEnabled ? 'button' : undefined}
      tabIndex={isEnabled ? 0 : undefined}
      aria-label={isEnabled ? `Click to read: ${text || 'content'}` : undefined}
      onKeyDown={(e) => {
        if (isEnabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
    </div>
  );
};

/**
 * VoiceReadableText Component
 * 
 * A text wrapper that makes text content accessible via text-to-speech.
 */
export const VoiceReadableText: React.FC<VoiceReadableProps> = ({
  children,
  text,
  priority = 'medium',
  autoRead = false,
  className = ''
}) => {
  const textContent = text || (typeof children === 'string' ? children : '');
  
  return (
    <VoiceReadable 
      text={textContent} 
      priority={priority} 
      autoRead={autoRead}
      className={className}
    >
      <p className={className}>{children}</p>
    </VoiceReadable>
  );
};

/**
 * VoiceReadableHeading Component
 * 
 * A heading wrapper that makes heading content accessible via text-to-speech.
 */
export const VoiceReadableHeading: React.FC<VoiceReadableHeadingProps> = ({
  children,
  text,
  level,
  priority = 'high',
  autoRead = false,
  className = ''
}) => {
  const textContent = text || (typeof children === 'string' ? children : '');
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <VoiceReadable 
      text={textContent} 
      priority={priority} 
      autoRead={autoRead}
      className={className}
    >
      <HeadingTag className={className}>{children}</HeadingTag>
    </VoiceReadable>
  );
};

/**
 * VoiceReadableButton Component
 * 
 * A button wrapper that makes button content accessible via text-to-speech.
 */
export const VoiceReadableButton: React.FC<VoiceReadableProps & { onClick?: () => void }> = ({
  children,
  text,
  priority = 'medium',
  autoRead = false,
  className = '',
  onClick
}) => {
  const textContent = text || (typeof children === 'string' ? children : '');
  
  return (
    <VoiceReadable 
      text={textContent} 
      priority={priority} 
      autoRead={autoRead}
      className={className}
    >
      <button className={className} onClick={onClick}>
        {children}
      </button>
    </VoiceReadable>
  );
};

/**
 * VoiceReadableList Component
 * 
 * A list wrapper that makes list content accessible via text-to-speech.
 */
export const VoiceReadableList: React.FC<VoiceReadableProps & { 
  items: string[];
  ordered?: boolean;
}> = ({
  items,
  ordered = false,
  priority = 'medium',
  autoRead = false,
  className = ''
}) => {
  const textContent = items.join(', ');
  const ListTag = ordered ? 'ol' : 'ul';
  
  return (
    <VoiceReadable 
      text={textContent} 
      priority={priority} 
      autoRead={autoRead}
      className={className}
    >
      <ListTag className={className}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ListTag>
    </VoiceReadable>
  );
};

