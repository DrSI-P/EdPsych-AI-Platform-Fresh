'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for page transitions
export const pageTransitionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Animation variants for staggered children
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Animation variants for individual items in a staggered container
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Animation variants for fade in
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5 
    }
  }
};

// Animation variants for scale in
export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Animation variants for slide in from left
export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Animation variants for slide in from right
export const slideInRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Animation variants for hover effects
export const hoverScaleVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2 
    }
  }
};

// Animation variants for button press
export const buttonTapVariants = {
  initial: { scale: 1 },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: 0.1 
    }
  }
};

// Animation variants for success notification
export const successNotificationVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.2 
    }
  }
};

// Animation variants for error notification
export const errorNotificationVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30 
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { 
      duration: 0.2 
    }
  }
};

// Reduced motion variants (for accessibility)
export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2 
    }
  }
};

// Wrapper component for animated page transitions
interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className = '' }: AnimatedPageProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransitionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Wrapper component for staggered animations
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = '',
  delay = 0.2,
  staggerDelay = 0.1
}: StaggerContainerProps) {
  const customVariants = {
    ...staggerContainerVariants,
    visible: {
      ...staggerContainerVariants.visible,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Component for staggered items
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function StaggerItem({ 
  children, 
  className = '',
  index = 0
}: StaggerItemProps) {
  const customVariants = {
    ...staggerItemVariants,
    visible: {
      ...staggerItemVariants.visible,
      transition: {
        ...staggerItemVariants.visible.transition,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover scale component
interface HoverScaleProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ 
  children, 
  className = '',
  scale = 1.05
}: HoverScaleProps) {
  const customVariants = {
    ...hoverScaleVariants,
    hover: {
      ...hoverScaleVariants.hover,
      scale
    }
  };

  return (
    <motion.div
      whileHover="hover"
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Button with tap animation
interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AnimatedButton({ 
  children, 
  className = '',
  onClick,
  disabled = false
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// Fade in component
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.5
}: FadeInProps) {
  const customVariants = {
    ...fadeInVariants,
    visible: {
      ...fadeInVariants.visible,
      transition: {
        ...fadeInVariants.visible.transition,
        delay,
        duration
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
