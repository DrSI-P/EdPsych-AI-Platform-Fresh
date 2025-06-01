'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ImmersiveControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: (degrees: number) => void;
  onReset?: () => void;
  zoomLevel?: number;
  onZoomChange?: (value: number) => void;
  className?: string;
}

/**
 * Immersive Controls Component
 * 
 * A component providing intuitive controls for navigating and interacting
 * with immersive content, with smooth animations and accessibility features.
 */
export function ImmersiveControls({
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  zoomLevel = 1,
  onZoomChange,
  className = ''
}: ImmersiveControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Control panel animation variants
  const controlPanelVariants = {
    collapsed: { 
      width: '48px',
      height: '48px',
      borderRadius: '24px',
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    expanded: { 
      width: '240px',
      height: 'auto',
      borderRadius: '12px',
      transition: { 
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  // Control item animation variants
  const controlItemVariants = {
    collapsed: { 
      opacity: 0,
      y: 10,
      transition: { 
        duration: 0.2
      }
    },
    expanded: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3
      }
    }
  };
  
  // Toggle button animation variants
  const toggleButtonVariants = {
    collapsed: { 
      rotate: 0,
      transition: { 
        duration: 0.3
      }
    },
    expanded: { 
      rotate: 45,
      transition: { 
        duration: 0.3
      }
    }
  };
  
  // Handle toggle expansion
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <motion.div
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={controlPanelVariants}
      className={`immersive-controls bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden ${className}`}
    >
      {/* Toggle button */}
      <motion.button
        variants={toggleButtonVariants}
        onClick={handleToggleExpand}
        className={`w-12 h-12 flex items-centre justify-centre ${isExpanded ? 'absolute top-2 right-2' : 'w-full h-full'}`}
        aria-label={isExpanded ? "Collapse controls" : "Expand controls"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </motion.button>
      
      {/* Control panel content */}
      <div className={`p-4 pt-14 space-y-4 ${isExpanded ? 'block' : 'hidden'}`}>
        <motion.div variants={controlItemVariants} className="space-y-2">
          <div className="flex items-centre justify-between">
            <span className="text-sm font-medium">Zoom</span>
            <span className="text-xs text-grey-500">{Math.round(zoomLevel * 100)}%</span>
          </div>
          <div className="flex items-centre space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomOut}
              className="h-8 w-8 p-0 flex items-centre justify-centre"
              aria-label="Zoom out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </Button>
            
            <div className="flex-grow">
              <Slider
                value={[zoomLevel * 100]}
                min={50}
                max={200}
                step={5}
                onValueChange={(value) => onZoomChange && onZoomChange(value[0] / 100)}
                aria-label="Zoom level"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomIn}
              className="h-8 w-8 p-0 flex items-centre justify-centre"
              aria-label="Zoom in"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Button>
          </div>
        </motion.div>
        
        <motion.div variants={controlItemVariants} className="space-y-2">
          <div className="flex items-centre justify-between">
            <span className="text-sm font-medium">Rotation</span>
          </div>
          <div className="flex items-centre justify-between space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRotate && onRotate(-90)}
              className="h-8 flex-1 flex items-centre justify-centre"
              aria-label="Rotate left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Left
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRotate && onRotate(90)}
              className="h-8 flex-1 flex items-centre justify-centre"
              aria-label="Rotate right"
            >
              Right
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </div>
        </motion.div>
        
        <motion.div variants={controlItemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full h-8"
            aria-label="Reset view"
          >
            Reset View
          </Button>
        </motion.div>
        
        <motion.div variants={controlItemVariants} className="pt-2 border-t border-grey-200">
          <div className="text-xs text-grey-500">
            <p className="mb-1">Keyboard shortcuts:</p>
            <ul className="space-y-1">
              <li><span className="font-mono bg-grey-100 px-1 rounded">+</span> / <span className="font-mono bg-grey-100 px-1 rounded">-</span> - Zoom in/out</li>
              <li><span className="font-mono bg-grey-100 px-1 rounded">R</span> - Reset view</li>
              <li><span className="font-mono bg-grey-100 px-1 rounded">←</span> / <span className="font-mono bg-grey-100 px-1 rounded">→</span> - Rotate</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
