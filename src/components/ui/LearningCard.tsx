'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface LearningCardProps {
  title: string;
  description?: string;
  image?: string;
  imageUrl?: string; // Added for backward compatibility with tests
  href?: string;
  category?: string;
  level?: string;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  progress?: number;
  children?: React.ReactNode;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

/**
 * Learning Card Component
 * 
 * A branded, age-appropriate card for learning content that adapts to
 * different learning styles and age groups.
 */
const LearningCard: React.FC<LearningCardProps> = ({
  title,
  description,
  image,
  imageUrl, // Support both image and imageUrl for backward compatibility
  href,
  category,
  level,
  learningStyle,
  progress,
  children,
  className,
  animated = true,
  onClick
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Get age-appropriate styles
  const getCardStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          container: 'rounded-3xl border-4 shadow-lg overflow-hidden',
          header: 'pb-2',
          title: 'text-2xl font-bold',
          description: 'text-lg',
          image: 'rounded-2xl overflow-hidden',
          footer: 'pt-2'
        };
      case 'early-primary':
        return {
          container: 'rounded-2xl border-2 shadow-md overflow-hidden',
          header: 'pb-3',
          title: 'text-xl font-semibold',
          description: 'text-base',
          image: 'rounded-xl overflow-hidden',
          footer: 'pt-3'
        };
      case 'late-primary':
        return {
          container: 'rounded-xl border shadow-sm overflow-hidden',
          header: 'pb-3',
          title: 'text-lg font-medium',
          description: 'text-sm',
          image: 'rounded-lg overflow-hidden',
          footer: 'pt-3'
        };
      case 'secondary':
      default:
        return {
          container: 'rounded-lg border shadow-sm overflow-hidden',
          header: 'pb-3',
          title: 'text-lg font-medium',
          description: 'text-sm',
          image: 'rounded-md overflow-hidden',
          footer: 'pt-3'
        };
    }
  };
  
  // Get learning style specific styles
  const getLearningStyleStyles = () => {
    if (!learningStyle) return {};
    
    switch (learningStyle) {
      case 'visual':
        return {
          border: 'border-l-4 border-l-primary-blue',
          accent: 'bg-primary-blue/10'
        };
      case 'auditory':
        return {
          border: 'border-l-4 border-l-secondary-coral',
          accent: 'bg-secondary-coral/10'
        };
      case 'kinesthetic':
        return {
          border: 'border-l-4 border-l-secondary-amber',
          accent: 'bg-secondary-amber/10'
        };
      case 'reading-writing':
        return {
          border: 'border-l-4 border-l-primary-purple',
          accent: 'bg-primary-purple/10'
        };
      default:
        return {};
    }
  };
  
  const styles = getCardStyles();
  const learningStyleStyles = getLearningStyleStyles();
  
  // Animation variants
  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  // Render card content
  const renderCardContent = () => {
    const cardContent = (
      <Card 
        className={cn(
          styles.container,
          learningStyleStyles.border,
          (onClick || href) && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <CardHeader className={cn(styles.header, learningStyleStyles.accent)}>
          <CardTitle className={styles.title}>{title}</CardTitle>
          {description && <p className={styles.description}>{description}</p>}
          {category && <p className="text-sm text-muted-foreground">{category}</p>}
          {level && <p className="text-sm text-muted-foreground">{level}</p>}
        </CardHeader>
        
        <CardContent>
          {(image || imageUrl) && (
            <div className={cn(styles.image, 'mb-4')}>
              <img src={image || imageUrl} alt={title} className="w-full h-auto" />
            </div>
          )}
          
          {children}
          
          {progress !== undefined && (
            <div className="mt-4">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% complete</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className={styles.footer}>
          {/* Footer content */}
        </CardFooter>
      </Card>
    );

    // If href is provided, wrap the card in a Link component
    if (href) {
      return <Link href={href}>{cardContent}</Link>;
    }

    return cardContent;
  };
  
  // Render with animations if enabled
  if (animated && !isReducedMotion) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardAnimation}
      >
        {renderCardContent()}
      </motion.div>
    );
  }
  
  // Render without animations
  return renderCardContent();
};

export default LearningCard;
