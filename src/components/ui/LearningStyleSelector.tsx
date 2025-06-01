'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Headphones, PenTool } from 'lucide-react';

interface LearningStyleSelectorProps {
  onStyleChange?: (style: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing') => void;
  defaultStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  className?: string;
  animated?: boolean;
}

/**
 * Learning Style Selector Component
 * 
 * A branded, age-appropriate component that allows users to select their
 * preferred learning style, with visual indicators for each style.
 */
const LearningStyleSelector: React.FC<LearningStyleSelectorProps> = ({
  onStyleChange,
  defaultStyle = 'visual',
  className,
  animated = true
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Get age-appropriate styles
  const getSelectorStyles = () => {
    switch (ageGroup) {
      case 'nursery':
        return {
          container: 'rounded-3xl border-4 border-primary/20 p-5 bg-background',
          tabs: 'grid grid-cols-2 gap-4',
          tab: 'rounded-2xl p-4 flex flex-col items-centre text-centre gap-3 border-4',
          tabIcon: 'w-16 h-16 p-3 rounded-full',
          tabText: 'text-xl font-bold'
        };
      case 'early-primary':
        return {
          container: 'rounded-2xl border-2 border-primary/20 p-4 bg-background',
          tabs: 'grid grid-cols-2 gap-3',
          tab: 'rounded-xl p-3 flex flex-col items-centre text-centre gap-2 border-2',
          tabIcon: 'w-12 h-12 p-2 rounded-full',
          tabText: 'text-lg font-semibold'
        };
      case 'late-primary':
        return {
          container: 'rounded-xl border border-primary/20 p-3 bg-background',
          tabs: 'grid grid-cols-2 gap-2',
          tab: 'rounded-lg p-2 flex flex-col items-centre text-centre gap-2 border',
          tabIcon: 'w-10 h-10 p-2 rounded-full',
          tabText: 'text-base font-medium'
        };
      case 'secondary':
      default:
        return {
          container: 'rounded-lg border border-primary/20 p-3 bg-background',
          tabs: 'grid grid-cols-4 gap-2',
          tab: 'rounded-md p-2 flex flex-col items-centre text-centre gap-1 border',
          tabIcon: 'w-8 h-8 p-1.5 rounded-full',
          tabText: 'text-sm font-medium'
        };
    }
  };
  
  // Get style-specific styles
  const getStyleStyles = (style: string) => {
    switch (style) {
      case 'visual':
        return {
          bg: 'bg-primary-blue/10',
          border: 'border-primary-blue/30',
          iconBg: 'bg-primary-blue/20',
          text: 'text-primary-blue',
          activeBg: 'bg-primary-blue/20',
          activeBorder: 'border-primary-blue',
          activeIconBg: 'bg-primary-blue',
          activeIconText: 'text-white'
        };
      case 'auditory':
        return {
          bg: 'bg-secondary-coral/10',
          border: 'border-secondary-coral/30',
          iconBg: 'bg-secondary-coral/20',
          text: 'text-secondary-coral',
          activeBg: 'bg-secondary-coral/20',
          activeBorder: 'border-secondary-coral',
          activeIconBg: 'bg-secondary-coral',
          activeIconText: 'text-white'
        };
      case 'kinesthetic':
        return {
          bg: 'bg-secondary-amber/10',
          border: 'border-secondary-amber/30',
          iconBg: 'bg-secondary-amber/20',
          text: 'text-secondary-amber',
          activeBg: 'bg-secondary-amber/20',
          activeBorder: 'border-secondary-amber',
          activeIconBg: 'bg-secondary-amber',
          activeIconText: 'text-white'
        };
      case 'reading-writing':
        return {
          bg: 'bg-primary-purple/10',
          border: 'border-primary-purple/30',
          iconBg: 'bg-primary-purple/20',
          text: 'text-primary-purple',
          activeBg: 'bg-primary-purple/20',
          activeBorder: 'border-primary-purple',
          activeIconBg: 'bg-primary-purple',
          activeIconText: 'text-white'
        };
      default:
        return {
          bg: 'bg-primary-blue/10',
          border: 'border-primary-blue/30',
          iconBg: 'bg-primary-blue/20',
          text: 'text-primary-blue',
          activeBg: 'bg-primary-blue/20',
          activeBorder: 'border-primary-blue',
          activeIconBg: 'bg-primary-blue',
          activeIconText: 'text-white'
        };
    }
  };
  
  // Get style-specific icon
  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'visual':
        return <Video />;
      case 'auditory':
        return <Headphones />;
      case 'kinesthetic':
        return <PenTool />;
      case 'reading-writing':
        return <BookOpen />;
      default:
        return <Video />;
    }
  };
  
  const styles = getSelectorStyles();
  
  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const tabAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1 * custom,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };
  
  // Handle style change
  const handleStyleChange = (style: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing') => {
    if (onStyleChange) {
      onStyleChange(style);
    }
  };
  
  // Render learning style tabs
  const renderStyleTab = (style: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing', label: string, index: number) => {
    const styleStyles = getStyleStyles(style);
    const isActive = defaultStyle === style;
    
    const tabContent = (
      <div 
        className={cn(
          styles.tab,
          isActive ? styleStyles.activeBorder : styleStyles.border,
          isActive ? styleStyles.activeBg : styleStyles.bg,
          'cursor-pointer transition-all duration-200'
        )}
        onClick={() => handleStyleChange(style)}
      >
        <div className={cn(
          styles.tabIcon,
          isActive ? styleStyles.activeIconBg : styleStyles.iconBg,
          isActive ? styleStyles.activeIconText : styleStyles.text
        )}>
          {getStyleIcon(style)}
        </div>
        <span className={cn(
          styles.tabText,
          styleStyles.text
        )}>
          {label}
        </span>
      </div>
    );
    
    if (animated && !isReducedMotion) {
      return (
        <motion.div
          key={style}
          custom={index}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          variants={tabAnimation}
        >
          {tabContent}
        </motion.div>
      );
    }
    
    return (
      <div key={style}>
        {tabContent}
      </div>
    );
  };
  
  // Render component
  const renderContent = () => {
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.tabs}>
          {renderStyleTab('visual', 'Visual', 0)}
          {renderStyleTab('auditory', 'Auditory', 1)}
          {renderStyleTab('kinesthetic', 'Hands-on', 2)}
          {renderStyleTab('reading-writing', 'Reading/Writing', 3)}
        </div>
      </div>
    );
  };
  
  // Render with animations if enabled
  if (animated && !isReducedMotion) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerAnimation}
      >
        {renderContent()}
      </motion.div>
    );
  }
  
  // Render without animations
  return renderContent();
};

export default LearningStyleSelector;
