'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/enhanced-theme-provider';

interface AchievementCardProps {
  title: string;
  description: string;
  iconSrc?: string;
  iconEmoji?: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedDate?: string;
  progress?: number;
  isLocked?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Enhanced Achievement Card Component
 * 
 * A visually engaging card component for achievements and badges that adapts
 * to different age groups with appropriate animations and visual styles.
 */
const EnhancedAchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  iconSrc,
  iconEmoji,
  level = 'bronze',
  earnedDate,
  progress = 0,
  isLocked = false,
  onClick,
  className = '',
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get age-appropriate styling
  const getAgeSpecificStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          cardClass: 'nursery-card rounded-3xl',
          titleClass: 'text-xl font-bold',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -8, 
              rotate: 2,
              scale: 1.05,
              transition: { duration: 0.3, type: 'spring', stiffness: 300 }
            }
          },
          iconSize: 'w-20 h-20'
        };
      case 'early-primary':
        return {
          cardClass: 'early-primary-card rounded-2xl',
          titleClass: 'text-lg font-bold',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -6, 
              scale: 1.03,
              transition: { duration: 0.3, type: 'spring', stiffness: 300 }
            }
          },
          iconSize: 'w-16 h-16'
        };
      case 'late-primary':
        return {
          cardClass: 'late-primary-card rounded-xl',
          titleClass: 'text-base font-semibold',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -4, 
              scale: 1.02,
              transition: { duration: 0.2, type: 'spring', stiffness: 400 }
            }
          },
          iconSize: 'w-14 h-14'
        };
      default: // secondary and professional
        return {
          cardClass: 'secondary-card rounded-lg',
          titleClass: 'text-base font-medium',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -2, 
              transition: { duration: 0.2 }
            }
          },
          iconSize: 'w-12 h-12'
        };
    }
  };
  
  // Get level-specific styling
  const getLevelStyles = () => {
    const levelMap = {
      'bronze': {
        bgGradient: 'from-amber-700/20 to-amber-600/10',
        borderColor: 'border-amber-700/30',
        iconBg: 'bg-gradient-to-br from-amber-700 to-amber-500',
        shadow: 'shadow-amber-700/20'
      },
      'silver': {
        bgGradient: 'from-slate-400/20 to-slate-300/10',
        borderColor: 'border-slate-400/30',
        iconBg: 'bg-gradient-to-br from-slate-500 to-slate-300',
        shadow: 'shadow-slate-400/20'
      },
      'gold': {
        bgGradient: 'from-amber-500/20 to-yellow-400/10',
        borderColor: 'border-amber-500/30',
        iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-400',
        shadow: 'shadow-amber-500/20'
      },
      'platinum': {
        bgGradient: 'from-indigo-600/20 to-purple-500/10',
        borderColor: 'border-indigo-600/30',
        iconBg: 'bg-gradient-to-br from-indigo-600 to-purple-500',
        shadow: 'shadow-indigo-600/20'
      }
    };
    
    return levelMap[level];
  };
  
  // Get progress bar
  const getProgressBar = () => {
    if (isLocked || progress >= 100) return null;
    if (progress <= 0) return null;
    
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Get achievement icon
  const getAchievementIcon = () => {
    const levelStyles = getLevelStyles();
    const ageStyles = getAgeSpecificStyles();
    
    if (isLocked) {
      return (
        <div className={`${ageStyles.iconSize} rounded-full flex items-centre justify-centre bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    if (iconSrc) {
      return (
        <div className={`${ageStyles.iconSize} relative rounded-full ${levelStyles.iconBg} ${levelStyles.shadow} p-0.5`}>
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse-subtle"></div>
          </div>
          <div className="relative rounded-full overflow-hidden w-full h-full bg-white">
            <Image
              src={iconSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100px, 150px"
              className="object-cover"
            />
          </div>
        </div>
      );
    }
    
    if (iconEmoji) {
      return (
        <div className={`${ageStyles.iconSize} rounded-full ${levelStyles.iconBg} ${levelStyles.shadow} flex items-centre justify-centre text-white text-3xl`}>
          {iconEmoji}
        </div>
      );
    }
    
    // Default icon if none provided
    return (
      <div className={`${ageStyles.iconSize} rounded-full ${levelStyles.iconBg} ${levelStyles.shadow} flex items-centre justify-centre text-white`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };
  
  const ageStyles = getAgeSpecificStyles();
  const levelStyles = getLevelStyles();
  
  return (
    <motion.div
      className={`${ageStyles.cardClass} ${className} overflow-hidden border-2 ${levelStyles.borderColor} bg-gradient-to-br ${levelStyles.bgGradient} ${isLocked ? 'opacity-70' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...ageStyles.animation}
    >
      <div className="flex flex-col items-centre text-centre p-4">
        {getAchievementIcon()}
        
        <h3 className={`${ageStyles.titleClass} mt-3 ${isLocked ? 'text-neutral-500' : ''}`}>
          {title}
        </h3>
        
        <p className={`mt-2 text-sm ${isLocked ? 'text-neutral-500' : 'text-neutral-600 dark:text-neutral-300'}`}>
          {description}
        </p>
        
        {earnedDate && !isLocked && (
          <div className="mt-3 text-xs text-neutral-500 flex items-centre">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0117.25 2.25c.41 0 .75.334.75.75V4.5h.75A2.25 2.25 0 0121 6.75v2.25h-2.25V6.75a.75.75 0 00-.75-.75H5.25a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h12a.75.75 0 00.75-.75V16.5h2.25v2.25A2.25 2.25 0 0118 21H5.25a2.25 2.25 0 01-2.25-2.25v-12A2.25 2.25 0 015.25 4.5H6v-1.5a.75.75 0 01.75-.75zm10.5 6.75a.75.75 0 01.75.75v5.25l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V9.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Earned {earnedDate}
          </div>
        )}
        
        {getProgressBar()}
        
        {isLocked && (
          <div className="mt-3 text-xs text-neutral-500 flex items-centre">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
            Locked
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedAchievementCard;
