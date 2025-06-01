'use client';

import React from 'react';
import { cn } from '@/components/enhanced-theme-provider';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Typography, Card, Flex, Container } from '@/components/ui/enhanced-layout-components';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  imagePosition?: 'left' | 'right';
  overlay?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'full';
}

/**
 * Enhanced Hero Section Component
 * 
 * A visually appealing hero section component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
export function HeroSection({
  title,
  subtitle,
  image,
  imageAlt = 'Hero image',
  children,
  className,
  align = 'left',
  imagePosition = 'right',
  overlay = false,
  height = 'md',
}: HeroSectionProps) {
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-3xl overflow-hidden shadow-xl',
    'early-primary': 'rounded-2xl overflow-hidden shadow-lg',
    'late-primary': 'rounded-xl overflow-hidden shadow-md',
    'secondary': 'rounded-lg overflow-hidden shadow-sm',
  };
  
  // Height styles
  const heightStyles = {
    sm: 'min-h-[300px]',
    md: 'min-h-[400px]',
    lg: 'min-h-[500px]',
    full: 'min-h-screen',
  };
  
  // Alignment styles
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <div 
      className={cn(
        'relative w-full bg-background',
        heightStyles[height],
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          {overlay && (
            <div className="absolute inset-0 bg-black/50" />
          )}
        </div>
      )}
      
      {/* Content */}
      <Container 
        className={cn(
          'relative h-full flex items-center',
          imagePosition === 'left' ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div 
          className={cn(
            'w-full md:w-1/2 py-12',
            alignStyles[align],
            overlay ? 'text-white' : 'text-text-primary'
          )}
        >
          <Typography 
            variant="h1" 
            className={cn(
              'mb-4',
              overlay ? 'text-white' : 'text-primary'
            )}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="lead" 
              className="mb-6"
            >
              {subtitle}
            </Typography>
          )}
          
          {children}
        </div>
      </Container>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Enhanced Feature Card Component
 * 
 * A visually appealing feature card component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
export function FeatureCard({
  title,
  description,
  icon,
  image,
  imageAlt = 'Feature image',
  className,
  onClick,
}: FeatureCardProps) {
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl',
    'early-primary': 'rounded-xl p-5 border-2 shadow-md hover:shadow-lg',
    'late-primary': 'rounded-lg p-4 border shadow-sm hover:shadow-md',
    'secondary': 'rounded p-4 border hover:shadow-sm',
  };
  
  const cardProps = onClick ? {
    onClick,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    },
  } : {};
  
  return (
    <div 
      className={cn(
        'bg-background border-border transition-all duration-200',
        onClick ? 'cursor-pointer hover:border-primary/50' : '',
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
      {...cardProps}
    >
      {image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={imageAlt}
            width={400}
            height={225}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {icon && (
        <div className="mb-4 text-primary">
          {icon}
        </div>
      )}
      
      <Typography variant="h4" className="mb-2">
        {title}
      </Typography>
      
      <Typography variant="body" color="muted">
        {description}
      </Typography>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
  className?: string;
}

/**
 * Enhanced Testimonial Card Component
 * 
 * A visually appealing testimonial card component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating,
  className,
}: TestimonialCardProps) {
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-2xl p-6 border-2 shadow-lg bg-primary/5',
    'early-primary': 'rounded-xl p-5 border-2 shadow-md bg-primary/5',
    'late-primary': 'rounded-lg p-4 border shadow-sm bg-background',
    'secondary': 'rounded p-4 border bg-background',
  };
  
  return (
    <div 
      className={cn(
        'border-border',
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
    >
      {rating && (
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                'w-5 h-5',
                i < rating ? 'text-warning' : 'text-gray-300'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      
      <Typography variant="body" className="mb-4 italic">
        "{quote}"
      </Typography>
      
      <Flex align="center" gap="sm">
        {avatar && (
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src={avatar}
              alt={author}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <div>
          <Typography variant="h6" className="mb-0">
            {author}
          </Typography>
          
          {role && (
            <Typography variant="small" color="muted">
              {role}
            </Typography>
          )}
        </div>
      </Flex>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  className?: string;
  onCtaClick?: () => void;
}

/**
 * Enhanced Pricing Card Component
 * 
 * A visually appealing pricing card component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
export function PricingCard({
  title,
  price,
  description,
  features,
  cta,
  popular = false,
  className,
  onCtaClick,
}: PricingCardProps) {
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-2xl p-6 border-2 shadow-lg',
    'early-primary': 'rounded-xl p-5 border-2 shadow-md',
    'late-primary': 'rounded-lg p-4 border shadow-sm',
    'secondary': 'rounded p-4 border',
  };
  
  return (
    <div 
      className={cn(
        'bg-background border-border relative',
        popular ? 'border-primary shadow-md' : '',
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            Popular
          </span>
        </div>
      )}
      
      <Typography variant="h4" className="mb-2">
        {title}
      </Typography>
      
      <div className="mb-4">
        <Typography variant="h2" className="mb-0">
          {price}
        </Typography>
      </div>
      
      <Typography variant="body" color="muted" className="mb-6">
        {description}
      </Typography>
      
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="h-5 w-5 text-success mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <Typography variant="body">
              {feature}
            </Typography>
          </li>
        ))}
      </ul>
      
      <button
        className={cn(
          'w-full py-2 px-4 rounded-md font-medium transition-colors',
          popular
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-white text-primary border border-primary hover:bg-primary/5'
        )}
        onClick={onCtaClick}
      >
        {cta}
      </button>
    </div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

/**
 * Enhanced Stat Card Component
 * 
 * A visually appealing stat card component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
export function StatCard({
  value,
  label,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-2xl p-6 border-2 shadow-lg',
    'early-primary': 'rounded-xl p-5 border-2 shadow-md',
    'late-primary': 'rounded-lg p-4 border shadow-sm',
    'secondary': 'rounded p-4 border',
  };
  
  // Trend styles
  const trendStyles = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-text-secondary',
  };
  
  return (
    <div 
      className={cn(
        'bg-background border-border',
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
    >
      <Flex justify="between" align="start">
        <div>
          <Typography variant="h3" className="mb-1">
            {value}
          </Typography>
          
          <Typography variant="small" color="muted">
            {label}
          </Typography>
          
          {trend && trendValue && (
            <div className={cn('flex items-center mt-2', trendStyles[trend])}>
              {trend === 'up' && (
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              
              {trend === 'down' && (
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              
              <Typography variant="small" className={trendStyles[trend]}>
                {trendValue}
              </Typography>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-primary">
            {icon}
          </div>
        )}
      </Flex>
    </div>
  );
}
