'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MicroInteractionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Button Hover Effect
 * 
 * Adds a subtle scale and shadow effect on hover for buttons
 */
export function ButtonHoverEffect({ children, className }: MicroInteractionProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Card Hover Effect
 * 
 * Adds a subtle lift and shadow effect on hover for cards
 */
export function CardHoverEffect({ children, className }: MicroInteractionProps) {
  return (
    <motion.div
      className={cn("transition-all duration-300", className)}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Focus Highlight
 * 
 * Adds a subtle highlight effect when an element is focused
 */
export function FocusHighlight({ children, className }: MicroInteractionProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div 
      className={cn("relative", className)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 rounded-md ring-2 ring-blue-500 ring-opacity-50 pointer-events-none"
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

/**
 * Success Animation
 * 
 * Displays a success animation (checkmark)
 */
export function SuccessAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-centre justify-centre", className)}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className="bg-green-100 rounded-full p-2"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

/**
 * Error Animation
 * 
 * Displays an error animation (X mark)
 */
export function ErrorAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-centre justify-centre", className)}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className="bg-red-100 rounded-full p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-600"
        >
          <motion.line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Loading Spinner with Micro-interactions
 * 
 * An enhanced loading spinner with subtle animations
 */
export function LoadingSpinner({ className, size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  return (
    <div className={cn("flex items-centre justify-centre", className)}>
      <motion.div
        className={cn("border-t-transparent rounded-full border-4", sizeClasses[size])}
        style={{ borderTopColor: "transparent" }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          ease: "linear", 
          repeat: Infinity 
        }}
      />
    </div>
  );
}

/**
 * Notification Toast
 * 
 * A toast notification with entrance and exit animations
 */
export function NotificationToast({ 
  message, 
  type = "info", 
  onClose,
  className
}: { 
  message: string, 
  type?: "info" | "success" | "error" | "warning", 
  onClose?: () => void,
  className?: string
}) {
  const typeClasses = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200"
  };
  
  const iconMap = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-centre p-4 rounded-md border shadow-sm",
        typeClasses[type],
        className
      )}
    >
      <div className="flex-shrink-0 mr-3">
        {iconMap[type]}
      </div>
      <div className="flex-1">
        {message}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-grey-400 hover:text-grey-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

/**
 * Ripple Effect
 * 
 * Adds a ripple effect on click for buttons and interactive elements
 */
export function RippleEffect({ children, className }: MicroInteractionProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  
  const addRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const size = Math.max(rect.width, rect.height) * 2;
    const id = Date.now();
    
    setRipples([...ripples, { id, x, y, size }]);
    
    setTimeout(() => {
      setRipples(ripples => ripples.filter(ripple => ripple.id !== id));
    }, 1000);
  };
  
  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      onClick={addRipple}
    >
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute rounded-full bg-white bg-opacity-30 pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {children}
    </div>
  );
}

/**
 * Hover Info
 * 
 * Shows additional information on hover
 */
export function HoverInfo({ 
  children, 
  info, 
  className 
}: { 
  children: React.ReactNode, 
  info: React.ReactNode,
  className?: string 
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-grey-900 text-white text-sm rounded-md px-3 py-2 shadow-lg"
          >
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-grey-900" />
            {info}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Scroll Indicator
 * 
 * Shows a progress bar indicating scroll position
 */
export function ScrollIndicator({ className }: { className?: string }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.div 
      className={cn("fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50", className)}
      style={{ width: `${scrollProgress}%` }}
    />
  );
}
