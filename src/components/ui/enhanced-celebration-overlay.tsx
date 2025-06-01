'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/enhanced-theme-provider';
import confetti from 'canvas-confetti';

interface CelebrationOverlayProps {
  show: boolean;
  onComplete?: () => void;
  message?: string;
  type?: 'achievement' | 'milestone' | 'completion' | 'correct-answer';
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

/**
 * Enhanced Celebration Overlay Component
 * 
 * A visually engaging celebration component that provides age-appropriate
 * feedback for achievements, milestones, and correct answers.
 */
const EnhancedCelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  show,
  onComplete,
  message = 'Well done!',
  type = 'achievement',
  duration = 4000,
  intensity = 'medium',
  children
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);
  
  // Set up confetti canvas
  useEffect(() => {
    if (confettiCanvasRef.current && show && !isReducedMotion) {
      confettiInstanceRef.current = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
    }
    
    return () => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
      }
    };
  }, [confettiCanvasRef, show, isReducedMotion]);
  
  // Handle visibility and trigger confetti
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      if (!isReducedMotion && confettiInstanceRef.current) {
        // Different confetti patterns based on intensity
        switch (intensity) {
          case 'low':
            confettiInstanceRef.current({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 }
            });
            break;
          case 'medium':
            confettiInstanceRef.current({
              particleCount: 100,
              spread: 90,
              origin: { y: 0.6 }
            });
            break;
          case 'high':
            const end = Date.now() + 1000;
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            
            (function frame() {
              confettiInstanceRef.current?.({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
              });
              
              confettiInstanceRef.current?.({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
              });
              
              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            }());
            break;
        }
      }
      
      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(onComplete, 500); // Allow exit animation to complete
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete, intensity, isReducedMotion]);
  
  // Get age-appropriate styling
  const getAgeSpecificStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          containerClass: 'nursery-celebration',
          messageClass: 'text-3xl font-bold',
          animation: {
            initial: { scale: 0.8, rotate: -5, opacity: 0 },
            animate: { scale: 1, rotate: 0, opacity: 1 },
            exit: { scale: 1.2, opacity: 0 },
            transition: { duration: 0.5, type: 'spring', bounce: 0.5 }
          }
        };
      case 'early-primary':
        return {
          containerClass: 'early-primary-celebration',
          messageClass: 'text-2xl font-bold',
          animation: {
            initial: { scale: 0.9, y: 20, opacity: 0 },
            animate: { scale: 1, y: 0, opacity: 1 },
            exit: { scale: 1.1, opacity: 0 },
            transition: { duration: 0.4, type: 'spring', bounce: 0.4 }
          }
        };
      case 'late-primary':
        return {
          containerClass: 'late-primary-celebration',
          messageClass: 'text-xl font-semibold',
          animation: {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 1.05, opacity: 0 },
            transition: { duration: 0.3, type: 'spring', bounce: 0.3 }
          }
        };
      default: // secondary and professional
        return {
          containerClass: 'secondary-celebration',
          messageClass: 'text-lg font-medium',
          animation: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }
          }
        };
    }
  };
  
  // Get type-specific styling
  const getTypeSpecificStyles = () => {
    switch (type) {
      case 'achievement':
        return {
          bgClass: 'bg-gradient-primary',
          iconClass: 'achievement-icon'
        };
      case 'milestone':
        return {
          bgClass: 'bg-gradient-warm',
          iconClass: 'milestone-icon'
        };
      case 'completion':
        return {
          bgClass: 'bg-gradient-cool',
          iconClass: 'completion-icon'
        };
      case 'correct-answer':
        return {
          bgClass: 'bg-success/10',
          iconClass: 'correct-answer-icon'
        };
      default:
        return {
          bgClass: 'bg-gradient-primary',
          iconClass: 'achievement-icon'
        };
    }
  };
  
  const ageStyles = getAgeSpecificStyles();
  const typeStyles = getTypeSpecificStyles();
  
  // Get celebration icon based on type and age group
  const getCelebrationIcon = () => {
    // Different icons for different celebration types and age groups
    if (ageGroup === 'nursery' || ageGroup === 'early-primary') {
      switch (type) {
        case 'achievement':
          return (
            <div className="text-6xl animate-bounce-subtle">
              🏆
            </div>
          );
        case 'milestone':
          return (
            <div className="text-6xl animate-pulse-subtle">
              🌟
            </div>
          );
        case 'completion':
          return (
            <div className="text-6xl animate-float">
              🎉
            </div>
          );
        case 'correct-answer':
          return (
            <div className="text-6xl animate-pop">
              ✅
            </div>
          );
      }
    } else {
      // More sophisticated icons for older students
      switch (type) {
        case 'achievement':
          return (
            <div className="achievement-badge w-16 h-16">
              <div className="achievement-badge-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
                  <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743-.356l1.918-.56a.75.75 0 00.523-.71v-5.57a.75.75 0 00-.522-.71l-1.919-.56a6.767 6.767 0 00-2.743-.356 6.753 6.753 0 00-2.483.472zm13.768 0v.858c1.035.148 2.059.33 3.071.543a.75.75 0 01.584.859 6.753 6.753 0 01-6.138 5.6 6.73 6.73 0 01-2.743-.356l-1.918-.56a.75.75 0 01-.523-.71v-5.57a.75.75 0 01.522-.71l1.919-.56a6.767 6.767 0 012.743-.356c.84 0 1.675.147 2.483.472z" clipRule="evenodd" />
                  <path d="M1.648 6.204a.75.75 0 01.804-.698 19.902 19.902 0 017.396 0 .75.75 0 11-.278 1.476 18.407 18.407 0 00-6.824 0 .75.75 0 01-.698-.804zM22.352 6.204a.75.75 0 00-.804-.698 19.902 19.902 0 00-7.396 0 .75.75 0 10.278 1.476 18.407 18.407 0 016.824 0 .75.75 0 00.698-.804z" />
                  <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.282 9.282 0 016.086 0l.415.103a.75.75 0 01.442.84l-.14.56a.75.75 0 01-.88.553l-.422-.105a7.775 7.775 0 00-5.086 0l-2.056.513a.75.75 0 01-.374 0L8.59 4.91a7.775 7.775 0 00-5.086 0l-.422.105a.75.75 0 01-.88-.553l-.14-.56a.75.75 0 01.442-.84l.415-.103a9.282 9.282 0 016.086 0l1.838.46v-.54a.75.75 0 01.75-.75zm-8.301 3.48a.75.75 0 00-.519.926c.25.965.691 1.862 1.292 2.646a.75.75 0 001.248-.832A6.653 6.653 0 014.625 6.25a.75.75 0 00-.926-.52zm16.602 0a.75.75 0 01.926.52c-.25.965-.691 1.862-1.292 2.646a.75.75 0 11-1.248-.832 6.653 6.653 0 00.926-2.646.75.75 0 01.519-.688zm-18.422 5.5a.75.75 0 00-.75.75v.79c0 .704.271 1.37.72 1.85a.75.75 0 001.035-1.086 1.25 1.25 0 01-.255-.764v-.79a.75.75 0 00-.75-.75zm18.75 0a.75.75 0 01.75.75v.79c0 .704-.271 1.37-.72 1.85a.75.75 0 11-1.035-1.086c.16-.16.255-.454.255-.764v-.79a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          );
        case 'milestone':
          return (
            <div className="achievement-badge w-16 h-16">
              <div className="achievement-badge-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-secondary-amber">
                  <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                  <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
                </svg>
              </div>
            </div>
          );
        case 'completion':
          return (
            <div className="achievement-badge w-16 h-16">
              <div className="achievement-badge-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary-teal">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          );
        case 'correct-answer':
          return (
            <div className="achievement-badge w-16 h-16">
              <div className="achievement-badge-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-success">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          );
      }
    }
  };
  
  // Create star burst effect for younger students
  const renderStarBursts = () => {
    if ((ageGroup === 'nursery' || ageGroup === 'early-primary') && !isReducedMotion) {
      return (
        <>
          <div className="star-burst" style={{ top: '20%', left: '20%', animationDelay: '0.2s' }}></div>
          <div className="star-burst" style={{ top: '70%', left: '30%', animationDelay: '0.5s' }}></div>
          <div className="star-burst" style={{ top: '30%', left: '80%', animationDelay: '0.7s' }}></div>
          <div className="star-burst" style={{ top: '80%', left: '70%', animationDelay: '1s' }}></div>
        </>
      );
    }
    return null;
  };
  
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`fixed inset-0 flex items-centre justify-centre z-50 ${isReducedMotion ? '' : 'overflow-hidden'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            
            <motion.div
              className={`relative z-10 rounded-xl p-6 shadow-lg max-w-md mx-4 ${typeStyles.bgClass} ${ageStyles.containerClass}`}
              {...(isReducedMotion ? {} : ageStyles.animation)}
            >
              <div className="flex flex-col items-centre text-centre">
                {getCelebrationIcon()}
                
                <motion.h2
                  className={`mt-4 ${ageStyles.messageClass} text-white`}
                  initial={isReducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={isReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {message}
                </motion.h2>
                
                {children && (
                  <motion.div
                    className="mt-4"
                    initial={isReducedMotion ? {} : { opacity: 0, y: 10 }}
                    animate={isReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {children}
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {renderStarBursts()}
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isReducedMotion && (
        <canvas
          ref={confettiCanvasRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ display: isVisible ? 'block' : 'none' }}
        />
      )}
    </>
  );
};

export default EnhancedCelebrationOverlay;
