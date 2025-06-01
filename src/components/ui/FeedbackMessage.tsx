'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, AlertCircle, Info, HelpCircle } from 'lucide-react';

interface FeedbackMessageProps {
  type: 'success' | 'error' | 'info' | 'warning' | 'help';
  title: string;
  message: string;
  actions?: React.ReactNode;
  dismissable?: boolean;
  className?: string;
  animated?: boolean;
  onDismiss?: () => void;
}

/**
 * Feedback Message Component
 * 
 * A branded, age-appropriate feedback message component that adapts to
 * different message types and age groups.
 */
const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  title,
  message,
  actions,
  dismissable = true,
  className,
  animated = true,
  onDismiss
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Get age-appropriate styles
  const getMessageStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          container: 'rounded-3xl border-4 p-5',
          title: 'text-2xl font-bold mb-2',
          message: 'text-lg',
          icon: 'w-10 h-10'
        };
      case 'early-primary':
        return {
          container: 'rounded-2xl border-2 p-4',
          title: 'text-xl font-semibold mb-2',
          message: 'text-base',
          icon: 'w-8 h-8'
        };
      case 'late-primary':
        return {
          container: 'rounded-xl border p-3',
          title: 'text-lg font-medium mb-1.5',
          message: 'text-sm',
          icon: 'w-6 h-6'
        };
      case 'secondary':
      default:
        return {
          container: 'rounded-lg border p-3',
          title: 'text-base font-medium mb-1',
          message: 'text-sm',
          icon: 'w-5 h-5'
        };
    }
  };
  
  // Get type-specific styles
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950/30',
          border: 'border-green-200 dark:border-green-800',
          title: 'text-green-800 dark:text-green-300',
          message: 'text-green-700 dark:text-green-400',
          icon: 'text-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950/30',
          border: 'border-red-200 dark:border-red-800',
          title: 'text-red-800 dark:text-red-300',
          message: 'text-red-700 dark:text-red-400',
          icon: 'text-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-800',
          title: 'text-amber-800 dark:text-amber-300',
          message: 'text-amber-700 dark:text-amber-400',
          icon: 'text-amber-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-200 dark:border-blue-800',
          title: 'text-blue-800 dark:text-blue-300',
          message: 'text-blue-700 dark:text-blue-400',
          icon: 'text-blue-500'
        };
      case 'help':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/30',
          border: 'border-purple-200 dark:border-purple-800',
          title: 'text-purple-800 dark:text-purple-300',
          message: 'text-purple-700 dark:text-purple-400',
          icon: 'text-purple-500'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-200 dark:border-blue-800',
          title: 'text-blue-800 dark:text-blue-300',
          message: 'text-blue-700 dark:text-blue-400',
          icon: 'text-blue-500'
        };
    }
  };
  
  // Get type-specific icon
  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return <Check />;
      case 'error':
        return <AlertCircle />;
      case 'warning':
        return <AlertCircle />;
      case 'info':
        return <Info />;
      case 'help':
        return <HelpCircle />;
      default:
        return <Info />;
    }
  };
  
  const styles = getMessageStyles();
  const typeStyles = getTypeStyles();
  
  // Animation variants
  const messageAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  // Render card content
  const renderMessageContent = () => {
    return (
      <Card 
        className={cn(
          styles.container,
          typeStyles.bg,
          typeStyles.border,
          'shadow-sm',
          className
        )}
      >
        <CardContent className="p-0">
          <div className="flex">
            <div className={cn(
              'flex-shrink-0 flex items-start pt-1 mr-3',
              typeStyles.icon
            )}>
              {getTypeIcon()}
            </div>
            
            <div className="flex-grow">
              <h4 className={cn(
                styles.title,
                typeStyles.title
              )}>
                {title}
              </h4>
              
              <div className={cn(
                styles.message,
                typeStyles.message
              )}>
                {message}
              </div>
              
              {actions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {actions}
                </div>
              )}
            </div>
            
            {dismissable && onDismiss && (
              <div className="flex-shrink-0 ml-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={onDismiss}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render with animations if enabled
  if (animated && !isReducedMotion) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={messageAnimation}
      >
        {renderMessageContent()}
      </motion.div>
    );
  }
  
  // Render without animations
  return renderMessageContent();
};

export default FeedbackMessage;
