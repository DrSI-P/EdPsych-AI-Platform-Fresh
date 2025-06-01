'use client';

import React from 'react';
import { cn } from '@/components/enhanced-theme-provider';
import { useEnhancedTheme } from '@/components/enhanced-theme-provider';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Enhanced Button Component
 * 
 * A comprehensive button component that implements the brand style guide
 * with consistent styling, states, and accessibility features.
 */
export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-white text-primary border border-primary hover:bg-primary/5 focus:ring-primary',
    tertiary: 'bg-transparent text-primary hover:bg-primary/5 focus:ring-primary',
    outline: 'bg-transparent border border-border text-text-primary hover:border-primary hover:text-primary focus:ring-primary',
    ghost: 'bg-transparent text-text-primary hover:bg-gray-100 focus:ring-primary',
    link: 'bg-transparent text-primary underline hover:text-primary-dark focus:ring-0 p-0',
    danger: 'bg-error text-white hover:bg-error-dark focus:ring-error',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    icon: 'p-2',
  };
  
  // Width styles
  const widthStyles = isFullWidth ? 'w-full' : '';
  
  // Loading state
  const loadingState = isLoading ? 'relative text-transparent' : '';
  
  // Combine all styles
  const combinedStyles = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyles,
    loadingState,
    className
  );
  
  return (
    <button
      type={type}
      className={combinedStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      
      {leftIcon && <span className={cn('mr-2', { 'opacity-0': isLoading })}>{leftIcon}</span>}
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      {rightIcon && <span className={cn('ml-2', { 'opacity-0': isLoading })}>{rightIcon}</span>}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
}

/**
 * Enhanced Input Component
 * 
 * A comprehensive input component that implements the brand style guide
 * with consistent styling, states, and accessibility features.
 */
export function Input({
  className = '',
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  isFullWidth = false,
  id,
  ...props
}: InputProps) {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base styles
  const baseStyles = 'rounded-md border border-border bg-background px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:bg-gray-100';
  
  // Error styles
  const errorStyles = error ? 'border-error focus:ring-error focus:border-error' : '';
  
  // Icon styles
  const leftIconStyles = leftIcon ? 'pl-10' : '';
  const rightIconStyles = rightIcon ? 'pr-10' : '';
  
  // Width styles
  const widthStyles = isFullWidth ? 'w-full' : '';
  
  // Combine all styles
  const combinedStyles = cn(
    baseStyles,
    errorStyles,
    leftIconStyles,
    rightIconStyles,
    widthStyles,
    className
  );
  
  return (
    <div className={cn('flex flex-col', isFullWidth ? 'w-full' : '')}>
      {label && (
        <label htmlFor={inputId} className="mb-1 text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={combinedStyles}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText || error ? `${inputId}-description` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || error) && (
        <p 
          id={`${inputId}-description`} 
          className={cn(
            'mt-1 text-sm', 
            error ? 'text-error' : 'text-text-secondary'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  isFullWidth?: boolean;
}

/**
 * Enhanced Select Component
 * 
 * A comprehensive select component that implements the brand style guide
 * with consistent styling, states, and accessibility features.
 */
export function Select({
  className = '',
  label,
  helperText,
  error,
  options,
  isFullWidth = false,
  id,
  ...props
}: SelectProps) {
  // Generate a unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base styles
  const baseStyles = 'rounded-md border border-border bg-background px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:bg-gray-100 appearance-none pr-10';
  
  // Error styles
  const errorStyles = error ? 'border-error focus:ring-error focus:border-error' : '';
  
  // Width styles
  const widthStyles = isFullWidth ? 'w-full' : '';
  
  // Combine all styles
  const combinedStyles = cn(
    baseStyles,
    errorStyles,
    widthStyles,
    className
  );
  
  return (
    <div className={cn('flex flex-col', isFullWidth ? 'w-full' : '')}>
      {label && (
        <label htmlFor={selectId} className="mb-1 text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          className={combinedStyles}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText || error ? `${selectId}-description` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {(helperText || error) && (
        <p 
          id={`${selectId}-description`} 
          className={cn(
            'mt-1 text-sm', 
            error ? 'text-error' : 'text-text-secondary'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
  error?: string;
}

/**
 * Enhanced Checkbox Component
 * 
 * A comprehensive checkbox component that implements the brand style guide
 * with consistent styling, states, and accessibility features.
 */
export function Checkbox({
  className = '',
  label,
  helperText,
  error,
  id,
  ...props
}: CheckboxProps) {
  // Generate a unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={checkboxId}
            type="checkbox"
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={helperText || error ? `${checkboxId}-description` : undefined}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={checkboxId} className="font-medium text-text-primary">
            {label}
          </label>
        </div>
      </div>
      
      {(helperText || error) && (
        <p 
          id={`${checkboxId}-description`} 
          className={cn(
            'mt-1 text-sm ml-7', 
            error ? 'text-error' : 'text-text-secondary'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
  error?: string;
}

/**
 * Enhanced Radio Component
 * 
 * A comprehensive radio component that implements the brand style guide
 * with consistent styling, states, and accessibility features.
 */
export function Radio({
  className = '',
  label,
  helperText,
  error,
  id,
  ...props
}: RadioProps) {
  // Generate a unique ID if not provided
  const radioId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={radioId}
            type="radio"
            className="w-4 h-4 text-primary border-border rounded-full focus:ring-primary focus:ring-2"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={helperText || error ? `${radioId}-description` : undefined}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={radioId} className="font-medium text-text-primary">
            {label}
          </label>
        </div>
      </div>
      
      {(helperText || error) && (
        <p 
          id={`${radioId}-description`} 
          className={cn(
            'mt-1 text-sm ml-7', 
            error ? 'text-error' : 'text-text-secondary'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isFullWidth?: boolean;
}

/**
 * Enhanced Textarea Component
 * 
 * A comprehensive textarea component that implements the brand style guide
 * with consistent styling, states, and accessibility features.
 */
export function Textarea({
  className = '',
  label,
  helperText,
  error,
  isFullWidth = false,
  id,
  ...props
}: TextareaProps) {
  // Generate a unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base styles
  const baseStyles = 'rounded-md border border-border bg-background px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:bg-gray-100';
  
  // Error styles
  const errorStyles = error ? 'border-error focus:ring-error focus:border-error' : '';
  
  // Width styles
  const widthStyles = isFullWidth ? 'w-full' : '';
  
  // Combine all styles
  const combinedStyles = cn(
    baseStyles,
    errorStyles,
    widthStyles,
    className
  );
  
  return (
    <div className={cn('flex flex-col', isFullWidth ? 'w-full' : '')}>
      {label && (
        <label htmlFor={textareaId} className="mb-1 text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={combinedStyles}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={helperText || error ? `${textareaId}-description` : undefined}
        {...props}
      />
      
      {(helperText || error) && (
        <p 
          id={`${textareaId}-description`} 
          className={cn(
            'mt-1 text-sm', 
            error ? 'text-error' : 'text-text-secondary'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Enhanced Badge Component
 * 
 * A comprehensive badge component that implements the brand style guide
 * with consistent styling and accessibility features.
 */
export function Badge({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-text-secondary',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    outline: 'bg-transparent border border-border text-text-secondary',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );
  
  return (
    <span className={combinedStyles} {...props}>
      {children}
    </span>
  );
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

/**
 * Enhanced Alert Component
 * 
 * A comprehensive alert component that implements the brand style guide
 * with consistent styling and accessibility features.
 */
export function Alert({
  children,
  className = '',
  variant = 'info',
  title,
  icon,
  onClose,
  ...props
}: AlertProps) {
  // Base styles
  const baseStyles = 'rounded-md p-4';
  
  // Variant styles
  const variantStyles = {
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };
  
  // Combine all styles
  const combinedStyles = cn(
    baseStyles,
    variantStyles[variant],
    className
  );
  
  return (
    <div className={combinedStyles} role="alert" {...props}>
      <div className="flex">
        {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={cn('text-sm', title ? 'mt-2' : '')}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
            onClick={onClose}
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
