'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/enhanced-theme-provider';

interface LearningCardProps {
  title: string;
  description: string;
  imageSrc?: string;
  href: string;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  progress?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  isNew?: boolean;
  isRecommended?: boolean;
  isPopular?: boolean;
  className?: string;
}

/**
 * Enhanced Learning Card Component
 * 
 * A visually engaging card component for learning resources that adapts
 * to different age groups and learning styles.
 */
const EnhancedLearningCard: React.FC<LearningCardProps> = ({
  title,
  description,
  imageSrc,
  href,
  learningStyle,
  progress = 0,
  difficulty,
  estimatedTime,
  isNew = false,
  isRecommended = false,
  isPopular = false,
  className = '',
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  // Get age-appropriate styling
  const getAgeSpecificStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          cardClass: 'nursery-card',
          titleClass: 'text-2xl font-bold',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -10, 
              rotate: 2,
              scale: 1.05,
              transition: { duration: 0.3, type: 'spring', stiffness: 300 }
            }
          }
        };
      case 'early-primary':
        return {
          cardClass: 'early-primary-card',
          titleClass: 'text-xl font-bold',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -8, 
              scale: 1.03,
              transition: { duration: 0.3, type: 'spring', stiffness: 300 }
            }
          }
        };
      case 'late-primary':
        return {
          cardClass: 'late-primary-card',
          titleClass: 'text-lg font-semibold',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -5, 
              scale: 1.02,
              transition: { duration: 0.2, type: 'spring', stiffness: 400 }
            }
          }
        };
      default: // secondary and professional
        return {
          cardClass: 'secondary-card',
          titleClass: 'text-lg font-medium',
          animation: {
            whileHover: isReducedMotion ? {} : { 
              y: -3, 
              transition: { duration: 0.2 }
            }
          }
        };
    }
  };
  
  // Get learning style indicator
  const getLearningStyleIndicator = () => {
    if (!learningStyle) return null;
    
    const styleMap = {
      'visual': {
        className: 'visual-indicator',
        label: 'Visual',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          </svg>
        )
      },
      'auditory': {
        className: 'auditory-indicator',
        label: 'Auditory',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
        )
      },
      'kinesthetic': {
        className: 'kinesthetic-indicator',
        label: 'Kinesthetic',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
          </svg>
        )
      },
      'reading-writing': {
        className: 'reading-writing-indicator',
        label: 'Reading/Writing',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
          </svg>
        )
      }
    };
    
    const style = styleMap[learningStyle];
    
    return (
      <div className={`inline-flex items-centre text-xs font-medium px-2 py-1 rounded-full mb-2 ${style.className}`}>
        {style.icon}
        {style.label}
      </div>
    );
  };
  
  // Get difficulty badge
  const getDifficultyBadge = () => {
    if (!difficulty) return null;
    
    const difficultyMap = {
      'beginner': {
        className: 'badge badge-success',
        label: 'Beginner'
      },
      'intermediate': {
        className: 'badge badge-warning',
        label: 'Intermediate'
      },
      'advanced': {
        className: 'badge badge-error',
        label: 'Advanced'
      }
    };
    
    const badge = difficultyMap[difficulty];
    
    return (
      <span className={badge.className}>
        {badge.label}
      </span>
    );
  };
  
  // Get status badges
  const getStatusBadges = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {isNew && (
          <span className="badge badge-primary">New</span>
        )}
        {isRecommended && (
          <span className="badge badge-secondary">Recommended</span>
        )}
        {isPopular && (
          <span className="badge badge-secondary">Popular</span>
        )}
        {difficulty && getDifficultyBadge()}
      </div>
    );
  };
  
  // Get progress bar
  const getProgressBar = () => {
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
  
  const ageStyles = getAgeSpecificStyles();
  
  return (
    <Link href={href} passHref>
      <motion.div
        className={`${ageStyles.cardClass} ${className} overflow-hidden`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...ageStyles.animation}
      >
        {imageSrc && (
          <div className="relative w-full h-40 mb-4 overflow-hidden rounded-lg">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500"
              style={{
                transform: isHovered && !isReducedMotion ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          </div>
        )}
        
        <div>
          {learningStyle && getLearningStyleIndicator()}
          
          {getStatusBadges()}
          
          <h3 className={ageStyles.titleClass}>{title}</h3>
          
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
            {description}
          </p>
          
          {estimatedTime && (
            <div className="mt-3 flex items-centre text-xs text-neutral-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
              {estimatedTime}
            </div>
          )}
          
          {getProgressBar()}
        </div>
      </motion.div>
    </Link>
  );
};

export default EnhancedLearningCard;
