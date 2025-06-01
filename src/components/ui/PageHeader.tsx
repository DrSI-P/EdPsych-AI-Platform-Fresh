'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  animated?: boolean;
}

/**
 * Page Header Component
 * 
 * A consistent, branded page header that adapts to different age groups
 * and provides a cohesive visual identity across the platform.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className,
  animated = true
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Get age-appropriate styles
  const getHeaderStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          container: 'rounded-3xl bg-primary/5 border-2 border-primary/20 p-6 mb-8',
          title: 'text-3xl font-bold text-gradient',
          description: 'text-xl text-muted-foreground mt-2'
        };
      case 'early-primary':
        return {
          container: 'rounded-2xl bg-primary/5 border border-primary/20 p-5 mb-6',
          title: 'text-2xl font-bold text-primary',
          description: 'text-lg text-muted-foreground mt-2'
        };
      case 'late-primary':
        return {
          container: 'rounded-xl bg-primary/5 p-4 mb-6',
          title: 'text-xl font-semibold text-primary',
          description: 'text-base text-muted-foreground mt-1.5'
        };
      case 'secondary':
      default:
        return {
          container: 'rounded-lg p-4 mb-6',
          title: 'text-2xl font-semibold',
          description: 'text-base text-muted-foreground mt-1.5'
        };
    }
  };
  
  const styles = getHeaderStyles();
  
  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const titleAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.1,
        ease: "easeOut"
      }
    }
  };
  
  const descriptionAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  // Render with animations if enabled
  if (animated && !isReducedMotion) {
    return (
      <motion.div
        className={cn(styles.container, className)}
        initial="hidden"
        animate="visible"
        variants={containerAnimation}
      >
        <motion.h1 
          className={styles.title}
          variants={titleAnimation}
        >
          {title}
        </motion.h1>
        
        {description && (
          <motion.p 
            className={styles.description}
            variants={descriptionAnimation}
          >
            {description}
          </motion.p>
        )}
        
        {children && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    );
  }
  
  // Render without animations
  return (
    <div className={cn(styles.container, className)}>
      <h1 className={styles.title}>{title}</h1>
      
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      
      {children && (
        <div className="mt-4">{children}</div>
      )}
    </div>
  );
};

export default PageHeader;
