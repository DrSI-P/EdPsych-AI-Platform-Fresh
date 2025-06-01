'use client';

import React from 'react';
import { Label } from './label';

// Add Form component export to fix build warning
export function Form({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form {...props}>
      {children}
    </form>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  const inputClasses = `
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-grey-300 focus:ring-blue-500 focus:border-blue-500'}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    block rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <Label htmlFor={props.id} className="mb-1">
          {label}
        </Label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-centre pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input className={inputClasses} {...props} />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-centre pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-sm text-grey-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  className?: string;
}

export function Textarea({
  label,
  error,
  hint,
  fullWidth = false,
  className = '',
  ...props
}: TextareaProps) {
  const textareaClasses = `
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-grey-300 focus:ring-blue-500 focus:border-blue-500'}
    ${fullWidth ? 'w-full' : ''}
    block rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <Label htmlFor={props.id} className="mb-1">
          {label}
        </Label>
      )}
      <textarea className={textareaClasses} {...props} />
      {hint && !error && <p className="mt-1 text-sm text-grey-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  error,
  hint,
  fullWidth = false,
  disabled = false,
  className = '',
  placeholder,
  ...props
}: SelectProps) {
  const selectClasses = `
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-grey-300 focus:ring-blue-500 focus:border-blue-500'}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'bg-grey-100 cursor-not-allowed' : ''}
    block rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:text-sm
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <Label htmlFor={props.id} className="mb-1">
          {label}
        </Label>
      )}
      <select
        className={selectClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="mt-1 text-sm text-grey-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onChange,
  description,
  disabled = false,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-centre h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={`
            h-4 w-4 rounded border-grey-300 text-blue-600 focus:ring-blue-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label className={`font-medium text-grey-700 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </label>
        {description && (
          <p className={`text-grey-500 ${disabled ? 'opacity-50' : ''}`}>{description}</p>
        )}
      </div>
    </div>
  );
}

interface RadioProps {
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({
  options,
  value,
  onChange,
  name,
  label,
  disabled = false,
  className = '',
  ...props
}: RadioProps) {
  return (
    <div className={className}>
      {label && <Label className="mb-2">{label}</Label>}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-centre h-5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                disabled={disabled}
                className={`
                  h-4 w-4 border-grey-300 text-blue-600 focus:ring-blue-500
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                {...props}
              />
            </div>
            <div className="ml-3 text-sm">
              <label className={`font-medium text-grey-700 ${disabled ? 'opacity-50' : ''}`}>
                {option.label}
              </label>
              {option.description && (
                <p className={`text-grey-500 ${disabled ? 'opacity-50' : ''}`}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormLabel({
  children,
  htmlFor,
  className = '',
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-grey-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

// Add the missing form components that are causing the build error

// Simple implementation of FormField
export function FormField({ name, children }: { name: string; children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

// Simple implementation of FormItem
export function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

// Simple implementation of FormControl
export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// Simple implementation of FormMessage
export function FormMessage({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm font-medium text-red-500">{children}</p>;
}

// Add missing FormDescription component that's causing build errors
export function FormDescription({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-gray-500 mt-1">{children}</p>;
}
