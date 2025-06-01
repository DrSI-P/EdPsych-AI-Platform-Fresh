'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Add missing toast components to fix build warnings
export interface ToastTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ToastTitle({ children, className = '' }: ToastTitleProps) {
  return (
    <div className={`font-medium text-sm ${className}`}>
      {children}
    </div>
  );
}

export interface ToastDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function ToastDescription({ children, className = '' }: ToastDescriptionProps) {
  return (
    <div className={`text-sm opacity-90 ${className}`}>
      {children}
    </div>
  );
}

export interface ToastCloseProps {
  onClick?: () => void;
  className?: string;
}

export function ToastClose({ onClick, className = '' }: ToastCloseProps) {
  return (
    <button 
      onClick={onClick} 
      className={`ml-auto flex h-6 w-6 items-centre justify-centre rounded-md hover:bg-grey-100 ${className}`}
      aria-label="Close"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  );
}

export interface ToastViewportProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-centre' | 'bottom-centre';
}

export function ToastViewport({ 
  children, 
  className = '',
  position = 'bottom-right'
}: ToastViewportProps) {
  // Map position to position classes
  const positionClasses = {
    'top-right': 'top-0 right-0 flex flex-col pt-4 pr-4',
    'top-left': 'top-0 left-0 flex flex-col pt-4 pl-4',
    'bottom-right': 'bottom-0 right-0 flex flex-col pb-4 pr-4',
    'bottom-left': 'bottom-0 left-0 flex flex-col pb-4 pl-4',
    'top-centre': 'top-0 left-1/2 transform -translate-x-1/2 flex flex-col pt-4',
    'bottom-centre': 'bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col pb-4',
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      {children}
    </div>
  );
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-centre' | 'bottom-centre';
  className?: string;
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right',
  className = '',
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Allow time for exit animation
      }
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  // Map type to colour classes
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  // Map position to position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-centre': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-centre': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed ${positionClasses[position]} z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${
          typeClasses[type]
        } text-white px-4 py-3 rounded shadow-lg flex items-centre ${className}`}
        role="alert"
      >
        {type === 'success' && (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
        {type === 'error' && (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        )}
        {type === 'warning' && (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        )}
        {type === 'info' && (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        )}
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) {
              setTimeout(onClose, 300);
            }
          }}
          className="ml-4 text-white"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'onClose'>) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...props, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
