'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/enhanced-theme-provider';

interface FeedbackMessageProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  showIcon?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Enhanced Feedback Message Component
 * 
 * A visually polished feedback message component that adapts to different
 * age groups and provides appropriate visual cues for different message types.
 */
const EnhancedFeedbackMessage: React.FC<FeedbackMessageProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  showIcon = true,
  showCloseButton = true,
  className = '',
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-hide after duration if positive number provided
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300); // Allow exit animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300); // Allow exit animation to complete
  };
  
  // Get age-appropriate styling
  const getAgeSpecificStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          containerClass: 'rounded-2xl border-3 p-4',
          animation: {
            initial: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.95 },
            animate: isReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 },
            exit: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 },
            transition: { duration: 0.3, type: 'spring', bounce: 0.3 }
          },
          fontSize: 'text-lg',
          iconSize: 'w-8 h-8'
        };
      case 'early-primary':
        return {
          containerClass: 'rounded-xl border-2 p-3.5',
          animation: {
            initial: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -15, scale: 0.97 },
            animate: isReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 },
            exit: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 },
            transition: { duration: 0.25, type: 'spring', bounce: 0.2 }
          },
          fontSize: 'text-base',
          iconSize: 'w-6 h-6'
        };
      case 'late-primary':
        return {
          containerClass: 'rounded-lg border p-3',
          animation: {
            initial: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 },
            animate: isReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
            exit: isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 },
            transition: { duration: 0.2 }
          },
          fontSize: 'text-sm',
          iconSize: 'w-5 h-5'
        };
      default: // secondary and professional
        return {
          containerClass: 'rounded-md border p-2.5',
          animation: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.15 }
          },
          fontSize: 'text-sm',
          iconSize: 'w-4 h-4'
        };
    }
  };
  
  // Get type-specific styling
  const getTypeSpecificStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgClass: 'bg-success/10 border-success/20',
          iconColor: 'text-success',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'error':
        return {
          bgClass: 'bg-error/10 border-error/20',
          iconColor: 'text-error',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'warning':
        return {
          bgClass: 'bg-warning/10 border-warning/20',
          iconColor: 'text-warning',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'info':
      default:
        return {
          bgClass: 'bg-info/10 border-info/20',
          iconColor: 'text-info',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };
  
  const ageStyles = getAgeSpecificStyles();
  const typeStyles = getTypeSpecificStyles();
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      className={`${ageStyles.containerClass} ${typeStyles.bgClass} ${className} flex items-start gap-3 shadow-sm`}
      initial={ageStyles.animation.initial}
      animate={ageStyles.animation.animate}
      exit={ageStyles.animation.exit}
      transition={ageStyles.animation.transition}
    >
      {showIcon && (
        <div className={`${typeStyles.iconColor} flex-shrink-0 ${ageStyles.iconSize}`}>
          {typeStyles.icon}
        </div>
      )}
      
      <div className={`flex-grow ${ageStyles.fontSize}`}>
        {message}
      </div>
      
      {showCloseButton && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 transition-colors"
          aria-label="Close message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

export default EnhancedFeedbackMessage;
