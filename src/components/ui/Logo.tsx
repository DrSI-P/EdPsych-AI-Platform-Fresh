'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'default' | 'compact' | 'text-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

/**
 * Brand Logo Component
 * 
 * A flexible logo component that adapts to different contexts and sizes
 * while maintaining the EdPsych Connect brand identity.
 */
const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'md',
  className,
  animated = true
}) => {
  const { ageGroup, isReducedMotion } = useTheme();
  
  // Size mappings
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };
  
  // Text size mappings
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };
  
  // Determine logo path based on variant and theme
  const getLogoPath = () => {
    if (variant === 'compact') {
      return '/images/logo-icon.svg';
    }
    return '/images/logo-full.svg';
  };
  
  // Animation variants
  const logoAnimation = {
    initial: { scale: 0.95, opacity: 0.8 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };
  
  // Text animation variants
  const textAnimation = {
    initial: { y: 5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, delay: 0.2, ease: "easeOut" }
  };
  
  // Render text-only variant
  if (variant === 'text-only') {
    return (
      <Link href="/">
        <div className={cn('flex items-centre', className)}>
          {animated && !isReducedMotion ? (
            <motion.span
              initial={textAnimation.initial}
              animate={textAnimation.animate}
              transition={textAnimation.transition}
              className={cn(
                'font-bold tracking-tight text-gradient',
                textSizeClasses[size]
              )}
            >
              EdPsych Connect
            </motion.span>
          ) : (
            <span
              className={cn(
                'font-bold tracking-tight text-gradient',
                textSizeClasses[size]
              )}
            >
              EdPsych Connect
            </span>
          )}
        </div>
      </Link>
    );
  }
  
  // Render image-based variants
  return (
    <Link href="/">
      <div className={cn('flex items-centre', className)}>
        {animated && !isReducedMotion ? (
          <motion.div
            initial={logoAnimation.initial}
            animate={logoAnimation.animate}
            transition={logoAnimation.transition}
            className={cn(sizeClasses[size], 'relative')}
          >
            <Image
              src={getLogoPath()}
              alt="EdPsych Connect Logo"
              width={variant === 'compact' ? 40 : 180}
              height={40}
              className="h-full w-auto"
              priority
            />
          </motion.div>
        ) : (
          <div className={cn(sizeClasses[size], 'relative')}>
            <Image
              src={getLogoPath()}
              alt="EdPsych Connect Logo"
              width={variant === 'compact' ? 40 : 180}
              height={40}
              className="h-full w-auto"
              priority
            />
          </div>
        )}
        
        {variant === 'default' && (
          <div className="ml-2 hidden md:block">
            {animated && !isReducedMotion ? (
              <motion.span
                initial={textAnimation.initial}
                animate={textAnimation.animate}
                transition={textAnimation.transition}
                className={cn(
                  'font-bold tracking-tight',
                  textSizeClasses[size]
                )}
              >
                <span className="text-primary">EdPsych</span>{' '}
                <span className="text-primary-blue">Connect</span>
              </motion.span>
            ) : (
              <span
                className={cn(
                  'font-bold tracking-tight',
                  textSizeClasses[size]
                )}
              >
                <span className="text-primary">EdPsych</span>{' '}
                <span className="text-primary-blue">Connect</span>
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default Logo;
