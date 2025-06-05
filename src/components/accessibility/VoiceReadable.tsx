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

export function VoiceReadable({ 
  children, 
  text, 
  priority = 'medium',
  autoRead = false,
  className = ''
}: VoiceReadableProps) {
  const { isEnabled, readText } = useVoiceAccessibility();

  // Extract text content if not provided
  const getTextContent = (element: React.ReactNode): string => {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return element.toString();
    if (React.isValidElement(element)) {
      if (typeof element.props.children === 'string') {
        return element.props.children;
      }
      if (Array.isArray(element.props.children)) {
        return element.props.children
          .map((child: any) => getTextContent(child))
          .join(' ');
      }
    }
    return '';
  };

  const textToRead = text || getTextContent(children);

  useEffect(() => {
    if (autoRead && isEnabled && textToRead && priority === 'high') {
      // Auto-read high priority content when voice accessibility is enabled
      const timer = setTimeout(() => {
        readText(textToRead);
      }, 500); // Small delay to avoid conflicts
      
      return () => clearTimeout(timer);
    }
  }, [autoRead, isEnabled, textToRead, priority, readText]);

  const handleClick = () => {
    if (isEnabled && textToRead) {
      readText(textToRead);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEnabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (textToRead) {
        readText(textToRead);
      }
    }
  };

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <div
      className={`voice-readable cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Click to read: ${textToRead.substring(0, 100)}${textToRead.length > 100 ? '...' : ''}`}
      title="Click to read aloud"
    >
      {children}
    </div>
  );
}

// Specialized components for common use cases
export function VoiceReadableHeading({ 
  children, 
  level = 1,
  className = '' 
}: { 
  children: React.ReactNode; 
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <VoiceReadable priority="high" autoRead={level === 1} className={className}>
      <HeadingTag className="voice-readable-heading">
        {children}
      </HeadingTag>
    </VoiceReadable>
  );
}

export function VoiceReadableText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <VoiceReadable priority="medium" className={className}>
      <p className="voice-readable-text">
        {children}
      </p>
    </VoiceReadable>
  );
}

export function VoiceReadableButton({ 
  children, 
  onClick,
  className = '',
  ...props 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) {
  const { isEnabled, readText } = useVoiceAccessibility();

  const handleClick = () => {
    if (onClick) onClick();
    
    if (isEnabled) {
      const buttonText = typeof children === 'string' 
        ? children 
        : 'Button activated';
      readText(`${buttonText}. Button clicked.`);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`voice-readable-button ${className}`}
    >
      {children}
    </button>
  );
}

