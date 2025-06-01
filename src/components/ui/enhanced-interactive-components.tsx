'use client';

import React from 'react';
import { cn } from '@/components/enhanced-theme-provider';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';
import { Typography, Card, Flex } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';

interface TabProps {
  children: React.ReactNode;
  className?: string;
  value: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  active?: boolean;
  onClick?: () => void;
}

interface TabsContentProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  active?: boolean;
}

interface TabsProps {
  children: React.ReactNode;
  className?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Enhanced Tabs Component
 * 
 * A comprehensive tabs component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

export function Tabs({
  children,
  className,
  defaultValue,
  value,
  onValueChange,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  
  const contextValue = React.useMemo(() => ({
    value: value !== undefined ? value : internalValue,
    onValueChange: (newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
  }), [value, internalValue, onValueChange]);
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'p-1 rounded-xl bg-primary/10 gap-2',
    'early-primary': 'p-1 rounded-lg bg-primary/10 gap-1',
    'late-primary': 'p-1 rounded-md bg-primary/10 gap-0.5',
    'secondary': 'border-b border-border gap-0',
  };
  
  return (
    <div 
      role="tablist" 
      className={cn(
        'flex flex-wrap items-center justify-start mb-4',
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ children, className, value, active, onClick }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const isActive = active !== undefined ? active : context.value === value;
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': isActive 
      ? 'bg-primary text-white rounded-lg px-4 py-3 font-bold shadow-md' 
      : 'bg-white text-text-primary rounded-lg px-4 py-3 hover:bg-gray-50',
    'early-primary': isActive 
      ? 'bg-primary text-white rounded-md px-4 py-2 font-semibold shadow-sm' 
      : 'bg-white text-text-primary rounded-md px-4 py-2 hover:bg-gray-50',
    'late-primary': isActive 
      ? 'bg-primary text-white rounded-md px-3 py-1.5 font-medium' 
      : 'bg-white text-text-primary rounded-md px-3 py-1.5 hover:bg-gray-50',
    'secondary': isActive 
      ? 'text-primary border-b-2 border-primary px-4 py-2 font-medium' 
      : 'text-text-secondary hover:text-text-primary px-4 py-2 border-b-2 border-transparent',
  };
  
  const handleClick = () => {
    context.onValueChange(value);
    if (onClick) onClick();
  };
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        'transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, className, value, active }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  const isActive = active !== undefined ? active : context.value === value;
  
  if (!isActive) return null;
  
  return (
    <div 
      role="tabpanel" 
      tabIndex={0}
      className={cn('focus:outline-none', className)}
    >
      {children}
    </div>
  );
}

interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
  title: React.ReactNode;
  value: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

/**
 * Enhanced Accordion Component
 * 
 * A comprehensive accordion component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
const AccordionContext = React.createContext<{
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  type: 'single' | 'multiple';
}>({
  value: '',
  onValueChange: () => {},
  type: 'single',
});

export function Accordion({
  children,
  className,
  type = 'single',
  defaultValue,
  value,
  onValueChange,
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === 'multiple' ? [] : '')
  );
  
  const contextValue = React.useMemo(() => ({
    value: value !== undefined ? value : internalValue,
    onValueChange: (newValue: string | string[]) => {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    type,
  }), [value, internalValue, onValueChange, type]);
  
  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('w-full space-y-2', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  className,
  title,
  value,
  defaultOpen,
  icon,
}: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  const [isOpen, setIsOpen] = React.useState(defaultOpen || false);
  const { ageGroup } = useEnhancedTheme();
  
  // Check if this item is open based on context
  const isOpenFromContext = Array.isArray(context.value)
    ? context.value.includes(value)
    : context.value === value;
  
  // Use context value if provided, otherwise use local state
  const isItemOpen = context.value !== undefined ? isOpenFromContext : isOpen;
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-xl border-2 shadow-sm',
    'early-primary': 'rounded-lg border-2',
    'late-primary': 'rounded-md border',
    'secondary': 'rounded-sm border',
  };
  
  const handleToggle = () => {
    if (context.type === 'single') {
      context.onValueChange(isItemOpen ? '' : value);
    } else {
      context.onValueChange(
        Array.isArray(context.value)
          ? isItemOpen
            ? context.value.filter(v => v !== value)
            : [...context.value, value]
          : [value]
      );
    }
    
    if (context.value === undefined) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div 
      className={cn(
        'overflow-hidden bg-background',
        ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
        className
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isItemOpen}
        className={cn(
          'flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-all',
          isItemOpen ? 'bg-primary/5' : 'hover:bg-gray-50'
        )}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          {typeof title === 'string' ? (
            <Typography variant="h6">{title}</Typography>
          ) : (
            title
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            isItemOpen ? 'rotate-180 transform' : ''
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isItemOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

/**
 * Enhanced Tooltip Component
 * 
 * A comprehensive tooltip component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
export function Tooltip({
  children,
  content,
  position = 'top',
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-xl p-3 text-base shadow-lg',
    'early-primary': 'rounded-lg p-2.5 text-base shadow-md',
    'late-primary': 'rounded-md p-2 text-sm shadow-sm',
    'secondary': 'rounded p-1.5 text-sm shadow-sm',
  };
  
  // Position styles
  const positionStyles = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 bg-background border border-border text-text-primary',
            positionStyles[position],
            ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
            className
          )}
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-background border border-border transform rotate-45',
              position === 'top' && 'bottom-0 left-1/2 -mb-1 -ml-1 border-t-0 border-l-0',
              position === 'right' && 'left-0 top-1/2 -ml-1 -mt-1 border-r-0 border-b-0',
              position === 'bottom' && 'top-0 left-1/2 -mt-1 -ml-1 border-b-0 border-r-0',
              position === 'left' && 'right-0 top-1/2 -mr-1 -mt-1 border-l-0 border-t-0'
            )}
          />
        </div>
      )}
    </div>
  );
}

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

/**
 * Enhanced Progress Component
 * 
 * A comprehensive progress component that implements the brand style guide
 * with consistent styling, accessibility features, and age-appropriate adaptations.
 */
export function Progress({
  value,
  max = 100,
  className,
  size = 'md',
  showValue = false,
  label,
  variant = 'default',
}: ProgressProps) {
  const percentage = Math.round((value / max) * 100);
  const { ageGroup } = useEnhancedTheme();
  
  // Age-appropriate styling
  const ageGroupStyles = {
    'nursery': 'rounded-full',
    'early-primary': 'rounded-full',
    'late-primary': 'rounded-full',
    'secondary': 'rounded',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  // Variant styles
  const variantStyles = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };
  
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <Typography variant="small" color="muted">
              {label}
            </Typography>
          )}
          {showValue && (
            <Typography variant="small" color="muted">
              {percentage}%
            </Typography>
          )}
        </div>
      )}
      
      <div
        className={cn(
          'w-full bg-gray-200',
          ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'transition-all duration-300',
            ageGroupStyles[ageGroup as keyof typeof ageGroupStyles],
            sizeStyles[size],
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

/**
 * Enhanced Avatar Component
 * 
 * A comprehensive avatar component that implements the brand style guide
 * with consistent styling and accessibility features.
 */
export function Avatar({
  src,
  alt,
  initials,
  size = 'md',
  className,
  status,
}: AvatarProps) {
  // Size styles
  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  
  // Status styles
  const statusStyles = {
    online: 'bg-success',
    away: 'bg-warning',
    busy: 'bg-error',
    offline: 'bg-gray-400',
  };
  
  // Status size styles
  const statusSizeStyles = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };
  
  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-gray-200 overflow-hidden',
          sizeStyles[size],
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-text-primary">
            {initials || (alt ? alt.charAt(0).toUpperCase() : 'U')}
          </span>
        )}
      </div>
      
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusStyles[status],
            statusSizeStyles[size]
          )}
        />
      )}
    </div>
  );
}
